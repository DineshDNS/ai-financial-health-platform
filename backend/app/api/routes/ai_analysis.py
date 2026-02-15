from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.financial_rules.rule_engine import generate_financial_kpis

from ml_models.risk_model.predict import predict_risk_from_kpis
from ml_models.credit_scoring.predict import predict_credit_score
from ml_models.anomaly_detection.detect import detect_anomaly

router = APIRouter(prefix="/ai", tags=["AI Analysis"])


@router.get("/risk")
def ai_risk_analysis(db: Session = Depends(get_db)):
    kpi_data = generate_financial_kpis(db)
    risk = predict_risk_from_kpis(kpi_data)

    return {
        "ai_risk_prediction": risk,
        "health_score": kpi_data.get("health_score")
    }


@router.get("/credit")
def ai_credit_analysis(db: Session = Depends(get_db)):
    kpi_data = generate_financial_kpis(db)
    credit = predict_credit_score(kpi_data)

    return {
        "credit_decision": credit
    }


@router.get("/anomaly")
def ai_anomaly_analysis(db: Session = Depends(get_db)):
    kpi_data = generate_financial_kpis(db)

    aggregates = kpi_data.get("aggregates", {})
    kpis = kpi_data.get("kpis", {})

    expense = aggregates.get("expenses", 0)
    revenue = aggregates.get("revenue", 0)
    cashflow = kpis.get("cashflow_coverage", 0)

    result = detect_anomaly(expense, revenue, cashflow)

    return {
        "anomaly_status": result
    }
