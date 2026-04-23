from services.llm_service import call_llm_json
from datetime import datetime

REQUIRED_KEYS = [
    "hcp_name","specialty","organization","interaction_type","date","time",
    "attendees","topics_discussed","voice_summary","sentiment",
    "follow_up_actions","product_focus","observation",
    "materials_shared","samples_distributed","suggested_references"
]

def normalize_output(result: dict) -> dict:
    """Guarantee all required keys exist in the output."""
    normalized = {}
    for key in REQUIRED_KEYS:
        normalized[key] = result.get(key, "")
    return normalized

def log_interaction_tool(input_text: str) -> dict:
    today = datetime.now().strftime("%Y-%m-%d")
    now = datetime.now().strftime("%H:%M")

    prompt = f"""
    You are a Medical CRM Assistant. Extract structured interaction data.

    Today's date: {today}, current time: {now}.
    Text: "{input_text}"

    Return a JSON object with two top-level keys:
    - "response": a short natural language reply confirming what was extracted
    - "formData": a flat JSON object with these exact keys:
      {REQUIRED_KEYS}

    Rules:
    - Always include all keys in formData, even if empty.
    - Use snake_case exactly as shown.
    - If a field is missing, return "".
    - For topics_discussed, summarize main points in short phrases.
    - For voice_summary, generate a concise 1–2 sentence summary.
    - For follow_up_actions, suggest next steps if mentioned.
    """

    try:
        raw = call_llm_json(prompt)
    except Exception as e:
        print("LLM extraction error:", e)
        raw = {}

    # Normalize formData
    form_data = normalize_output(raw.get("formData", {}))

    # Build final output
    return {
        "response": raw.get("response", "I've filled the interaction details."),
        "formData": form_data
    }
