import json
from services.llm_service import call_llm

from tools.log_tool import log_interaction_tool
from tools.edit_tool import edit_interaction_tool
from tools.summarize_tool import summarize_tool
from tools.suggest_tool import suggest_tool
from tools.insights_tool import insights_tool


def router(state: dict) -> str:
    """Classify user intent using LLM."""
    text = state["input"]

    prompt = f"""
    Classify the user's intent into exactly one of these categories:
    - log: user is describing/reporting an HCP interaction (met a doctor, had a meeting, etc.)
    - edit: user wants to change/update a field in the current interaction form
    - summarize: user wants a summary of interaction notes
    - suggest: user wants suggestions for next actions or follow-ups
    - insights: user wants analysis or insights about doctor behavior/patterns

    User input: "{text}"

    Return ONLY one word: log, edit, summarize, suggest, or insights.
    """

    intent = call_llm(prompt).strip().lower()

    # Clean up response - extract just the keyword
    for keyword in ["log", "edit", "summarize", "suggest", "insights"]:
        if keyword in intent:
            return keyword

    return "log"  # Default to log


def run_agent(input_text: str, context_data: dict = None) -> dict:
    """Run the LangGraph agent pipeline."""
    intent = router({"input": input_text})
    
    # context_str provides the data for non-log/edit tools
    context_str = json.dumps(context_data or {}, indent=2)

    if intent == "log":
        form_data = log_interaction_tool(input_text)
        if "error" in form_data:
            return {
                "intent": "log",
                "tool_used": "log_interaction",
                "ai_response": f"Error during extraction: {form_data['error']}",
                "form_data": None
            }
        
        extracted = [k for k, v in form_data.items() if v]
        field_list = ", ".join(extracted) if extracted else "no fields"
        return {
            "intent": "log",
            "tool_used": "log_interaction",
            "ai_response": f"I've extracted the interaction details for {form_data.get('hcp_name', 'HCP')} and filled in: {field_list}.",
            "form_data": form_data
        }

    elif intent == "edit":
        updates = edit_interaction_tool(input_text, context_data)
        extracted = [k for k, v in updates.items() if v]
        field_list = ", ".join(extracted) if extracted else "no fields"
        return {
            "intent": "edit",
            "tool_used": "edit_interaction",
            "ai_response": f"I've updated the requested fields: {field_list}. Please review the changes.",
            "form_data": updates
        }

    elif intent == "summarize":
        summary = summarize_tool(context_str)
        return {
            "intent": "summarize",
            "tool_used": "summarize",
            "ai_response": "I've generated a summary based on the current form contents.",
            "form_data": {"voice_summary": summary}
        }

    elif intent == "suggest":
        suggestions = suggest_tool(context_str)
        return {
            "intent": "suggest",
            "tool_used": "suggest",
            "ai_response": "Based on the current form, here are my suggestions:",
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

    else:
        return {
            "intent": "unknown",
            "tool_used": None,
            "ai_response": "I couldn't understand your request. Try describing an interaction, asking for a summary, or requesting suggestions.",
            "form_data": None
        }