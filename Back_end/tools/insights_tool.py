from services.llm_service import call_llm

def insights_tool(context_json: str) -> str:
    prompt = f"""
    Analyze the current HCP interaction data and provide strategic sales insights.
    
    Current Form Data (JSON):
    {context_json}

    Requirements:
    - Assess the quality of the interaction.
    - Identify potential risks or opportunities.
    - Provide 2-3 strategic recommendations for long-term relationship management.
    - Return ONLY the insights text.
    """
    return call_llm(prompt)