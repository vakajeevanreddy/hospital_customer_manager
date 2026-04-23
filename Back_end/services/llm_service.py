import os
import json
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Groq client with API key
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def call_llm(prompt: str) -> str:
    """Standard LLM call returning a string response."""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"LLM Error: {str(e)}"

def call_llm_json(prompt: str) -> dict:
    """Call LLM and parse the response as JSON with robust cleaning."""
    raw = ""  # ensure raw is always defined
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a CRM assistant. "
                        "Always respond with valid JSON only. "
                        "No markdown, no explanation, just JSON."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.0,  # force deterministic JSON
        )
        raw = response.choices[0].message.content.strip()

        # Debug log
        print("Raw LLM output:", raw)

        # Extract JSON substring
        start_idx = raw.find("{")
        end_idx = raw.rfind("}")
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            cleaned_json = raw[start_idx:end_idx+1]
        else:
            cleaned_json = raw

        try:
            parsed = json.loads(cleaned_json)
            return parsed
        except Exception as e:
            os.makedirs("scratch", exist_ok=True)
            with open("scratch/llm_error.log", "a") as f:
                f.write(f"Parse Error: {e}\nRaw:\n{raw}\nCleaned:\n{cleaned_json}\n---\n")
            return {}
    except Exception as e:
        return {"error": f"LLM Error: {str(e)}"}
