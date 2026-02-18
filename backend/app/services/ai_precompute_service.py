from app.core.database import SessionLocal
from app.services.financial_rules.rule_engine import generate_financial_kpis
from app.models.ai_explanations import AIExplanation

from app.ai_engine.explainers.risk_explainer import generate_risk_explanation
from app.ai_engine.explainers.credit_explainer import generate_credit_explanation
from app.ai_engine.explainers.anomaly_explainer import generate_anomaly_explanation
from app.ai_engine.explainers.forecast_explainer import generate_forecast_explanation
from app.ai_engine.explainers.investor_summary import generate_investor_summary
from app.ai_engine.explainers.recommendation_engine import generate_business_recommendations


def store_ai_cache(db, user_id: int, exp_type: str, content: str):
    existing = db.query(AIExplanation).filter(
        AIExplanation.user_id == user_id,
        AIExplanation.type == exp_type
    ).first()

    if existing:
        existing.content = content
    else:
        db.add(AIExplanation(
            user_id=user_id,
            type=exp_type,
            content=content
        ))

    db.commit()


def precompute_ai_after_upload(user_id: int):
    """
    Runs in background thread
    Does NOT block upload API
    """

    db = SessionLocal()

    try:
        print("⚡ Background AI precompute started...")

        data = generate_financial_kpis(db, user_id)

        kpis = data["kpis"]
        risk = data["risk_band"]
        health = data["health_score"]

        # RISK
        store_ai_cache(db, user_id, "risk",
            generate_risk_explanation(kpis, risk, health)
        )

        # CREDIT
        store_ai_cache(db, user_id, "credit",
            generate_credit_explanation(kpis, "Eligible")
        )

        # ANOMALY
        store_ai_cache(db, user_id, "anomaly",
            generate_anomaly_explanation({
                "expense_spike": True,
                "revenue_drop": False,
                "cashflow_irregularity": True
            })
        )

        # FORECAST
        store_ai_cache(db, user_id, "forecast",
            generate_forecast_explanation({
                "next_3_months_revenue_trend": "Increasing",
                "next_3_months_expense_trend": "Stable",
                "cashflow_outlook": "Positive"
            })
        )

        # INVESTOR
        store_ai_cache(db, user_id, "investor",
            generate_investor_summary(kpis, risk, health)
        )

        # RECOMMENDATIONS
        store_ai_cache(db, user_id, "recommendations",
            generate_business_recommendations(kpis, risk, health)
        )

        print("✅ AI background precompute finished.")

    finally:
        db.close()
