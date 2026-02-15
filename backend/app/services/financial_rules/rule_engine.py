from .aggregation_engine import get_financial_aggregates
from .liquidity import current_ratio, quick_ratio, working_capital
from .profitability import net_profit_margin, expense_ratio
from .leverage import debt_to_equity, debt_ratio
from .cashflow import cashflow_coverage, cashflow_health
from .efficiency import expense_efficiency
from .health_score import calculate_health_score
from .risk_band import get_risk_band


def generate_financial_kpis(db):
    """
    Main Rule Engine Entry Point
    Called by:
    - Phase 4 Dashboard APIs
    - Phase 5 ML models (later)
    - Phase 7 AI explanation layer (later)
    """

    # Pull aggregated financial values from DB
    data = get_financial_aggregates(db)

    metrics = {}

    # -----------------------------
    # LIQUIDITY METRICS
    # -----------------------------
    metrics["current_ratio"] = current_ratio(
        data["current_assets"],
        data["current_liabilities"]
    )

    metrics["quick_ratio"] = quick_ratio(
        data["current_assets"],
        data["inventory_value"],
        data["current_liabilities"]
    )

    metrics["working_capital"] = working_capital(
        data["current_assets"],
        data["current_liabilities"]
    )

    # -----------------------------
    # PROFITABILITY METRICS
    # -----------------------------
    metrics["net_profit_margin"] = net_profit_margin(
        data["net_profit"],
        data["revenue"]
    )

    metrics["expense_ratio"] = expense_ratio(
        data["expenses"],
        data["revenue"]
    )

    # -----------------------------
    # LEVERAGE METRICS
    # -----------------------------
    metrics["debt_to_equity"] = debt_to_equity(
        data["total_debt"],
        data["equity"]
    )

    metrics["debt_ratio"] = debt_ratio(
        data["total_debt"],
        data["current_assets"]
    )

    # -----------------------------
    # CASHFLOW METRICS
    # -----------------------------
    metrics["cashflow_coverage"] = cashflow_coverage(
        data["cash_inflow"],
        data["total_debt"]
    )

    metrics["cashflow_health"] = cashflow_health(
        data["cash_inflow"],
        data["cash_outflow"]
    )

    # -----------------------------
    # EFFICIENCY METRIC
    # -----------------------------
    metrics["expense_efficiency"] = expense_efficiency(
        data["net_profit"],
        data["expenses"]
    )

    # -----------------------------
    # FINAL INTELLIGENCE
    # -----------------------------
    health_score = calculate_health_score(metrics)
    risk_band = get_risk_band(health_score)

    # Add to metrics dictionary
    metrics["health_score"] = health_score
    metrics["risk_band"] = risk_band

    return {
        "aggregates": data,
        "kpis": metrics,
        "health_score": health_score,
        "risk_band": risk_band
    }
