from sqlalchemy import Column, Integer, Float, String, DateTime
from app.core.database import Base
from datetime import datetime

class BankTransaction(Base):
    __tablename__ = "bank_transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    debit = Column(Float)
    credit = Column(Float)
    balance = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
