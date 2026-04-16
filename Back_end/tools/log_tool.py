from services.llm_service import call_llm_json
from datetime import datetime


def log_interaction_tool(input_text: str) -> dict:
    today = datetime.now().strftime("%Y-%m-%d")
    now = datetime.now().strftime("%H:%M")

    prompt = f"""
    You are a high-precision Medical CRM Assistant. Extract structured Healthcare/Pharmaceutical interaction data from this voice-to-text transcript. 
    Today's date is {today} and current time is {now}.

    Text: "{input_text}"

    STRICT FORMATTING RULES:
    You MUST return ONLY a SINGLE, FLAT JSON object containing EXACTLY these keys. DO NOT nest the JSON under any top-level key like "meeting" or "data".
    
    Keys to extract:
    - "date": "YYYY-MM-DD"
    - "time": "HH:MM" (24h)
    - "interaction_type": ("Meeting", "Call", "Email", "Conference", "Medical Inquiry")
    - "hcp_name": Full Name (e.g., Dr. Smith)
    - "specialty": Clinical area (e.g., Cardiology, Oncology)
    - "organization": Facility name (e.g., "Mayo Clinic")
    - "product_focus": Pharmaceutical drug or disease state discussed
    - "attendees": Names of other doctors, staff mentioned
    - "topics_discussed": Clinical data, efficacy, safety
    - "voice_summary": A professional clinical summary
    - "follow_up_actions": CLEAR, ACTIONABLE steps
    - "observation": ("Positive", "Neutral", "Negative")
    - "materials_shared": Any materials or resources shared
    - "samples_distributed": Any product samples handed out
    - "suggested_references": Recommended clinical trials or papers

    If a field is not found in the text, use an empty string "".
    """
    return call_llm_json(prompt)