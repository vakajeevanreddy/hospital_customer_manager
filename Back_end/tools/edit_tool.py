from services.llm_service import call_llm_json

def edit_interaction_tool(input_text: str, current_data: dict) -> dict:
    prompt = f"""
    The user wants to update specific fields in their medical interaction log.
    Current Data: {current_data}
    Request: "{input_text}"

    VALID FIELDS:
    - hcp_name: Full name of the doctor.
    - specialty: Therapeutic area (e.g., Oncology).
    - organization: Hospital/Clinic name.
    - product_focus: Drug or disease name being discussed.
    - interaction_type: Meeting, Call, Email, Conference, or Medical Inquiry.
    - date: YYYY-MM-DD.
    - time: HH:MM.
    - attendees: Other people present.
    - topics_discussed: Clinical details.
    - voice_summary: Professional summary.
    - observation: Positive, Neutral, or Skeptical.
    - follow_up_actions: Next clinical steps.

    Update the relevant fields based on the user's request.
    Return ONLY a flat JSON object containing the updated fields.
    If they mention "change x to y", identify which field x refers to and set it to y.
    """
    return call_llm_json(prompt)