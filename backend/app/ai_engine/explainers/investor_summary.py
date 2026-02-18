from app.ai_engine.ollama_client import ask_ollama

def generate_investor_summary(kpis, risk, health_score):
    prompt = f"""
Investor summary.

Risk: {risk}
Health Score: {health_score}/100

Write 5 short lines:
• Strengths
• Weaknesses
• Risk outlook
• Growth potential
• Investment opinion

Keep concise.
"""
    return ask_ollama(prompt)
