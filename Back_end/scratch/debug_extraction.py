import sys
import os
import json

# Add parent directory to path to import services/tools
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.llm_service import call_llm_json
from tools.log_tool import log_interaction_tool

test_input = "Met Dr. John (Cardiology) at Apollo Hospital regarding product Detmrri 358. Interaction type: Call at 12:42 on 15-04-2026. Location: Ongole. Attendees: Hospital staff. Scientific topics discussed: Clinical data, efficacy, and safety profile. Sentiment: Interested."

print(f"Testing input: {test_input}\n")

# Modify call_llm_json temporarily or just observe output
result = log_interaction_tool(test_input)

print("PARSED RESULT:")
print(json.dumps(result, indent=2))

extracted = [k for k, v in result.items() if v]
print(f"\nExtracted fields: {extracted}")
