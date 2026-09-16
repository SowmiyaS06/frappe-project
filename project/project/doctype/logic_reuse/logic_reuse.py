# Copyright (c) 2026, Sowmiya and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class LogicReuse(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		query: DF.LongText | None
		result: DF.LongText | None
	# end: auto-generated types

	_DOCTYPE_NAME = "Logic Reuse"
