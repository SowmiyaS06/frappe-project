"""
Bench scanner (Section 5, "Step 1 — Scan source code").

Expects a Frappe-style layout:

    <bench_path>/apps/<app_name>/<app_name>/<module>/...

Walks every installed app, dispatches each file to the right parser
by extension, and upserts the resulting structured units into the
temporary SQLite DB (db.py).

Standalone-runnable and doesn't require a real Frappe install —
point it at any directory that follows the apps/<app>/<app>/... shape,
including the mock bench used in the smoke test below.
"""

import os
import subprocess
import datetime

from . import db
from project.parser.py_parser import parse_python_file
from project.parser.doctype_parser import parse_doctype_file
from project.parser.js_parser import parse_js_file

SKIP_DIRS = {"node_modules", ".git", "__pycache__", "public", "www", "test", "tests"}


def _get_git_commit(app_dir):
    try:
        out = subprocess.run(
            ["git", "-C", app_dir, "rev-parse", "--short", "HEAD"],
            capture_output=True, text=True, timeout=5,
        )
        return out.stdout.strip() or None
    except Exception:
        return None


def _infer_module(app_root, file_path):
    """
    Best-effort module name: the directory immediately under
    <app_root>/<app_name>/ that the file lives in.
    e.g. apps/hrms/hrms/leave_management/doctype/... -> 'leave_management'
    """
    try:
        rel = os.path.relpath(file_path, app_root)
        parts = rel.split(os.sep)
        return parts[0] if parts else None
    except ValueError:
        return None


def list_installed_apps(bench_path):
    apps_dir = os.path.join(bench_path, "apps")
    if not os.path.isdir(apps_dir):
        raise FileNotFoundError(f"No apps/ directory found under {bench_path}")
    return sorted(
        name for name in os.listdir(apps_dir)
        if os.path.isdir(os.path.join(apps_dir, name))
    )


def scan_bench(bench_path, db_path, apps=None, verbose=True):
    """
    Full Phase-1 scan: every installed app -> every source file ->
    structured units -> upserted into db_path.

    Returns a summary dict with counts per unit_type.
    """
    db.init_db(db_path)
    indexed_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
    apps_dir = os.path.join(bench_path, "apps")
    app_names = apps or list_installed_apps(bench_path)

    summary = {"files_scanned": 0, "units_indexed": 0, "by_type": {}, "errors": []}

    with db.get_connection(db_path) as conn:
        for app_name in app_names:
            app_dir = os.path.join(apps_dir, app_name)
            # the inner <app_name>/<app_name> package dir, where module code actually lives
            inner_root = os.path.join(app_dir, app_name)
            walk_root = inner_root if os.path.isdir(inner_root) else app_dir
            git_commit = _get_git_commit(app_dir)

            if verbose:
                print(f"Scanning app: {app_name}  ({walk_root})")

            for root, dirs, files in os.walk(walk_root):
                dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]

                for fname in files:
                    fpath = os.path.join(root, fname)
                    module = _infer_module(walk_root, fpath)

                    try:
                        if fname.endswith(".py"):
                            units = parse_python_file(
                                fpath, app_name, module,
                                git_commit=git_commit, indexed_at=indexed_at,
                            )
                        elif fname.endswith(".json") and "doctype" in root.split(os.sep):
                            # Real DocType definitions follow <name>/<name>.json —
                            # e.g. .../doctype/sales_invoice/sales_invoice.json.
                            # Skip test_records.json, patches, and anything else
                            # that just happens to sit in a doctype/ folder.
                            folder_name = os.path.basename(root)
                            if os.path.splitext(fname)[0] != folder_name:
                                continue
                            units = parse_doctype_file(
                                fpath, app_name,
                                git_commit=git_commit, indexed_at=indexed_at,
                            )
                        elif fname.endswith(".js"):
                            units = parse_js_file(
                                fpath, app_name, module,
                                git_commit=git_commit, indexed_at=indexed_at,
                            )
                        else:
                            continue

                        summary["files_scanned"] += 1
                        for u in units:
                            db.upsert_unit(conn, u)
                            summary["units_indexed"] += 1
                            summary["by_type"][u["unit_type"]] = (
                                summary["by_type"].get(u["unit_type"], 0) + 1
                            )
                    except Exception as e:
                        summary["errors"].append(f"{fpath}: {e}")

    return summary


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="Scan a Frappe bench into the temporary code index.")
    ap.add_argument("bench_path", help="Path to the bench root (contains apps/)")
    ap.add_argument("--db", default="./code_index.sqlite3", help="Path to the SQLite DB")
    args = ap.parse_args()

    result = scan_bench(args.bench_path, args.db)
    print("\nScan summary:")
    print(f"  files scanned : {result['files_scanned']}")
    print(f"  units indexed : {result['units_indexed']}")
    for t, c in result["by_type"].items():
        print(f"    - {t}: {c}")
    if result["errors"]:
        print(f"  errors: {len(result['errors'])}")
        for e in result["errors"][:5]:
            print(f"    {e}")
