from app.ai_engine.ollama_client import ask_ollama

def generate_credit_explanation(kpis, credit_label):
    prompt = f"""
Loan eligibility analysis.

Decision: {credit_label}

Explain in 4 short points:
- Why this decision
- Strengths helping approval
- Risks for lenders
- How to improve eligibility

Use simple language.
Keep under 90 words.
"""
    return ask_ollama(prompt)
