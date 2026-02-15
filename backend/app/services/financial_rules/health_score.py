def calculate_health_score(m):
    score = 0

    if m["current_ratio"] and m["current_ratio"] >= 1.5:
        score += 20

    if m["net_profit_margin"] and m["net_profit_margin"] >= 15:
        score += 25

    if m["debt_to_equity"] and m["debt_to_equity"] <= 1:
        score += 20

    if m["cashflow_health"] == "Strong":
        score += 20

    if m["expense_ratio"] and m["expense_ratio"] <= 60:
        score += 15

    return min(score, 100)
