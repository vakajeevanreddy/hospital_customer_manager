from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.interaction import Interaction
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class InteractionSchema(BaseModel):
    hcp_name: Optional[str] = ""
    specialty: Optional[str] = ""
    organization: Optional[str] = ""
    interaction_type: Optional[str] = ""
    date: Optional[str] = ""
    time: Optional[str] = ""
    observation: Optional[str] = ""
    product_focus: Optional[str] = ""
    attendees: Optional[str] = ""
    topics_discussed: Optional[str] = ""
    voice_summary: Optional[str] = ""
    materials_shared: Optional[str] = ""
    samples_distributed: Optional[str] = ""
    suggested_references: Optional[str] = ""
    follow_up_actions: Optional[str] = ""

    class Config:
        orm_mode = True

@router.post("/interactions")
def create_interaction(data: InteractionSchema, db: Session = Depends(get_db)):
    db_interaction = Interaction(**data.dict())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@router.get("/interactions", response_model=List[InteractionSchema])
def get_interactions(db: Session = Depends(get_db)):
    return db.query(Interaction).order_by(Interaction.created_at.desc()).all()
