import json

import frappe

from project.retrieval.retriever import Retriever
from project.retrieval.reranker import Reranker


@frappe.whitelist()
def chat(message: str):
    retriever = Retriever()
    reranker = Reranker()

    candidates = retriever.search(
        message,
        top_k=5
    )

    ranked = reranker.rerank(
        message,
        candidates,
        top_k=5
    )

    recommendations = []

    for candidate in ranked:
        metadata = candidate["metadata"]

        recommendations.append({
    "app_name": metadata["app_name"],
    "module": metadata["module"],
    "doctype": metadata["doctype"],
    "file_path": metadata["file_path"],
    "symbol_name": metadata["symbol_name"],
    "unit_type": metadata["unit_type"],
    "source_code": metadata["source_code"],
    "decorators": metadata["decorators"],
    "docstring": metadata["docstring"],
    "related_doctypes": metadata["related_doctypes"],
    "dependencies": metadata["dependencies"],
})

    frappe.get_doc({
        "doctype": "Logic Reuse",
        "query": message,
        "result": json.dumps(
            recommendations,
            indent=2
        ),
    }).insert(ignore_permissions=True)

    frappe.db.commit()

    return {
        "success": True,
        "message": f"Found {len(recommendations)} relevant code units.",
        "recommendations": recommendations,
    }