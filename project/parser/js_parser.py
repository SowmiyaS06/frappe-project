"""
JavaScript client-script parser (Section 5).

Regex-based rather than a full JS AST — good enough to pull out
frappe.ui.form.on(...) handlers and top-level named functions, which
covers the bulk of what Frappe client scripts actually contain.
Swap for a real JS parser (e.g. esprima via a Node subprocess) later
if precision on nested/anonymous functions becomes important.
"""

import re

FORM_HANDLER_RE = re.compile(
    r"frappe\.ui\.form\.on\(\s*['\"]([^'\"]+)['\"]\s*,\s*\{",
)
EVENT_METHOD_RE = re.compile(
    r"^\s*(\w+)\s*(?:\(|:)\s*function\s*\(", re.MULTILINE
)
NAMED_FUNCTION_RE = re.compile(
    r"^\s*function\s+(\w+)\s*\(([^)]*)\)", re.MULTILINE
)


def parse_js_file(file_path, app_name, module=None, source_text=None, git_commit=None, indexed_at=None):
    if source_text is None:
        with open(file_path, "r", encoding="utf-8") as f:
            source_text = f.read()

    units = []

    for match in FORM_HANDLER_RE.finditer(source_text):
        doctype = match.group(1)
        # grab a reasonable chunk of source following the match as the snippet
        start = match.start()
        end = min(len(source_text), start + 1500)
        snippet = source_text[start:end]

        events = EVENT_METHOD_RE.findall(snippet)
        units.append({
            "app_name": app_name,
            "module": module,
            "doctype": doctype,
            "file_path": file_path,
            "symbol_name": f"{doctype}_form_handler",
            "unit_type": "js_handler",
            "language": "javascript",
            "source_code": snippet,
            "docstring": None,
            "decorators": [],
            "related_doctypes": [doctype],
            "dependencies": events,
            "git_commit": git_commit,
            "indexed_at": indexed_at,
        })

    for match in NAMED_FUNCTION_RE.finditer(source_text):
        name, params = match.group(1), match.group(2)
        start = match.start()
        end = min(len(source_text), start + 800)
        units.append({
            "app_name": app_name,
            "module": module,
            "doctype": None,
            "file_path": file_path,
            "symbol_name": name,
            "unit_type": "js_handler",
            "language": "javascript",
            "source_code": source_text[start:end],
            "docstring": None,
            "decorators": [],
            "related_doctypes": [],
            "dependencies": [],
            "git_commit": git_commit,
            "indexed_at": indexed_at,
        })

    return units
