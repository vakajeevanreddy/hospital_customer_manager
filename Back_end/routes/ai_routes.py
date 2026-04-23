from fastapi import APIRouter
from db.schemas import AIMessageRequest
from services.langgraph_agent import run_agent

router = APIRouter()


@router.post("/ai-assistant")
def ai_assistant(req: AIMessageRequest):
    """
    AI Assistant endpoint.
    Accepts { "message": "...", "formData": {...} }
    Returns { "response": "...", "formData": {...} }
    """
    try:
        # Pass the user message and existing form data to the agent
        context_data = req.formData or {}
        result = run_agent(req.message, context_data)

        return {
            "response": result.get("response", "Extraction complete."),
            "formData": result.get("formData", {})
        }
    except Exception as e:
        print(f"AI Assistant error: {e}")
        return {
            "response": f"Error processing your request: {str(e)}",
            "formData": req.formData or {}
        }
