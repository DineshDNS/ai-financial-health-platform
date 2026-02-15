def debt_to_equity(total_debt, equity):
    if equity == 0:
        return None
    return round(total_debt / equity, 2)


def debt_ratio(total_debt, current_assets):
    if current_assets == 0:
        return None
    return round(total_debt / current_assets, 2)
