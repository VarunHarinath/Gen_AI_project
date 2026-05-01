from ultralytics import YOLO
from google.colab import files
import os

# --- INSTRUCTIONS ---
# 1. Install required library: pip install ultralytics
# 2. Update 'model_path' below to the location of the downloaded 'best.pt' file.
# -----------------------------

model_path = './best.pt'

if not os.path.exists(model_path):
    print(f"Error: Model weights not found at {model_path}. Please ensure the file is present.")
else:
    # Load the trained model
    model = YOLO(model_path)

def upload_and_predict_skin_condition(model):
    """
    Prompts the user to upload images and predicts their skin conditions.
    """
    print("Please upload an image of a skin condition to classify:")
    uploaded = files.upload()

    # Run prediction on the uploaded image(s)
    for filename in uploaded.keys():
        print(f"\n--- Results for {filename} ---")
        results = model.predict(source=filename, verbose=False)

        # Extract the top prediction from the first result
        result = results[0]
        top1_index = result.probs.top1
        top1_confidence = result.probs.top1conf.item()
        predicted_class = result.names[top1_index]

        print(f"Prediction: {predicted_class.upper()}")
        print(f"Confidence: {top1_confidence * 100:.2f}%")

# Call the function if the model loaded successfully
if 'model' in locals():
    upload_and_predict_skin_condition(model)