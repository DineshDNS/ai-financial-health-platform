from app.ai_engine.ollama_client import ask_ollama

def generate_anomaly_explanation(anomaly_result):
    prompt = f"""
You are a financial fraud analyst.

System detected unusual financial patterns:

{anomaly_result}

Explain:
1) What this anomaly means
2) Possible causes
3) Whether it is dangerous
4) What business should check immediately
"""
    return ask_ollama(prompt)
