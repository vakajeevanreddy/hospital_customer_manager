import json
from services.llm_service import call_llm
from tools.log_tool import log_interaction_tool
from tools.edit_tool import edit_interaction_tool
from tools.summarize_tool import summarize_tool
from tools.suggest_tool import suggest_tool
from tools.insights_tool import insights_tool


def router(state: dict) -> str:
    text = state["input"]

    prompt = f"""
Classify intent:
log, edit, summarize, suggest, insights

Input: "{text}"

Return ONLY one word.
"""

    raw_intent = call_llm(prompt).strip().lower()

    if raw_intent in ["log", "edit", "summarize", "suggest", "insights"]:
        return raw_intent

    return "log"


def run_agent(input_text: str, context_data: dict = None) -> dict:
    intent = router({"input": input_text})

    context_str = json.dumps(context_data or {}, indent=2)

    if intent == "log":
        form_data = log_interaction_tool(input_text)

        print("DEBUG FORM DATA:", form_data)

        if not isinstance(form_data, dict):
            return {
                "intent": "log",
                "tool_used": "log_interaction",
                "ai_response": "Invalid AI response format.",
                "form_data": None
            }

        if "error" in form_data:
            return {
                "intent": "log",
                "tool_used": "log_interaction",
                "ai_response": form_data["error"],
                "form_data": None
            }

        extracted = [k for k, v in form_data.items() if v]
        field_list = ", ".join(extracted) if extracted else "no fields"

        return {
            "intent": "log",
            "tool_used": "log_interaction",
            "ai_response": f"I've extracted and filled: {field_list}.",
            "form_data": form_data
        }

    elif intent == "edit":
        updates = edit_interaction_tool(input_text, context_data or {})

        extracted = [k for k, v in updates.items() if v]
        field_list = ", ".join(extracted) if extracted else "no fields"

        return {
            "intent": "edit",
            "tool_used": "edit_interaction",
            "ai_response": f"Updated fields: {field_list}.",
            "form_data": updates
        }

    elif intent == "summarize":
        summary = summarize_tool(context_str)
        return {
            "intent": "summarize",
            "tool_used": "summarize",
            "ai_response": "Summary generated.",
            "form_data": {"voice_summary": summary}
        }

    elif intent == "suggest":
        suggestions = suggest_tool(context_str)
        return {
            "intent": "suggest",
            "tool_used": "suggest",
            "ai_response": "Suggestions generated.",
            "form_data": {"follow_up_actions": suggestions}
        }

    elif intent == "insights":
        analysis = insights_tool(context_str)
        return {
            "intent": "insights",
            "tool_used": "insights",
            "ai_response": analysis,
            "form_data": None
        }

    return {
        "intent": "unknown",
        "tool_used": None,
        "ai_response": "Could not understand request.",
        "form_data": None
    }