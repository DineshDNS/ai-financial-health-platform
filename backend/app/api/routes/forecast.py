from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.forecasting.forecast_service import generate_forecasts

router = APIRouter()


@router.get("/forecast")
def get_forecast(db: Session = Depends(get_db)):
    return generate_forecasts(db)
