from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

# Import our custom modules
from ml_engine import crop_predictor
from weather_service import WeatherService, SoilService
from llm_service import farmer_bot

app = FastAPI(title="AgriAI - Farming Assistant")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class PredictionRequest(BaseModel):
    crop: str
    acres: float
    location: str
    # New Fields matching Frontend
    year: int
    state: str
    district: str
    rainfall_mm: float
    pesticide_kg: float
    fertilizer_kg: float

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {"message": "AgriYield AI System Online 🌾"}

@app.post("/api/predict-yield")
def predict_yield(req: PredictionRequest):
    # 1. Gather Intelligence (Layer 1) - Simulating using new location data if needed
    weather = WeatherService.get_current_weather(req.district)
    soil = SoilService.get_soil_data()
    
    # 2. Prepare ML Input
    ml_input = {
        "crop": req.crop,
        "soil_type": soil["soil_type"],
        "season": "Whole Year", 
        "rainfall_mm": req.rainfall_mm, # Use user input
        "temperature_c": weather["temperature_c"],
        "nitrogen": soil["nitrogen"],
        "phosphorus": soil["phosphorus"],
        "potassium": soil["potassium"],
        "ph": soil["ph"],
        "pesticide": req.pesticide_kg,
        "fertilizer": req.fertilizer_kg
    }
    
    # 3. Layer 2: ML Prediction
    prediction = crop_predictor.predict(ml_input)
    
    # 4. Layer 3: LLM Explanation (Smart Advice)
    explanation = farmer_bot.generate_yield_explanation(prediction, weather, ml_input)
    
    return {
        "prediction": prediction,
        "weather": weather,
        "soil": soil,
        "ai_advice": explanation
    }

@app.post("/api/chat")
def chat(req: ChatRequest):
    response = farmer_bot.chat_response(req.message)
    return {"reply": response}

from fastapi import UploadFile, File
from disease_engine import disease_engine

from fastapi import Form

@app.post("/api/detect-disease")
async def detect_disease(file: UploadFile = File(...), crop: str = Form("Rice")):
    # Read image
    contents = await file.read()
    
    # Process with OpenCV/Engine
    result = disease_engine.predict(contents, crop_name=crop)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return {"diagnosis": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
