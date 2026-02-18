from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.core.database import Base

class AIExplanation(Base):
    __tablename__ = "ai_explanations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)

    type = Column(String, index=True)
    # risk / credit / anomaly / forecast / investor / recommendations

    content = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)
