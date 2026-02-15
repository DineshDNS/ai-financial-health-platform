from sqlalchemy import Column, Integer, Float, String, DateTime
from app.core.database import Base
from datetime import datetime

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(String)
    amount = Column(Float)
    interest_rate = Column(Float)
    start_date = Column(String)
    end_date = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
