import requests

OLLAMA_API_URL = "http://localhost:11434/api/generate"
# Using llama3.2 since it is available on your local Ollama instance
OLLAMA_MODEL = "llama3.2" 

def get_recommendation(condition_class: str) -> str:
    """
    Get recommendation from local Ollama model based on the skin condition.
    """
    if condition_class.lower() == "normal":
        return "Your skin appears to be normal. Continue with your regular skincare routine, including cleansing, moisturizing, and using sunscreen."

    prompt = f"The user has a skin condition detected as '{condition_class}'. What are the common types of {condition_class} and what actionable, general recommendations can be done actually to help with it? Keep it concise, informative, and end with a reminder to consult a medical professional."
    
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "No response generated.")
    except requests.exceptions.RequestException as e:
        print(f"Error calling Ollama API: {e}")
        return f"Could not generate recommendations via Ollama due to an error: {str(e)}"
