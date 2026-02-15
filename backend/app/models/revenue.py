from sqlalchemy import Column, Integer, Float, String, DateTime
from app.core.database import Base
from datetime import datetime

class Revenue(Base):
    __tablename__ = "revenues"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    amount = Column(Float)
    gst_amount = Column(Float)
    source = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
