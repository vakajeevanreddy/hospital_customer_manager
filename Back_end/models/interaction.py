from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from db.database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255))
    specialty = Column(String(255))
    organization = Column(String(255))
    interaction_type = Column(String(100))
    date = Column(String(20))
    time = Column(String(20))
    observation = Column(String(50))
    product_focus = Column(String(255))
    attendees = Column(Text)
    topics_discussed = Column(Text)
    voice_summary = Column(Text)
    follow_up_actions = Column(Text)
    materials_shared = Column(Text)
    samples_distributed = Column(Text)
    suggested_references = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
