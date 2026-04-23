import json
from services.llm_service import call_llm
from services.log_tool import log_interaction_tool

# Required keys for normalization
REQUIRED_KEYS = [
    "hcp_name", "specialty", "organization", "interaction_type",
    "date", "time", "attendees", "topics_discussed",
    "voice_summary", "sentiment", "follow_up_actions", "product_focus",
    "observation", "materials_shared", "samples_distributed", "suggested_references"
]


def normalize_output(result: dict) -> dict:
    """Guarantee all required keys exist in the output."""
    return {key: result.get(key, "") for key in REQUIRED_KEYS}


def merge_form_data(old, new):
    """Merge new data into old, only overwriting non-empty values."""
    if not old:
        return new
    merged = old.copy()
    for k, v in new.items():
        if v not in [None, "", "null"]:
            merged[k] = v
    return merged


def router(state: dict) -> str:
    """Classify user intent using the LLM."""
    text = state["input"]
    prompt = f"""
    Classify the intent of this CRM assistant input into exactly one category:
    log | edit | summarize | suggest | insights

    Input: "{text}"
    Return only one word.
    """
    try:
        intent = call_llm(prompt).strip().lower()
    except Exception as e:
        print("Router error:", e)
        return "log"
    for k in ["log", "edit", "summarize", "suggest", "insights"]:
        if k in intent:
            return k
    return "log"


def run_agent(input_text: str, context_data: dict = None) -> dict:
    """Main agent entry point: routes intent and executes appropriate tool."""
    context_data = context_data or {}
    intent = router({"input": input_text})
    context_str = json.dumps(context_data, indent=2)

    try:
        if intent == "log":
            extracted = log_interaction_tool(input_text)
            normalized = normalize_output(extracted.get("formData", {}))
            form_data = merge_form_data(context_data, normalized)
            response = {
                "intent": "log",
                "response": extracted.get("response", "I've filled the interaction details."),
                "formData": form_data
            }

        elif intent == "edit":
            # Use log tool to re-extract with context awareness
            extracted = log_interaction_tool(input_text)
            updates = normalize_output(extracted.get("formData", {}))
            form_data = merge_form_data(context_data, updates)
            response = {
                "intent": "edit",
                "response": "I've updated the requested fields.",
                "formData": form_data
            }

        elif intent == "summarize":
            summary = call_llm(
                f"Summarize this medical interaction in 2-3 sentences:\n{context_str}"
            )
            form_data = context_data.copy()
            form_data["voice_summary"] = summary
            response = {
                "intent": "summarize",
                "response": summary,
                "formData": form_data
            }

        elif intent == "suggest":
            steps = call_llm(
                f"Suggest follow-up actions for this medical interaction:\n{context_str}"
            )
            form_data = context_data.copy()
            form_data["follow_up_actions"] = steps
            response = {
                "intent": "suggest",
                "response": steps,
                "formData": form_data
            }

        elif intent == "insights":
            analysis = call_llm(
                f"Provide key insights about this HCP interaction:\n{context_str}"
            )
            response = {
                "intent": "insights",
                "response": analysis,
                "formData": context_data
            }

        else:
            response = {
                "intent": "unknown",
                "response": "I couldn't understand your request. Try describing a meeting or interaction.",
                "formData": context_data
            }

    except Exception as e:
        print(f"Agent error: {e}")
        response = {
            "intent": "error",
            "response": f"Error: {str(e)}",
            "formData": context_data
        }

    print("Agent response intent:", response.get("intent"))
    return response
