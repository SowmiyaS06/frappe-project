"""Tree-sitter based structured-unit extraction for Python source files."""

from ast import literal_eval

from tree_sitter import Language, Parser
import tree_sitter_python


WHITELIST_DECORATOR = "frappe.whitelist"
PYTHON_LANGUAGE = Language(tree_sitter_python.language())


def _node_text(source_bytes, node):
    return source_bytes[node.start_byte : node.end_byte].decode("utf-8")


def _decorator_name(source_bytes, decorator):
    """Best-effort stringify a decorator: @frappe.whitelist() -> frappe.whitelist."""
    return _node_text(source_bytes, decorator).strip().lstrip("@").split("(", 1)[0].strip()


def _extract_calls(source_bytes, body):
    """Return a lightweight call-dependency signal from a Tree-sitter body node."""
    calls = set()
    stack = [body]
    while stack:
        node = stack.pop()
        if node.type == "call":
            function = node.child_by_field_name("function")
            if function:
                if function.type == "attribute":
                    attribute = function.child_by_field_name("attribute")
                    calls.add(_node_text(source_bytes, attribute or function))
                else:
                    calls.add(_node_text(source_bytes, function))
        stack.extend(reversed(node.named_children))
    return sorted(calls)


def _docstring(source_bytes, body):
    """Read a conventional first-statement string without parsing the source with ast."""
    if not body or not body.named_children:
        return None
    statement = body.named_children[0]
    if statement.type != "expression_statement" or not statement.named_children:
        return None
    value = statement.named_children[0]
    if value.type != "string":
        return None
    try:
        return literal_eval(_node_text(source_bytes, value))
    except (SyntaxError, ValueError):
        return None


def _unwrap_definition(source_bytes, node):
    """Return (definition, decorators, source span), including decorator lines."""
    if node.type != "decorated_definition":
        return node, [], node
    decorators = [
        _decorator_name(source_bytes, child)
        for child in node.named_children
        if child.type == "decorator"
    ]
    definition = next(
        (child for child in node.named_children if child.type in {"function_definition", "class_definition"}),
        None,
    )
    return definition, decorators, node


def parse_python_file(file_path, app_name, module, source_text=None, git_commit=None, indexed_at=None):
    """Extract top-level functions/classes and class methods into existing code-unit records."""
    if source_text is None:
        with open(file_path, encoding="utf-8") as source_file:
            source_text = source_file.read()

    source_bytes = source_text.encode("utf-8")
    tree = Parser(PYTHON_LANGUAGE).parse(source_bytes)
    if tree.root_node.has_error:
        return []

    units = []

    def handle_function(definition, decorators, source_node, unit_type, class_name=None):
        name = definition.child_by_field_name("name")
        body = definition.child_by_field_name("body")
        if not name:
            return
        is_whitelisted = any(WHITELIST_DECORATOR in decorator for decorator in decorators)
        function_name = _node_text(source_bytes, name)
        symbol = f"{class_name}.{function_name}" if class_name else function_name
        units.append({
            "app_name": app_name,
            "module": module,
            "doctype": None,
            "file_path": file_path,
            "symbol_name": symbol,
            "unit_type": "api_endpoint" if is_whitelisted else unit_type,
            "language": "python",
            "source_code": _node_text(source_bytes, source_node),
            "docstring": _docstring(source_bytes, body),
            "decorators": decorators,
            "related_doctypes": [],
            "dependencies": _extract_calls(source_bytes, body),
            "git_commit": git_commit,
            "indexed_at": indexed_at,
        })

    for node in tree.root_node.named_children:
        definition, decorators, source_node = _unwrap_definition(source_bytes, node)
        if definition is None:
            continue
        if definition.type == "function_definition":
            handle_function(definition, decorators, source_node, "function")
        elif definition.type == "class_definition":
            class_name = definition.child_by_field_name("name")
            body = definition.child_by_field_name("body")
            if not class_name or not body:
                continue
            class_name_text = _node_text(source_bytes, class_name)
            units.append({
                "app_name": app_name,
                "module": module,
                "doctype": None,
                "file_path": file_path,
                "symbol_name": class_name_text,
                "unit_type": "class",
                "language": "python",
                "source_code": _node_text(source_bytes, source_node),
                "docstring": _docstring(source_bytes, body),
                "decorators": decorators,
                "related_doctypes": [],
                "dependencies": [],
                "git_commit": git_commit,
                "indexed_at": indexed_at,
            })
            for child in body.named_children:
                method, method_decorators, method_source = _unwrap_definition(source_bytes, child)
                if method and method.type == "function_definition":
                    handle_function(method, method_decorators, method_source, "method", class_name_text)

    return units
