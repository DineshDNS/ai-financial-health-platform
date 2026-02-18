from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.financial_rules.rule_engine import generate_financial_kpis

from ml_models.risk_model.predict import predict_risk
from ml_models.credit_scoring.predict import predict_credit_score
from ml_models.anomaly_detection.detect import detect_anomaly

router = APIRouter(prefix="/ai", tags=["AI Analysis"])


# ---------------------------------------------------------
# AI RISK ANALYSIS
# ---------------------------------------------------------
@router.get("/risk")
def ai_risk_analysis(db: Session = Depends(get_db)):

    # TEMP USER (until Phase 9 JWT)
    user_id = 1

    kpi_data = generate_financial_kpis(db, user_id)

    aggregates = kpi_data.get("aggregates", {})

    revenue = aggregates.get("revenue", 0)
    expenses = aggregates.get("expenses", 0)
    debt = aggregates.get("total_debt", 0)

    cashflow = aggregates.get("cash_inflow", 0) - aggregates.get("cash_outflow", 0)
    profit = aggregates.get("net_profit", 0)

    model_input = {
        "revenue": revenue,
        "expenses": expenses,
        "debt": debt,
        "cashflow": cashflow,
        "profit": profit
    }

    risk = predict_risk(model_input)

    return {
        "ai_risk_prediction": risk,
        "health_score": kpi_data.get("health_score"),
        "risk_band_rule_engine": kpi_data.get("risk_band")
    }


# ---------------------------------------------------------
# AI CREDIT ANALYSIS
# ---------------------------------------------------------
@router.get("/credit")
def ai_credit_analysis(db: Session = Depends(get_db)):

    user_id = 1

    kpi_data = generate_financial_kpis(db, user_id)
    credit = predict_credit_score(kpi_data)

    return {
        "credit_decision": credit
    }


# ---------------------------------------------------------
# AI ANOMALY ANALYSIS
# ---------------------------------------------------------
@router.get("/anomaly")
def ai_anomaly_analysis(db: Session = Depends(get_db)):

    user_id = 1

    kpi_data = generate_financial_kpis(db, user_id)

    aggregates = kpi_data.get("aggregates", {})
    kpis = kpi_data.get("kpis", {})

    expense = aggregates.get("expenses", 0)
    revenue = aggregates.get("revenue", 0)
    cashflow = kpis.get("cashflow_coverage", 0)

    result = detect_anomaly(expense, revenue, cashflow)

    return {
        "anomaly_status": result
    }
