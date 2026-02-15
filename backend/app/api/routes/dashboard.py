from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.dashboard.dashboard_service import get_dashboard_data

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# ---------------------------------------------------------
# KPI SUMMARY API
# ---------------------------------------------------------
@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    data = get_dashboard_data(db)

    return {
        "health_score": data["health_score"],
        "risk_band": data["risk_band"]
    }


# ---------------------------------------------------------
# FINANCIAL METRICS API
# ---------------------------------------------------------
@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):
    data = get_dashboard_data(db)

    return data["kpis"]


# ---------------------------------------------------------
# TREND DATA API
# ---------------------------------------------------------
@router.get("/trends")
def get_trends(db: Session = Depends(get_db)):
    data = get_dashboard_data(db)

    return {
        "revenue": data["aggregates"]["revenue"],
        "expenses": data["aggregates"]["expenses"],
        "profit": data["aggregates"]["net_profit"]
    }


# ---------------------------------------------------------
# FULL DASHBOARD API (PRIMARY ENDPOINT FOR FRONTEND)
# ---------------------------------------------------------
@router.get("/full")
def get_full_dashboard(db: Session = Depends(get_db)):
    data = get_dashboard_data(db)

    return {
        "summary": {
            "health_score": data["health_score"],
            "risk_band": data["risk_band"]
        },
        "metrics": data["kpis"],
        "trends": {
            "revenue": data["aggregates"]["revenue"],
            "expenses": data["aggregates"]["expenses"],
            "profit": data["aggregates"]["net_profit"]
        }
    }
