from app.ai_engine.ollama_client import ask_ollama

def generate_credit_explanation(kpis, credit_label):
    prompt = f"""
You are a senior loan officer.

Business KPIs:
{kpis}

AI Credit Decision: {credit_label}

Explain:
1) Why this business is {credit_label}
2) What strengths help loan approval
3) What risks worry lenders
4) How to improve loan eligibility

Answer in simple business English.
"""
    return ask_ollama(prompt)
