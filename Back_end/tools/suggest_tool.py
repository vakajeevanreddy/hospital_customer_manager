from services.llm_service import call_llm

def suggest_tool(context_json: str) -> str:
    prompt = f"""
    Below is the current data in an HCP interaction form.
    Based on these details, suggest 3-4 specific, high-value 'Next Clinical Steps' for the pharmaceutical representative.

    Current Form Data (JSON):
    {context_json}

    Requirements for Excellence:
    - Action Oriented: Suggestions must be specific (e.g., "Share the Phase III safety data regarding...", not just "Follow up").
    - Clinically Relevant: Focus on medical education, providing samples, or addressing specific safety concerns raised.
    - Professional: Use medical/pharmaceutical terminology correctly.
    - Format: Return a numbered list.
    - Return ONLY the suggestions.
    """
    return call_llm(prompt)