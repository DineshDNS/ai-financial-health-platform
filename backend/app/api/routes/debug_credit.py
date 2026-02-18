from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.financial_rules.rule_engine import generate_financial_kpis
from ml_models.credit_scoring.predict import predict_credit_score

router = APIRouter(prefix="/debug", tags=["Debug"])

@router.get("/credit-test")
def credit_test(db: Session = Depends(get_db)):
    data = generate_financial_kpis(db, user_id=1)
    pred = predict_credit_score(data)

    return {
        "prediction_raw": pred,
        "kpis_used": data["kpis"]
    }
