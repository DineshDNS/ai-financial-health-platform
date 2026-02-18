from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.financial_rules.rule_engine import generate_financial_kpis

from app.models.ai_explanations import AIExplanation

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

# TEMP until JWT is added
DEFAULT_USER_ID = 1


# --------------------------------------------------
# UNIVERSAL CACHE HELPER
# --------------------------------------------------
def get_or_generate_explanation(db, user_id, exp_type, generator_func):
    """
    1) Check DB cache
    2) If exists → return instantly
    3) Else → generate using Ollama
    4) Save to DB
    """

    cached = db.query(AIExplanation).filter(
        AIExplanation.user_id == user_id,
        AIExplanation.type == exp_type
    ).first()

    if cached:
        return cached.content

    # Generate using Ollama
    content = generator_func()

    # Save to DB
    new_record = AIExplanation(
        user_id=user_id,
        type=exp_type,
        content=content
    )
    db.add(new_record)
    db.commit()

    return content


# --------------------------------------------------
# RISK EXPLANATION
# --------------------------------------------------
@router.get("/risk")
def explain_risk(db: Session = Depends(get_db)):

    user_id = DEFAULT_USER_ID
    data = generate_financial_kpis(db, user_id)

    def generator():
        return generate_risk_explanation(
            kpis=data["kpis"],
            risk_label=data["risk_band"],
            health_score=data["health_score"]
        )

    explanation = get_or_generate_explanation(db, user_id, "risk", generator)

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

    user_id = DEFAULT_USER_ID
    data = generate_financial_kpis(db, user_id)

    credit_label = "Eligible"

    def generator():
        return generate_credit_explanation(
            kpis=data["kpis"],
            credit_label=credit_label
        )

    explanation = get_or_generate_explanation(db, user_id, "credit", generator)

    return {
        "credit_label": credit_label,
        "ai_explanation": explanation
    }


# --------------------------------------------------
# ANOMALY EXPLANATION
# --------------------------------------------------
@router.get("/anomaly")
def explain_anomaly(db: Session = Depends(get_db)):

    user_id = DEFAULT_USER_ID

    anomaly_result = {
        "expense_spike": True,
        "revenue_drop": False,
        "cashflow_irregularity": True
    }

    def generator():
        return generate_anomaly_explanation(anomaly_result)

    explanation = get_or_generate_explanation(db, user_id, "anomaly", generator)

    return {
        "anomaly_detected": anomaly_result,
        "ai_explanation": explanation
    }


# --------------------------------------------------
# FORECAST EXPLANATION
# --------------------------------------------------
@router.get("/forecast")
def explain_forecast(db: Session = Depends(get_db)):

    user_id = DEFAULT_USER_ID

    forecast_data = {
        "next_3_months_revenue_trend": "Increasing",
        "next_3_months_expense_trend": "Stable",
        "cashflow_outlook": "Positive"
    }

    def generator():
        return generate_forecast_explanation(forecast_data)

    explanation = get_or_generate_explanation(db, user_id, "forecast", generator)

    return {
        "forecast_data": forecast_data,
        "ai_explanation": explanation
    }


# --------------------------------------------------
# INVESTOR SUMMARY
# --------------------------------------------------
@router.get("/investor-summary")
def investor_summary(db: Session = Depends(get_db)):

    user_id = DEFAULT_USER_ID
    data = generate_financial_kpis(db, user_id)

    def generator():
        return generate_investor_summary(
            kpis=data["kpis"],
            risk=data["risk_band"],
            health_score=data["health_score"]
        )

    summary = get_or_generate_explanation(db, user_id, "investor", generator)

    return {
        "risk_level": data["risk_band"],
        "health_score": data["health_score"],
        "investor_summary": summary
    }


# --------------------------------------------------
# BUSINESS RECOMMENDATIONS
# --------------------------------------------------
@router.get("/recommendations")
def business_recommendations(db: Session = Depends(get_db)):

    user_id = DEFAULT_USER_ID
    data = generate_financial_kpis(db, user_id)

    def generator():
        return generate_business_recommendations(
            kpis=data["kpis"],
            risk=data["risk_band"],
            health_score=data["health_score"]
        )

    rec = get_or_generate_explanation(db, user_id, "recommendations", generator)

    return {
        "risk_level": data["risk_band"],
        "health_score": data["health_score"],
        "recommendations": rec
    }
