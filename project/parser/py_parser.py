"""
Structured-unit extraction for Python source files (Section 5).

Deliberately does NOT embed whole files — every function, method, and
class becomes its own retrievable unit, each with its own docstring,
decorators, and source snippet, per the doc's core design decision.
"""

import ast


WHITELIST_DECORATOR = "frappe.whitelist"


def _decorator_name(node):
    """Best-effort stringify a decorator node: @frappe.whitelist() -> 'frappe.whitelist'"""
    if isinstance(node, ast.Call):
        node = node.func
    if isinstance(node, ast.Attribute):
        parts = []
        while isinstance(node, ast.Attribute):
            parts.append(node.attr)
            node = node.value
        if isinstance(node, ast.Name):
            parts.append(node.id)
        return ".".join(reversed(parts))
    if isinstance(node, ast.Name):
        return node.id
    return ast.dump(node)


def _get_source_segment(source_lines, node):
    start = node.lineno - 1
    end = getattr(node, "end_lineno", node.lineno)
    return "\n".join(source_lines[start:end])


def _extract_calls(node):
    """Rough dependency signal: names of functions this unit's body calls.
    Walks node.body only — NOT decorator_list — so @frappe.whitelist()
    doesn't itself get counted as a dependency of the function."""
    calls = set()
    for stmt in node.body:
        for child in ast.walk(stmt):
            if isinstance(child, ast.Call):
                f = child.func
                if isinstance(f, ast.Name):
                    calls.add(f.id)
                elif isinstance(f, ast.Attribute):
                    calls.add(f.attr)
    return sorted(calls)


def parse_python_file(file_path, app_name, module, source_text=None, git_commit=None, indexed_at=None):
    """
    Returns a list of structured unit dicts (Section 6 schema, minus
    app-level fields the caller fills in) for every top-level and
    class-level function/method in the file.
    """
    if source_text is None:
        with open(file_path, "r", encoding="utf-8") as f:
            source_text = f.read()

    source_lines = source_text.splitlines()

    try:
        tree = ast.parse(source_text, filename=file_path)
    except SyntaxError:
        return []  # unparsable file — skip rather than crash the whole scan

    units = []

    def handle_function(node, unit_type, class_name=None):
        decorators = [_decorator_name(d) for d in node.decorator_list]
        is_whitelisted = any(WHITELIST_DECORATOR in d for d in decorators)
        symbol = f"{class_name}.{node.name}" if class_name else node.name
        units.append({
            "app_name": app_name,
            "module": module,
            "doctype": None,  # heuristically filled in by caller if file sits in a doctype folder
            "file_path": file_path,
            "symbol_name": symbol,
            "unit_type": "api_endpoint" if is_whitelisted else unit_type,
            "language": "python",
            "source_code": _get_source_segment(source_lines, node),
            "docstring": ast.get_docstring(node),
            "decorators": decorators,
            "related_doctypes": [],
            "dependencies": _extract_calls(node),
            "git_commit": git_commit,
            "indexed_at": indexed_at,
        })

    for node in ast.iter_child_nodes(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            handle_function(node, "function")
        elif isinstance(node, ast.ClassDef):
            units.append({
                "app_name": app_name,
                "module": module,
                "doctype": None,
                "file_path": file_path,
                "symbol_name": node.name,
                "unit_type": "class",
                "language": "python",
                "source_code": _get_source_segment(source_lines, node),
                "docstring": ast.get_docstring(node),
                "decorators": [_decorator_name(d) for d in node.decorator_list],
                "related_doctypes": [],
                "dependencies": [],
                "git_commit": git_commit,
                "indexed_at": indexed_at,
            })
            for child in node.body:
                if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    handle_function(child, "method", class_name=node.name)

    return units
