from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from .database import Base
import datetime

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255), index=True)
    
    # Pharma/Hospital Specific Fields
    specialty = Column(String(100), index=True, nullable=True) # e.g., Oncology, Cardiology
    organization = Column(String(255), index=True, nullable=True) # e.g., Apollo Hospital, CVS
    product_focus = Column(String(255), nullable=True) # e.g., Brand X, Vaccination Y
    medical_inquiry = Column(Boolean, default=False)
    
    interaction_type = Column(String(50))
    date = Column(String(20))
    time = Column(String(10))
    attendees = Column(Text, nullable=True)
    topics_discussed = Column(Text, nullable=True)
    voice_summary = Column(Text, nullable=True)
    materials_shared = Column(Text, nullable=True)
    samples_distributed = Column(Text, nullable=True)
    observation = Column(String(50), default="Neutral")
    follow_up_actions = Column(Text, nullable=True)
    suggested_references = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
