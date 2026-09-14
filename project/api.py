import frappe  # type: ignore[import-not-found]


@frappe.whitelist()
def chat(message:str):

    return {
        "success": True,
        "message": "I received your message!",
        "recommendations": [
            {
                "type": "doctype",
                "name": "Customer",
                "reason": "This is a sample recommendation."
            }
        ]
    }