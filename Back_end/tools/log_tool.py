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
    1. "date": "YYYY-MM-DD".
    2. "time": "HH:MM" (24h).
    3. "interaction_type": One of: "Meeting", "Call", "Email", "Conference", "Medical Inquiry".
    4. "observation": One of: "Positive", "Neutral", "Negative".
    5. "hcp_name": Full Name (e.g., Dr. Smith).
    6. "specialty": Clinical area (e.g., Cardiology, Oncology, Neurology).
    7. "organization": Facility name (e.g., "Mayo Clinic").
    8. "product_focus": Pharmaceutical drug or disease state discussed.
    9. "attendees": Names of other doctors, research colleagues, or hospital staff mentioned.
    10. "topics_discussed": Specific clinical data, efficacy, or safety profiles mentioned.
    11. "voice_summary": A high-quality, professional clinical summary.
    12. "follow_up_actions": CLEAR, ACTIONABLE clinical follow-up steps.
    13. "observation": One of: "Positive", "Neutral", "Negative".
    14. Use empty string "" for any field not found.
    15. Return ONLY a flat JSON object.

    Clinical Excellence Requirement:
    - Ensure the 'voice_summary' is written in a professional reporting style ("The representative discussed...").
    - The 'follow_up_actions' should be numbered clinical tasks if multiple are found.
    """
    return call_llm_json(prompt)