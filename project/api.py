import time

import frappe  # type: ignore[import-not-found]
from google import genai


@frappe.whitelist()
def chat(message: str):

    if not message or not message.strip():
        frappe.throw("Message cannot be empty")

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
You are FrapAI, an AI assistant that helps users search,
understand and work with Frappe Framework, programming code,
documentation, APIs, commands, configuration, errors and
technical information.

Answer naturally and clearly like a modern AI assistant.

Formatting rules:

1. Answer the user's question directly.
2. Keep simple questions concise.
3. Use Markdown headings when useful.
4. Use bullet points for lists.
5. Use numbered lists for step-by-step instructions.
6. Use inline code for functions, variables, filenames,
   APIs and commands.
7. Put all multi-line code inside Markdown fenced code blocks.
8. Always specify the programming language for code blocks.
9. Support Python, JavaScript, SQL, HTML, CSS, JSON, Bash,
   Frappe code and other programming languages.
10. If the user asks for code, provide clean usable code.
11. Do not unnecessarily provide multiple solutions.
12. Do not repeat the user's question.
13. Match the amount of detail to the question.
14. Return clean Markdown.
15. Use tables when they make a comparison clearer.
16. Keep explanations outside code blocks.
17. Do not return raw HTML unless the user explicitly requests it.
18. Preserve code indentation and always include a language after a
    fenced code block opening.
"""

        response = None

        # Retry temporarily unavailable Gemini requests
        for attempt in range(3):

            try:

                response = client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=message,
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
                "message": "Gemini is temporarily unavailable. Please try again."
            }

        reply = response.text

        if not reply:
            return {
                "success": False,
                "message": "Gemini returned an empty response."
            }

        return {
            "success": True,
            "message": reply
        }

    except Exception as e:

        frappe.log_error(
            frappe.get_traceback(),
            "FrapAI Gemini Error"
        )

        error_text = str(e)

        if "503" in error_text or "UNAVAILABLE" in error_text.upper():
            return {
                "success": False,
                "message": (
                    "Gemini is currently experiencing high demand. "
                    "Please try again in a moment. 😕"
                )
            }

        return {
            "success": False,
            "message": "Sorry, I couldn't process your request right now. 😕"
        }