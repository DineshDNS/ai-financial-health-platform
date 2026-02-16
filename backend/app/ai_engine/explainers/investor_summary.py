from app.ai_engine.ollama_client import ask_ollama

def generate_investor_summary(kpis, risk, health_score):
    prompt = f"""
You are an investment analyst preparing a report.

Business KPIs:
{kpis}

Risk Level: {risk}
Health Score: {health_score}/100

Write a professional investor summary including:

• Business strengths
• Business weaknesses
• Risk outlook
• Investment recommendation

Keep it concise and professional.
"""
    return ask_ollama(prompt)
