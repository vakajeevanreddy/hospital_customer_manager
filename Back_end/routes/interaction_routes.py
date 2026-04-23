from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.interaction import Interaction as InteractionModel
from db.schemas import InteractionCreate, Interaction as InteractionSchema
from typing import List

router = APIRouter()


@router.post("/interactions", response_model=InteractionSchema)
def create_interaction(data: InteractionCreate, db: Session = Depends(get_db)):
    """Save a new HCP interaction to the database."""
    try:
        db_interaction = InteractionModel(
            hcp_name=data.hcp_name or "",
            specialty=data.specialty or "",
            organization=data.organization or "",
            product_focus=data.product_focus or "",
            interaction_type=data.interaction_type or "",
            date=data.date or "",
            time=data.time or "",
            attendees=data.attendees or "",
            topics_discussed=data.topics_discussed or "",
            voice_summary=data.voice_summary or "",
            sentiment=data.sentiment or "",
            follow_up_actions=data.follow_up_actions or "",
            observation=data.observation or "",
            materials_shared=data.materials_shared or "",
            samples_distributed=data.samples_distributed or "",
            suggested_references=data.suggested_references or "",
        )
        db.add(db_interaction)
        db.commit()
        db.refresh(db_interaction)
        return db_interaction
    except Exception as e:
        db.rollback()
        print(f"ERROR: Failed to save interaction: {str(e)}")  # This will show up in your terminal
        raise HTTPException(status_code=400, detail=f"Error creating interaction: {str(e)}")


@router.get("/interactions", response_model=List[InteractionSchema])
def get_interactions(db: Session = Depends(get_db)):
    """Get all interactions, newest first."""
    return db.query(InteractionModel).order_by(InteractionModel.created_at.desc()).all()
