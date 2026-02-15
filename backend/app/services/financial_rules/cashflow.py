def cashflow_coverage(cash_inflow, total_debt):
    if total_debt == 0:
        return None
    return round(cash_inflow / total_debt, 2)


def cashflow_health(cash_inflow, cash_outflow):
    if cash_outflow == 0:
        return "Strong"

    ratio = cash_inflow / cash_outflow

    if ratio >= 1.5:
        return "Strong"
    elif ratio >= 1.0:
        return "Stable"
    else:
        return "Risky"
