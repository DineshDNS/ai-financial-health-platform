from app.ai_engine.ollama_client import ask_ollama

def generate_business_recommendations(kpis, risk, health_score):
    prompt = f"""
You are a senior financial advisor.

Business KPIs:
{kpis}

Risk Level: {risk}
Health Score: {health_score}/100

Provide clear business recommendations:

1) How to reduce expenses
2) How to increase revenue
3) How to improve cashflow
4) How to reduce financial risk
5) Immediate action steps

Answer in simple, practical business language.
"""
    return ask_ollama(prompt)
