import re
from datetime import datetime, timedelta
from services.llm_service import call_llm_json

REQUIRED_KEYS = [
    "hcp_name", "specialty", "organization", "interaction_type",
    "date", "time", "attendees", "topics_discussed", "voice_summary",
    "sentiment", "follow_up_actions", "product_focus",
    "materials_shared", "samples_distributed", "suggested_references",
    "observation"
]


def normalize_output(result: dict) -> dict:
    """Guarantee all required keys exist in the output."""
    normalized = {}
    for key in REQUIRED_KEYS:
        normalized[key] = result.get(key, "")
    return normalized


def log_interaction_tool(input_text: str) -> dict:
    """
    Extract structured interaction details from free-text input.
    Uses LLM first, then falls back to regex extraction.
    """
    today = datetime.now().strftime("%Y-%m-%d")
    now = datetime.now().strftime("%H:%M")

    # --- Try LLM extraction first ---
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
    - For voice_summary, generate a concise 1-2 sentence summary.
    - For follow_up_actions, suggest next steps if mentioned.
    - For sentiment, use: Interested, Neutral, or Skeptical.
    - For interaction_type, identify if it is a Meeting, Call, Email, Conference, or Medical Inquiry.
    """

    try:
        raw = call_llm_json(prompt)
        if raw and "formData" in raw:
            form_data = normalize_output(raw.get("formData", {}))
            return {
                "response": raw.get("response", "I've filled the interaction details."),
                "formData": form_data
            }
    except Exception as e:
        print("LLM extraction error, falling back to regex:", e)

    # --- Fallback: regex-based extraction ---
    extracted = {
        "hcp_name": "",
        "specialty": "",
        "organization": "",
        "product_focus": "",
        "interaction_type": "",
        "date": "",
        "time": "",
        "attendees": "",
        "topics_discussed": "",
        "voice_summary": input_text.strip(),
        "sentiment": "",
        "follow_up_actions": "",
        "materials_shared": "",
        "samples_distributed": "",
        "suggested_references": "",
        "observation": "",
    }

    lowered = input_text.lower()

    # HCP Name
    match = re.search(r"(Dr\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)", input_text)
    if match:
        extracted["hcp_name"] = match.group(1)

    # Specialty
    specialties = ["cardiologist", "oncologist", "neurologist", "orthopedic",
                    "general physician", "dermatologist", "psychiatrist", "pediatrician"]
    for s in specialties:
        if s in lowered:
            extracted["specialty"] = s.title()
            break

    # Organization
    match = re.search(
        r"(Apollo Hospital|AIIMS|Fortis Hospital|NIMS|Max Hospital|[A-Za-z]+\sHospital)",
        input_text, re.IGNORECASE
    )
    if match:
        extracted["organization"] = match.group(1)

    # Product/Drug
    match = re.search(r"\b(DrugX|DrugY|Aspirin|Paracetamol|Ibuprofen|Metformin)\b",
                       input_text, re.IGNORECASE)
    if match:
        extracted["product_focus"] = match.group(1)

    # Interaction type
    if "meeting" in lowered:
        extracted["interaction_type"] = "Meeting"
    elif "call" in lowered:
        extracted["interaction_type"] = "Call"
    elif "email" in lowered:
        extracted["interaction_type"] = "Email"

    # Date recognition
    if "tomorrow" in lowered:
        extracted["date"] = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    elif "today" in lowered:
        extracted["date"] = datetime.now().strftime("%Y-%m-%d")
    else:
        match = re.search(r"\b(\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4}|\d{2}/\d{2}/\d{4})\b",
                          input_text)
        if match:
            extracted["date"] = match.group(1)

    # Time recognition
    match = re.search(r"(\d{1,2}:\d{2}\s?(AM|PM)?)", input_text, re.IGNORECASE)
    if match:
        extracted["time"] = match.group(1).upper()
    else:
        match = re.search(r"\b(\d{1,2}\s?(AM|PM))\b", input_text, re.IGNORECASE)
        if match:
            extracted["time"] = match.group(1).upper()

    # Attendees
    match = re.search(r"(attendees?:\s*)(.*)", input_text, re.IGNORECASE)
    if match:
        extracted["attendees"] = match.group(2).strip()
    elif "with" in lowered:
        match = re.search(r"with\s+([\w\s,]+)", input_text, re.IGNORECASE)
        if match:
            extracted["attendees"] = match.group(1).strip()

    # Topics discussed
    match = re.search(r"(discuss(?:ed|ing)?\s+)(.*)", input_text, re.IGNORECASE)
    if match:
        extracted["topics_discussed"] = match.group(2).strip()

    # Sentiment mapping
    if "interested" in lowered:
        extracted["sentiment"] = "Interested"
    elif "neutral" in lowered:
        extracted["sentiment"] = "Neutral"
    elif "skeptical" in lowered:
        extracted["sentiment"] = "Skeptical"

    # Follow-up actions
    match = re.search(r"(follow[- ]?up.*|next step.*|schedule.*)", input_text, re.IGNORECASE)
    if match:
        extracted["follow_up_actions"] = match.group(0).strip()

    # Normalize to ensure all keys exist
    form_data = normalize_output(extracted)

    return {
        "response": "Interaction details extracted successfully.",
        "formData": form_data
    }
