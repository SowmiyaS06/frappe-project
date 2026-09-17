import os
import json
import frappe  # type: ignore[import-not-found]
from openai import OpenAI

from project.retrieval.retriever import Retriever
from project.retrieval.reranker import Reranker


@frappe.whitelist()
def chat(message: str):

    if not message or not message.strip():
        frappe.throw("Message cannot be empty")

    # --------------------------------------------------
    # 1. RETRIEVAL
    # --------------------------------------------------

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

    # --------------------------------------------------
    # 2. BUILD CONTEXT FOR LLM
    # --------------------------------------------------

    context_parts = []

    for index, candidate in enumerate(ranked, start=1):

        metadata = candidate["metadata"]

        context_parts.append(
            f"""
Candidate {index}

App Name:
{metadata.get("app_name", "")}

Module:
{metadata.get("module", "")}

DocType:
{metadata.get("doctype", "")}

File Path:
{metadata.get("file_path", "")}

Symbol Name:
{metadata.get("symbol_name", "")}

Unit Type:
{metadata.get("unit_type", "")}

Source Code:
{metadata.get("source_code", "")}

Decorators:
{metadata.get("decorators", "")}

Docstring:
{metadata.get("docstring", "")}

Related DocTypes:
{metadata.get("related_doctypes", "")}

Dependencies:
{metadata.get("dependencies", "")}
""".strip()
        )

    retrieval_context = "\n\n---\n\n".join(context_parts)

    # --------------------------------------------------
    # 3. OPENROUTER
    # --------------------------------------------------

    api_key = frappe.conf.get("openrouter_api_key")

    if not api_key:
        return {
            "success": False,
            "message": "OpenRouter API key is not configured."
        }

    try:

        client = OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1"
        )

        system_instruction = """
You are FrapAI, an AI assistant that helps developers
understand and reuse existing Frappe/ERPNext code.

The user has provided a requirement.

You are also given retrieved code candidates from the
current Frappe codebase.

Use the retrieved candidates as evidence.

Do not invent existing implementations that are not present
in the retrieved context.

Analyze whether the existing code can be:

1. REUSE
2. ADAPT
3. EXTEND
4. BUILD NEW

Explain the reasoning clearly.

Mention relevant:

- App
- Module
- DocType
- Function/class/method
- File path
- Existing behavior
- Required changes
- Related code when relevant

Return a clean, human-friendly Markdown response.

Do not expose vector distances or internal retrieval scores
unless specifically asked.
"""

        prompt = f"""
User Requirement:
{message}

Retrieved Top-K Candidates:
{retrieval_context}

Based on the requirement and the retrieved candidates,
provide a reuse-oriented recommendation.
"""

        # --------------------------------------------------
        # 4. CALL OPENROUTER
        # --------------------------------------------------

        response = client.chat.completions.create(
            model="openrouter/free",
            messages=[
                {
                    "role": "system",
                    "content": system_instruction
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        reply = response.choices[0].message.content

        if not reply:
            return {
                "success": False,
                "message": "OpenRouter returned an empty response."
            }

        # --------------------------------------------------
        # 5. STORE QUERY + RETRIEVAL + LLM RESPONSE
        # --------------------------------------------------

        frappe.get_doc({
            "doctype": "Logic Reuse",
            "query": message,
            "retrieved_candidates": json.dumps(
                ranked,
                indent=2,
                default=str
            ),
            "response": reply,
        }).insert(
            ignore_permissions=True
        )

        frappe.db.commit()

        # --------------------------------------------------
        # 6. RETURN TO CHATBOT
        # --------------------------------------------------

        return {
            "success": True,
            "message": reply,
            "recommendations": ranked,
        }

    except Exception as e:

        frappe.log_error(
            frappe.get_traceback(),
            "FrapAI OpenRouter Error"
        )

        return {
            "success": False,
            "message": f"ERROR: {str(e)}"
        }