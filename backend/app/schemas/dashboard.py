from pydantic import BaseModel
from typing import Dict, Any


class KPISummaryResponse(BaseModel):
    health_score: float
    risk_band: str


class FinancialMetricsResponse(BaseModel):
    metrics: Dict[str, Any]


class TrendResponse(BaseModel):
    revenue: float
    expenses: float
    profit: float


class FullDashboardResponse(BaseModel):
    summary: KPISummaryResponse
    metrics: Dict[str, Any]
    trends: TrendResponse
