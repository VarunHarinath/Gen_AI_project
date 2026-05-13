from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from utils.image_preprocess import process_image
from services.model_service import get_prediction
from services.llm_service import get_recommendation
import traceback

router = APIRouter()

@router.post("/api/predict")
async def predict_skin_condition(file: UploadFile = File(...)):
    try:
        # Read the file bytes
        image_bytes = await file.read()
        
        # Preprocess the image
        img = process_image(image_bytes)
        
        # Get prediction
        prediction_result = get_prediction(img)
        
        # Get recommendation from LLM
        predicted_class = prediction_result.get("class", "Unknown")
        recommendation = get_recommendation(predicted_class)
        prediction_result["recommendation"] = recommendation
        
        return {
            "success": True,
            "prediction": prediction_result,
            "disclaimer": "This is not a medical diagnosis. Please consult a dermatologist."
        }
        
    except ValueError as ve:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "error": "Invalid image file"
            }
        )
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal server error during prediction"
            }
        )
