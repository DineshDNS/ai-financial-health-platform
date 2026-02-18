from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.database import Base

class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String, index=True)
    detected_type = Column(String)
    rows_extracted = Column(Integer)
    status = Column(String, default="active")
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, index=True)
