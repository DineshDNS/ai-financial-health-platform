from app.ai_engine.ollama_client import ask_ollama

def generate_forecast_explanation(forecast_data):
    prompt = f"""
Business forecast summary:

{forecast_data}

Explain in 4 short points:
- Future outlook
- Growth trend
- Warning signs
- Planning advice

Keep under 80 words.
"""
    return ask_ollama(prompt)
