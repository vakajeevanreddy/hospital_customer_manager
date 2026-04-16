from services.langgraph_agent import run_agent
import json

test_input = "I have a doctor Ramesh appointment at 11:00 and observation is negative"
result = run_agent(test_input)

print("AI Response:", result["messages"][-1].content)
print("Form Data:", json.dumps(result.get("form_data"), indent=2))
