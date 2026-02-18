from app.ai_engine.ollama_client import ask_ollama
from app.ai_engine.prompt_builder import build_risk_prompt

def generate_risk_explanation(kpis, risk_label, health_score):
    prompt = f"""
Financial risk analysis.

Risk: {risk_label}
Health Score: {health_score}/100

Give 4 short bullet points:
- Why this risk level
- Main financial concern
- Impact on business
- One improvement tip

Keep answer under 80 words.
"""
    return ask_ollama(prompt)
