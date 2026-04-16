from services.llm_service import call_llm

def summarize_tool(context_json: str) -> str:
    prompt = f"""
    Below is the current data in an HCP (Healthcare Professional) interaction form. 
    Your task is to generate a 'Perfect Voice Summary'—a professional, clinical, and concise summary of the interaction.

    Current Form Data (JSON):
    {context_json}

    Requirements for Excellence:
    - Tone: Professional, clinical, and objective.
    - Perspective: Third-person professional reporting (e.g., "The representative met with...").
    - Content: Highlight the HCP's name, the core therapeutic topics discussed (clinical data, safety, efficacy), and the overall sentiment or feedback.
    - Brevity: Be concise (3-4 impactful sentences).
    - Format: Return ONLY the summary text. No preamble.
    """
    return call_llm(prompt)