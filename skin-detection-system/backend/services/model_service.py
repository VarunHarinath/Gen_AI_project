import os
from ultralytics import YOLO
from PIL import Image

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "best.pt")

model = None
model_loaded = False

def load_model():
    global model, model_loaded
    if os.path.exists(MODEL_PATH):
        try:
            model = YOLO(MODEL_PATH)
            model_loaded = True
            print(f"Model loaded successfully from {MODEL_PATH}")
        except Exception as e:
            print(f"Failed to load model: {e}")
    else:
        print(f"Warning: Model file not found at {MODEL_PATH}. Running in placeholder mode.")

# Explanations mapping for the 5 target classes
EXPLANATIONS = {
    "Normal": "No signs of significant skin conditions detected. The skin appears clear.",
    "Acne": "Possible signs of acne detected, which may include papules, pustules, or nodules.",
    "Dry": "Possible signs of dry skin detected, such as flakiness or rough texture.",
    "Eczema": "Possible signs of eczema-like skin texture were detected, characterized by redness or scaling.",
    "Mole": "A mole or pigmented lesion was detected. Regular monitoring is recommended."
}

def get_prediction(image: Image.Image):
    """
    Runs the image through the YOLO model if loaded,
    otherwise returns a placeholder prediction.
    """
    if model_loaded and model is not None:
        try:
            # Predict
            results = model.predict(source=image, verbose=False)
            result = results[0]
            
            top1_index = result.probs.top1
            top1_confidence = float(result.probs.top1conf.item())
            predicted_class = result.names[top1_index]
            
            # Format class name (e.g. capitalize)
            predicted_class = predicted_class.capitalize()
            
            explanation = EXPLANATIONS.get(
                predicted_class, 
                f"Possible signs of {predicted_class.lower()} detected."
            )
            
            return {
                "class": predicted_class,
                "confidence": round(top1_confidence, 2),
                "explanation": explanation
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            raise RuntimeError("Error during model prediction")
    else:
        # TODO: Replace placeholder logic with actual inference if model is not present
        return {
            "class": "Eczema",
            "confidence": 0.91,
            "explanation": "Possible signs of eczema-like skin texture were detected (Placeholder)."
        }
