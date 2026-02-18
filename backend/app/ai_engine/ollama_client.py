import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "tinyllama"


def ask_ollama(prompt: str) -> str:
    """
    Sends prompt to Ollama and returns response text.
    Optimized for speed with TinyLlama.
    """

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "num_predict": 120,     # limit output length → faster
                    "temperature": 0.3,     # more focused responses
                    "top_p": 0.9,
                    "repeat_penalty": 1.1
                }
            },
            timeout=60
        )

        result = response.json()
        return result.get("response", "No response from AI")

    except Exception as e:
        return f"Ollama Error: {str(e)}"
