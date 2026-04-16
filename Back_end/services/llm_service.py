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
        start_idx = raw.find('{')
        end_idx = raw.rfind('}')
        
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            cleaned_json = raw[start_idx:end_idx+1]
        else:
            cleaned_json = raw.strip()

        try:
            parsed = json.loads(cleaned_json)
            # Flatten if nested (e.g., {"meeting": {...}})
            if isinstance(parsed, dict) and len(parsed) == 1:
                first_val = list(parsed.values())[0]
                if isinstance(first_val, dict):
                    return first_val
            return parsed
        except Exception as e:
            import os
            os.makedirs("scratch", exist_ok=True)
            with open("scratch/llm_error.log", "a") as f:
                f.write(f"Parse Error: {e}\nRaw JSON:\n{raw}\nCleaned JSON:\n{cleaned_json}\n---\n")
            return {}
    except Exception as e:
        return {"error": f"LLM Error: {str(e)}"}
