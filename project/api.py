import time
import json
import frappe  # type: ignore[import-not-found]
from google import genai
import json


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
    # 2. BUILD CONTEXT FOR GEMINI
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
    # 3. GEMINI
    # --------------------------------------------------

    api_key = frappe.conf.get("gemini_api_key")

    if not api_key:
        return {
            "success": False,
            "message": "Gemini API key is not configured."
        }

    try:

        client = genai.Client(
            api_key=api_key
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

        response = None

        for attempt in range(3):

            try:

                response = client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=prompt,
                    config={
                        "system_instruction": system_instruction
                    }
                )

                break

            except Exception as e:

                error_text = str(e)

                is_temporary_error = (
                    "503" in error_text
                    or "UNAVAILABLE" in error_text.upper()
                )

                if is_temporary_error:

                    if attempt < 2:
                        time.sleep(1.5)
                        continue

                raise

        if response is None:
            return {
                "success": False,
                "message": (
                    "Gemini is temporarily unavailable. "
                    "Please try again."
                )
            }

        reply = response.text

        if not reply:
            return {
                "success": False,
                "message": "Gemini returned an empty response."
            }

        # --------------------------------------------------
        # 4. STORE QUERY + RETRIEVAL + GEMINI RESPONSE
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
        # 5. RETURN TO CHATBOT
        # --------------------------------------------------

        return {
            "success": True,
            "message": reply,
            "recommendations": ranked,
        }

    except Exception as e:

        frappe.log_error(
            frappe.get_traceback(),
            "FrapAI Gemini Error"
        )

        error_text = str(e)

        if (
            "503" in error_text
            or "UNAVAILABLE" in error_text.upper()
        ):
            return {
                "success": False,
                "message": (
                    "Gemini is currently experiencing high demand. "
                    "Please try again in a moment. 😕"
                )
            }

        return {
            "success": False,
            "message": (
                "Sorry, I couldn't process your request right now. 😕"
            )
        }