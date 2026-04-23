from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ── Base Schema ─────────────────────────────────────────────────────────────
class InteractionBase(BaseModel):
    hcp_name: Optional[str] = ""
    specialty: Optional[str] = ""
    organization: Optional[str] = ""
    product_focus: Optional[str] = ""
    interaction_type: Optional[str] = ""
    date: Optional[str] = ""
    time: Optional[str] = ""
    attendees: Optional[str] = ""
    topics_discussed: Optional[str] = ""
    voice_summary: Optional[str] = ""
    sentiment: Optional[str] = ""
    follow_up_actions: Optional[str] = ""
    observation: Optional[str] = ""
    materials_shared: Optional[str] = ""
    samples_distributed: Optional[str] = ""
    suggested_references: Optional[str] = ""


# ── Create Schema ───────────────────────────────────────────────────────────
class InteractionCreate(InteractionBase):
    """Schema used when creating a new interaction"""
    pass


# ── AI Message Schema ──────────────────────────────────────────────────────
class AIMessageRequest(BaseModel):
    """Schema for AI assistant chat messages"""
    message: str
    formData: Optional[dict] = None


# ── Response Schema ─────────────────────────────────────────────────────────
class Interaction(InteractionBase):
    """Schema returned in API responses"""
    id: int
    created_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }
