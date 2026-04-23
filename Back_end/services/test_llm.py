from llm_service import call_llm_json

test_input = "Meeting with Dr. Priya tomorrow at 3 PM about Oncology"
result = call_llm_json(test_input)
print("Parsed result:", result)
