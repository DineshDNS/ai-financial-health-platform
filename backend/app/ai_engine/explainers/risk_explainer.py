from app.ai_engine.ollama_client import ask_ollama
from app.ai_engine.prompt_builder import build_risk_prompt

def generate_risk_explanation(kpis, risk_label, health_score):
    prompt = build_risk_prompt(kpis, risk_label, health_score)
    return ask_ollama(prompt)
