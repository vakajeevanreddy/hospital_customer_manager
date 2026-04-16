import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ----------------------------------------
# BASIC TEXT CALL (for router, etc.)
# ----------------------------------------
def call_llm(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a strict assistant. Respond concisely."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"LLM Error: {str(e)}"


# ----------------------------------------
# STRICT JSON CALL (THIS IS THE FIX)
# ----------------------------------------
def call_llm_json(prompt: str) -> dict:
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",

            # 🔥 KEY FIX: FORCE JSON OUTPUT
            response_format={"type": "json_object"},

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a CRM data extraction engine.\n"
                        "Always return ONLY valid JSON.\n"
                        "No explanation. No markdown. No extra text."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )

        raw = response.choices[0].message.content.strip()

        # Debug log (VERY IMPORTANT)
        print("RAW LLM JSON:", raw)

        # Direct parse (should work now)
        parsed = json.loads(raw)

        # Optional flatten (if weird nesting happens)
        if isinstance(parsed, dict) and len(parsed) == 1:
            first_val = list(parsed.values())[0]
            if isinstance(first_val, dict):
                return first_val

        return parsed

    except Exception as e:
        print("JSON PARSE ERROR:", str(e))

        # fallback attempt (minimal cleanup only)
        try:
            start = raw.find("{")
            end = raw.rfind("}") + 1
            cleaned = raw[start:end]
            return json.loads(cleaned)
        except:
            return {
                "error": "Failed to parse JSON",
                "raw_output": raw
            }