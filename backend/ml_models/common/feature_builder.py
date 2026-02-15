def safe(value):
    """
    Replace None with 0 so ML model doesn't crash
    """
    return 0 if value is None else value


def build_feature_vector(kpi_data: dict):
    """
    Convert Rule Engine KPI output into ML-ready feature vector
    """

    kpis = kpi_data.get("kpis", {})

    return [
        safe(kpis.get("current_ratio")),
        safe(kpis.get("quick_ratio")),
        safe(kpis.get("working_capital")),
        safe(kpis.get("net_profit_margin")),
        safe(kpis.get("expense_ratio")),
        safe(kpis.get("debt_to_equity")),
        safe(kpis.get("debt_ratio")),
        safe(kpis.get("cashflow_coverage")),
        safe(kpis.get("health_score")),
    ]
