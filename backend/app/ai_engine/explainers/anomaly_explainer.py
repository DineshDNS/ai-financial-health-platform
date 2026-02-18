from app.ai_engine.ollama_client import ask_ollama

def generate_anomaly_explanation(anomaly_result):
    prompt = f"""
Financial anomaly detected:

{anomaly_result}

Explain in 4 short points:
- What it means
- Possible causes
- Risk level
- What to check now

Keep response brief.
"""
    return ask_ollama(prompt)
