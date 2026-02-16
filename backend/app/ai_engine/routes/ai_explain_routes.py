from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.financial_rules.rule_engine import generate_financial_kpis

from app.ai_engine.explainers.risk_explainer import generate_risk_explanation
from app.ai_engine.explainers.credit_explainer import generate_credit_explanation
from app.ai_engine.explainers.anomaly_explainer import generate_anomaly_explanation
from app.ai_engine.explainers.forecast_explainer import generate_forecast_explanation
from app.ai_engine.explainers.investor_summary import generate_investor_summary
from app.ai_engine.explainers.recommendation_engine import generate_business_recommendations


router = APIRouter(
    prefix="/ai/explain",
    tags=["AI Explanation"]
)

# --------------------------------------------------
# RISK EXPLANATION
# --------------------------------------------------
@router.get("/risk")
def explain_risk(db: Session = Depends(get_db)):

    data = generate_financial_kpis(db)

    explanation = generate_risk_explanation(
        kpis=data["kpis"],
        risk_label=data["risk_band"],
        health_score=data["health_score"]
    )

    return {
        "risk_label": data["risk_band"],
        "health_score": data["health_score"],
        "ai_explanation": explanation
    }


# --------------------------------------------------
# CREDIT EXPLANATION
# --------------------------------------------------
@router.get("/credit")
def explain_credit(db: Session = Depends(get_db)):

    data = generate_financial_kpis(db)

    # Temporary label (later replace with ML credit model output)
    credit_label = "Eligible"

    explanation = generate_credit_explanation(
        kpis=data["kpis"],
        credit_label=credit_label
    )

    return {
        "credit_label": credit_label,
        "ai_explanation": explanation
    }


# --------------------------------------------------
# ANOMALY EXPLANATION
# --------------------------------------------------
@router.get("/anomaly")
def explain_anomaly():

    # Placeholder until ML anomaly output is connected
    anomaly_result = {
        "expense_spike": True,
        "revenue_drop": False,
        "cashflow_irregularity": True
    }

    explanation = generate_anomaly_explanation(anomaly_result)

    return {
        "anomaly_detected": anomaly_result,
        "ai_explanation": explanation
    }


# --------------------------------------------------
# FORECAST EXPLANATION
# --------------------------------------------------
@router.get("/forecast")
def explain_forecast():

    # Placeholder until forecast engine is connected
    forecast_data = {
        "next_3_months_revenue_trend": "Increasing",
        "next_3_months_expense_trend": "Stable",
        "cashflow_outlook": "Positive"
    }

    explanation = generate_forecast_explanation(forecast_data)

    return {
        "forecast_data": forecast_data,
        "ai_explanation": explanation
    }


# --------------------------------------------------
# INVESTOR SUMMARY
# --------------------------------------------------
@router.get("/investor-summary")
def investor_summary(db: Session = Depends(get_db)):

    data = generate_financial_kpis(db)

    summary = generate_investor_summary(
        kpis=data["kpis"],
        risk=data["risk_band"],
        health_score=data["health_score"]
    )

    return {
        "risk_level": data["risk_band"],
        "health_score": data["health_score"],
        "investor_summary": summary
    }

# --------------------------------------------------
# AI BUSINESS RECOMMENDATIONS
# --------------------------------------------------
@router.get("/recommendations")
def business_recommendations(db: Session = Depends(get_db)):

    data = generate_financial_kpis(db)

    rec = generate_business_recommendations(
        kpis=data["kpis"],
        risk=data["risk_band"],
        health_score=data["health_score"]
    )

    return {
        "risk_level": data["risk_band"],
        "health_score": data["health_score"],
        "recommendations": rec
    }
