import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client with the API key from environment
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def call_llm(prompt: str) -> str:
    """Standard LLM call returning a string response."""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"LLM Error: {str(e)}"

def call_llm_json(prompt: str) -> dict:
    """Call LLM and parse the response as JSON with robust cleaning."""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a CRM assistant. Always respond with valid JSON only. No markdown, no explanation, just JSON."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
        )
        raw = response.choices[0].message.content.strip()
        
        # Robust JSON extraction logic
        cleaned_json = raw.strip()
        if "```json" in cleaned_json:
            cleaned_json = cleaned_json.split("```json")[-1].split("```")[0].strip()
        elif "```" in cleaned_json:
            cleaned_json = cleaned_json.split("```")[-1].split("```")[0].strip()
        
        # Aggressive Regex fallback
        if not cleaned_json.startswith("{"):
            import re
            match = re.search(r'\{.*\}', cleaned_json, re.DOTALL)
            if match:
                cleaned_json = match.group()

        try:
            return json.loads(cleaned_json)
        except Exception:
            return {}
    except Exception as e:
        return {"error": f"LLM Error: {str(e)}"}
