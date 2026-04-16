from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time


class InteractionData(BaseModel):
    hcp_name: Optional[str] = ""
    interaction_type: Optional[str] = "Meeting"
    date: Optional[str] = ""
    time: Optional[str] = ""
    attendees: Optional[str] = ""
    topics_discussed: Optional[str] = ""
    voice_summary: Optional[str] = ""
    materials_shared: Optional[str] = ""
    samples_distributed: Optional[str] = ""
    observation: Optional[str] = "Neutral"
    follow_up_actions: Optional[str] = ""
    suggested_references: Optional[str] = ""


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    intent: str
    ai_response: str
    form_data: Optional[dict] = None
    tool_used: Optional[str] = None
