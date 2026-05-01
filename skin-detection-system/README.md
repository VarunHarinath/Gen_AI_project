# Skin Condition Detection System

This is a full-stack AI-powered web application for detecting potential skin conditions from uploaded images.

> **Disclaimer**: This is an educational AI project, not a medical diagnosis tool. Do not use this for clinical or medical decision making. Please consult a dermatologist for any real medical concerns.

## Features
- **Frontend**: Built with React, Vite, and Vanilla CSS with premium glassmorphism aesthetics.
- **Backend**: Built with FastAPI, utilizing a custom YOLO model for image classification.
- **Supported Conditions**: Normal, Acne, Dry, Eczema, Mole.

## Setup Instructions

### 1. Backend Setup

The backend requires Python 3.8+.

1. Navigate to the `backend` directory:
   ```bash
   cd skin-detection-system/backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

The backend API will be available at `http://localhost:8000`. 
The `POST /api/predict` endpoint accepts multipart/form-data with a `file` field containing the image.

### 2. Frontend Setup

The frontend requires Node.js (v18+ recommended).

1. Navigate to the `frontend` directory:
   ```bash
   cd skin-detection-system/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

The React app will typically be available at `http://localhost:5173`. 
Upload an image and test the prediction flow.

## Note on Model
The system looks for a `best.pt` file in the `backend` directory. If it is not found, the prediction API will run in a placeholder mode and return a dummy result to demonstrate the UI workflow.
