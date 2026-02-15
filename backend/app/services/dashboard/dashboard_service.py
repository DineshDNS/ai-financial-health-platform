from app.services.financial_rules.rule_engine import generate_financial_kpis


def get_dashboard_data(db):
    """
    Central service layer that fetches financial intelligence
    from Phase 3 Rule Engine.
    """

    result = generate_financial_kpis(db)

    return result
