from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.predict import router as predict_router
from services.model_service import load_model

app = FastAPI(title="Skin Condition Detection API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model on startup
@app.on_event("startup")
async def startup_event():
    load_model()

# Register routes
app.include_router(predict_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Skin Condition Detection API"}
