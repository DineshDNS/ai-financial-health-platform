from app.ai_engine.ollama_client import ask_ollama

def generate_forecast_explanation(forecast_data):
    prompt = f"""
You are a financial planning expert.

Future predictions:

{forecast_data}

Explain:
1) Business future outlook
2) Growth trend
3) Warning signs
4) Strategic planning advice
"""
    return ask_ollama(prompt)
