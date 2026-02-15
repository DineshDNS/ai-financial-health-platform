def get_risk_band(score):
    if score >= 75:
        return "Low Risk"
    elif score >= 45:
        return "Medium Risk"
    else:
        return "High Risk"
