
try:
    print("Checking imports...")
    import fastapi
    import uvicorn
    import numpy
    import pandas
    import pandas
    import sklearn
    import cv2
    print("Imports successful.")
except ImportError as e:
    print(f"Import Error: {e}")
    print("Please run: pip install -r backend/requirements.txt")
    exit(1)

try:
    print("Checking ML Engine...")
    from backend.ml_engine import crop_predictor
    print("ML Engine loaded.")
    
    print("Checking Weather Service...")
    from backend.weather_service import WeatherService
    print("Weather Service loaded.")
    
    print("Checking LLM Service...")
    from backend.llm_service import FarmerLLM
    print("LLM Service loaded.")
    
    # Test a prediction
    print("Testing Prediction Logic...")
    sample_input = {
        "crop": "Rice",
        "soil_type": "Clay", 
        "season": "Kharif",
        "rainfall_mm": 600,
        "temperature_c": 30,
        "nitrogen": 50,
        "phosphorus": 30,
        "potassium": 20,
        "ph": 6.5
    }
    result = crop_predictor.predict(sample_input)
    print(f"Prediction result: {result['yield_kg_acre']} kg/acre")
    
except Exception as e:
    print(f"Runtime Error: {e}")
    exit(1)

print("Backend verification passed!")
