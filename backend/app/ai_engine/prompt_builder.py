def build_risk_prompt(kpis, risk_label, health_score):
    return f"""
You are a senior financial analyst.

Business KPIs:
{kpis}

Predicted Risk Level: {risk_label}
Health Score: {health_score}/100

Explain:
1) Why this business is in this risk category
2) Key weaknesses
3) Immediate improvements
4) Long-term strategy

Answer in simple business English.
"""
