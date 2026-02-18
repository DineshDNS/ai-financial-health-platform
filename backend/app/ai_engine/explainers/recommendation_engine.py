from app.ai_engine.ollama_client import ask_ollama


def generate_business_recommendations(kpis, risk, health_score):

    prompt = f"""
You are a senior financial advisor helping an SME business owner.

Business Health Score: {health_score}/100
Risk Level: {risk}

Key Financial KPIs:
{kpis}

Based on the above financial condition:

Give 5 practical business recommendations that can:
- Improve profitability
- Reduce financial risk
- Strengthen cashflow
- Support business growth

Rules:
- Use bullet points
- Keep suggestions specific
- Do NOT repeat generic advice
- Do NOT restate the input
- Keep under 120 words
"""

    return ask_ollama(prompt)
