from sqlalchemy import Column, Integer, Float, String, DateTime
from app.core.database import Base
from datetime import datetime

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String)
    quantity = Column(Integer)
    unit_price = Column(Float)
    last_updated = Column(String)

    # NEW FIELDS
    source_file = Column(String, index=True)
    user_id = Column(Integer, index=True)

    created_at = Column(DateTime, default=datetime.utcnow)
