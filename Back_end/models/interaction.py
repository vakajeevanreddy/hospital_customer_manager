from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from db.database import Base


class Interaction(Base):
    """SQLAlchemy model for HCP interaction records."""
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    hcp_name = Column(String(255), nullable=True, default="")
    specialty = Column(String(255), nullable=True, default="")
    organization = Column(String(255), nullable=True, default="")
    product_focus = Column(String(255), nullable=True, default="")
    interaction_type = Column(String(100), nullable=True, default="")
    date = Column(String(50), nullable=True, default="")
    time = Column(String(50), nullable=True, default="")
    attendees = Column(Text, nullable=True, default="")
    topics_discussed = Column(Text, nullable=True, default="")
    voice_summary = Column(Text, nullable=True, default="")
    sentiment = Column(String(100), nullable=True, default="")
    follow_up_actions = Column(Text, nullable=True, default="")
    observation = Column(Text, nullable=True, default="")
    materials_shared = Column(Text, nullable=True, default="")
    samples_distributed = Column(Text, nullable=True, default="")
    suggested_references = Column(Text, nullable=True, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
