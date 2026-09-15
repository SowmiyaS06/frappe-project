"""
Temporary storage layer for indexed code units.

Uses SQLite as the Phase-1 "temporary DB" — good enough to prototype
the scanner/parser against before Person 4 swaps this out for a real
vector DB. Schema follows Section 6 of the design doc exactly, so
Person 4 can consume this table (or its JSON export) without needing
a schema renegotiation later.
"""

import sqlite3
import json
import os
from contextlib import contextmanager

SCHEMA = """
CREATE TABLE IF NOT EXISTS code_units (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    app_name        TEXT NOT NULL,
    module          TEXT,
    doctype         TEXT,
    file_path       TEXT NOT NULL,
    symbol_name     TEXT NOT NULL,
    unit_type       TEXT NOT NULL,   -- function | class | method | doctype | api_endpoint | js_handler
    language        TEXT NOT NULL,   -- python | javascript | json
    source_code     TEXT,
    docstring       TEXT,
    decorators      TEXT,            -- JSON-encoded list
    related_doctypes TEXT,           -- JSON-encoded list
    dependencies    TEXT,            -- JSON-encoded list
    git_commit      TEXT,
    indexed_at      TEXT NOT NULL,
    -- dedupe key: same file + symbol shouldn't be inserted twice on re-scan
    UNIQUE(file_path, symbol_name, unit_type)
);

CREATE INDEX IF NOT EXISTS idx_app_name ON code_units(app_name);
CREATE INDEX IF NOT EXISTS idx_unit_type ON code_units(unit_type);
CREATE INDEX IF NOT EXISTS idx_doctype ON code_units(doctype);
"""


@contextmanager
def get_connection(db_path):
    os.makedirs(os.path.dirname(os.path.abspath(db_path)) or ".", exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db(db_path):
    with get_connection(db_path) as conn:
        conn.executescript(SCHEMA)


def upsert_unit(conn, unit: dict):
    """
    Insert a structured unit. On (file_path, symbol_name, unit_type) conflict
    (i.e. this file was re-scanned), replace the existing record — this is
    the hook Person 2 will later wire incremental re-indexing through
    (Section 21): only changed files get re-parsed and re-upserted here.
    """
    fields = [
        "app_name", "module", "doctype", "file_path", "symbol_name",
        "unit_type", "language", "source_code", "docstring",
        "decorators", "related_doctypes", "dependencies",
        "git_commit", "indexed_at",
    ]
    row = {k: unit.get(k) for k in fields}
    row["decorators"] = json.dumps(unit.get("decorators") or [])
    row["related_doctypes"] = json.dumps(unit.get("related_doctypes") or [])
    row["dependencies"] = json.dumps(unit.get("dependencies") or [])

    placeholders = ", ".join(f":{k}" for k in fields)
    columns = ", ".join(fields)
    conn.execute(
        f"""
        INSERT INTO code_units ({columns}) VALUES ({placeholders})
        ON CONFLICT(file_path, symbol_name, unit_type) DO UPDATE SET
            source_code=excluded.source_code,
            docstring=excluded.docstring,
            decorators=excluded.decorators,
            related_doctypes=excluded.related_doctypes,
            dependencies=excluded.dependencies,
            git_commit=excluded.git_commit,
            indexed_at=excluded.indexed_at
        """,
        row,
    )


def fetch_all(db_path):
    with get_connection(db_path) as conn:
        rows = conn.execute("SELECT * FROM code_units").fetchall()
        return [dict(r) for r in rows]


def export_json(db_path, out_path):
    """Dump the full index as JSON — the handoff format for Person 4."""
    units = fetch_all(db_path)
    for u in units:
        for f in ("decorators", "related_doctypes", "dependencies"):
            u[f] = json.loads(u[f]) if u[f] else []
    with open(out_path, "w") as f:
        json.dump(units, f, indent=2)
    return len(units)
