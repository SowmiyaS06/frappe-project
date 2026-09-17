import unittest

from project.parser.py_parser import parse_python_file


class TestTreeSitterPythonParser(unittest.TestCase):
    def test_extracts_decorated_endpoints_classes_and_methods(self):
        source = '''
@frappe.whitelist()
def total_expenses(employee):
    """Calculate an employee's total expenses."""
    return frappe.db.get_value("Expense Claim", employee)


class ExpenseService:
    """Expense operations."""

    @classmethod
    def for_employee(cls, employee):
        return total_expenses(employee)
'''

        units = parse_python_file(
            "/tmp/expense.py", "expense_management", "expense_management", source_text=source
        )
        by_symbol = {unit["symbol_name"]: unit for unit in units}

        self.assertEqual(by_symbol["total_expenses"]["unit_type"], "api_endpoint")
        self.assertEqual(
            by_symbol["total_expenses"]["docstring"], "Calculate an employee's total expenses."
        )
        self.assertEqual(by_symbol["ExpenseService"]["unit_type"], "class")
        self.assertEqual(by_symbol["ExpenseService.for_employee"]["unit_type"], "method")
        self.assertIn("get_value", by_symbol["total_expenses"]["dependencies"])
        self.assertIn("total_expenses", by_symbol["ExpenseService.for_employee"]["dependencies"])
