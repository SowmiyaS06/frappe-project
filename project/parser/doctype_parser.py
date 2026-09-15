"""
DocType JSON parser (Section 5).

Frappe DocTypes are defined as JSON files, typically at:
  <app>/<app>/<module>/doctype/<doctype_name>/<doctype_name>.json
"""

import json


def parse_doctype_file(file_path, app_name, source_text=None, git_commit=None, indexed_at=None):
    if source_text is None:
        with open(file_path, "r", encoding="utf-8") as f:
            source_text = f.read()

    try:
        data = json.loads(source_text)
    except json.JSONDecodeError:
        return []

    if not isinstance(data, dict):
        return []  # e.g. test_records.json is a list, not a DocType definition

    if data.get("doctype") != "DocType":
        return []  # not actually a doctype definition file

    name = data.get("name") or data.get("doctype_name") or "Unknown"
    module = data.get("module")
    fields = data.get("fields", [])

    field_summaries = [
        {"fieldname": f.get("fieldname"), "fieldtype": f.get("fieldtype"),
         "options": f.get("options")}
        for f in fields
    ]

    related = sorted({
        f.get("options") for f in fields
        if f.get("fieldtype") in ("Link", "Table", "Table MultiSelect") and f.get("options")
    })

    unit = {
        "app_name": app_name,
        "module": module,
        "doctype": name,
        "file_path": file_path,
        "symbol_name": name,
        "unit_type": "doctype",
        "language": "json",
        "source_code": json.dumps({"name": name, "fields": field_summaries}, indent=2),
        "docstring": data.get("description"),
        "decorators": [],
        "related_doctypes": related,
        "dependencies": [],
        "git_commit": git_commit,
        "indexed_at": indexed_at,
    }
    return [unit]
