from fastapi import APIRouter, Request
from services.langgraph_agent import run_agent

router = APIRouter()

@router.post("/ai-assistant")
async def ai_assistant(request: Request):
    data = await request.json()
    input_text = data.get("message", "")
    context_data = data.get("formData") or data.get("context") or {}
    
    result = run_agent(input_text, context_data)
    return result
