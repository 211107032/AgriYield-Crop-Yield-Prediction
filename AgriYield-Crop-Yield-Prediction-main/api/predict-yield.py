from http.server import BaseHTTPRequestHandler
import json
import random
import numpy as np

# ============================================================
# CROP YIELD PREDICTION — Vercel Serverless Function
# Combines: ml_engine.py + weather_service.py + llm_service.py
# ============================================================

# Scientific Crop Data (Ideal Conditions)
CROP_IDEALS = {
    "Rice": {"ideal_temp": 28, "ideal_rain": 1200, "ideal_fert": 120, "ideal_pest": 3, "base_yield": 2000, "max_yield": 3900},
    "Wheat": {"ideal_temp": 20, "ideal_rain": 500, "ideal_fert": 100, "ideal_pest": 2, "base_yield": 3000, "max_yield": 4200},
    "Maize": {"ideal_temp": 25, "ideal_rain": 800, "ideal_fert": 150, "ideal_pest": 2, "base_yield": 2000, "max_yield": 3500},
    "Cotton": {"ideal_temp": 30, "ideal_rain": 700, "ideal_fert": 180, "ideal_pest": 3, "base_yield": 800, "max_yield": 1500},
    "Sugarcane": {"ideal_temp": 28, "ideal_rain": 1500, "ideal_fert": 250, "ideal_pest": 5, "base_yield": 40000, "max_yield": 60000},
    "Arhar (Tur)": {"ideal_temp": 30, "ideal_rain": 600, "ideal_fert": 40, "ideal_pest": 1, "base_yield": 400, "max_yield": 800},
    "Gram (Chana)": {"ideal_temp": 20, "ideal_rain": 400, "ideal_fert": 30, "ideal_pest": 1, "base_yield": 500, "max_yield": 1000},
    "Urad": {"ideal_temp": 28, "ideal_rain": 500, "ideal_fert": 25, "ideal_pest": 1, "base_yield": 300, "max_yield": 600},
    "Moong": {"ideal_temp": 30, "ideal_rain": 500, "ideal_fert": 25, "ideal_pest": 1, "base_yield": 300, "max_yield": 600},
    "Groundnut": {"ideal_temp": 28, "ideal_rain": 600, "ideal_fert": 60, "ideal_pest": 2, "base_yield": 800, "max_yield": 1500},
    "Soybean": {"ideal_temp": 28, "ideal_rain": 700, "ideal_fert": 50, "ideal_pest": 2, "base_yield": 800, "max_yield": 1200},
    "Mustard": {"ideal_temp": 20, "ideal_rain": 300, "ideal_fert": 60, "ideal_pest": 2, "base_yield": 600, "max_yield": 1000},
    "Sunflower": {"ideal_temp": 25, "ideal_rain": 500, "ideal_fert": 60, "ideal_pest": 2, "base_yield": 600, "max_yield": 1200},
    "Jowar": {"ideal_temp": 30, "ideal_rain": 500, "ideal_fert": 50, "ideal_pest": 2, "base_yield": 800, "max_yield": 1500},
    "Bajra": {"ideal_temp": 32, "ideal_rain": 400, "ideal_fert": 40, "ideal_pest": 2, "base_yield": 700, "max_yield": 1500},
    "Potato": {"ideal_temp": 18, "ideal_rain": 400, "ideal_fert": 120, "ideal_pest": 4, "base_yield": 8000, "max_yield": 12000},
    "Onion": {"ideal_temp": 25, "ideal_rain": 500, "ideal_fert": 80, "ideal_pest": 4, "base_yield": 6000, "max_yield": 10000},
    "Tomato": {"ideal_temp": 25, "ideal_rain": 600, "ideal_fert": 100, "ideal_pest": 4, "base_yield": 10000, "max_yield": 25000},
    "Brinjal": {"ideal_temp": 28, "ideal_rain": 700, "ideal_fert": 90, "ideal_pest": 4, "base_yield": 8000, "max_yield": 15000},
    "Banana": {"ideal_temp": 27, "ideal_rain": 1800, "ideal_fert": 200, "ideal_pest": 5, "base_yield": 15000, "max_yield": 30000},
    "Mango": {"ideal_temp": 28, "ideal_rain": 1000, "ideal_fert": 100, "ideal_pest": 5, "base_yield": 3000, "max_yield": 6000},
    "Coconut": {"ideal_temp": 27, "ideal_rain": 2000, "ideal_fert": 150, "ideal_pest": 5, "base_yield": 4000, "max_yield": 8000},
}


def get_simulated_weather(location):
    conditions = ["Sunny", "Cloudy", "Rainy", "Humid"]
    condition = random.choice(conditions)
    temp = random.randint(20, 38)
    humidity = random.randint(30, 90)
    rainfall_forecast = 0
    if condition == "Rainy":
        rainfall_forecast = random.randint(10, 50)
    elif condition == "Cloudy" and random.random() > 0.5:
        rainfall_forecast = random.randint(1, 10)
    return {
        "location": location,
        "condition": condition,
        "temperature_c": temp,
        "humidity": humidity,
        "wind_speed_kmh": random.randint(5, 25),
        "rainfall_forecast_mm": rainfall_forecast,
        "alert": "Heatwave Alert" if temp > 35 else "No Alerts",
    }


def get_simulated_soil():
    return {
        "soil_type": random.choice(["Clay", "Loamy", "Black"]),
        "nitrogen": random.randint(40, 120),
        "phosphorus": random.randint(20, 60),
        "potassium": random.randint(30, 80),
        "ph": round(random.uniform(6.0, 7.5), 1),
        "moisture": random.randint(20, 80),
    }


def predict_yield(features):
    crop = features.get("crop", "Wheat")
    ideals = CROP_IDEALS.get(crop, CROP_IDEALS["Wheat"])

    try:
        actual_rain = float(features.get("rainfall_mm", ideals["ideal_rain"]))
        actual_temp = float(features.get("temperature_c", ideals["ideal_temp"]))
        actual_fert = float(features.get("fertilizer", ideals["ideal_fert"]))
        actual_pest = float(features.get("pesticide", ideals["ideal_pest"]))
    except:
        actual_rain = ideals["ideal_rain"]
        actual_temp = ideals["ideal_temp"]
        actual_fert = ideals["ideal_fert"]
        actual_pest = ideals["ideal_pest"]

    temp_diff = abs(actual_temp - ideals["ideal_temp"])
    temp_score = max(0, 1 - (temp_diff * 0.05))

    rain_diff = abs(actual_rain - ideals["ideal_rain"])
    rain_score = max(0.2, 1 - (rain_diff / 2000))

    if actual_fert < ideals["ideal_fert"]:
        fert_score = actual_fert / ideals["ideal_fert"]
    else:
        fert_score = max(0.8, 1 - ((actual_fert - ideals["ideal_fert"]) / 500))

    if actual_pest < ideals["ideal_pest"]:
        pest_score = actual_pest / ideals["ideal_pest"]
    else:
        pest_score = 1.0

    efficiency = temp_score * rain_score * ((fert_score * 0.6) + (pest_score * 0.4))

    yield_range = ideals["max_yield"] - ideals["base_yield"]
    final_yield = ideals["base_yield"] + (yield_range * efficiency)

    noise = final_yield * (np.random.uniform(-0.05, 0.05))
    final_yield += noise

    return {
        "yield_kg_acre": round(final_yield, 2),
        "efficiency_score": round(efficiency * 100, 1),
        "ideal_vals": ideals,
    }


def generate_advice(prediction_data, weather_data, user_inputs):
    yield_val = prediction_data["yield_kg_acre"]
    efficiency = prediction_data.get("efficiency_score", 0)
    ideals = prediction_data.get("ideal_vals", {})

    if efficiency > 85:
        status, emoji = "Excellent", "🌟"
    elif efficiency > 60:
        status, emoji = "Good", "✅"
    else:
        status, emoji = "Needs Improvement", "⚠️"

    advice = []
    rain_diff = user_inputs["rainfall_mm"] - ideals.get("ideal_rain", 0)
    if rain_diff < -200:
        advice.append(f"💧 **Water:** Low rainfall. Consider irrigation to reach ~{ideals['ideal_rain']}mm.")
    elif rain_diff > 300:
        advice.append("🌧 **Water:** High rainfall. Ensure good drainage.")

    fert_diff = user_inputs["fertilizer"] - ideals.get("ideal_fert", 0)
    if abs(fert_diff) > 20:
        if fert_diff < 0:
            advice.append(f"🌿 **Fertilizer:** Used {user_inputs['fertilizer']}kg. Recommended is ~{ideals['ideal_fert']}kg. Increasing it may help.")
        else:
            advice.append(f"💰 **Fertilizer:** High usage ({user_inputs['fertilizer']}kg). You can save money by reducing to ~{ideals['ideal_fert']}kg.")

    pest_diff = user_inputs["pesticide"] - ideals.get("ideal_pest", 0)
    if abs(pest_diff) > 10:
        if pest_diff < 0:
            advice.append("🐛 **Pesticide:** Usage is low. Watch out for pest outbreaks.")
        else:
            advice.append(f"⚠️ **Pesticide:** Usage is high ({user_inputs['pesticide']}kg). Ensure it's necessary.")

    tip_msg = "\n".join(advice) if advice else "Your inputs are perfectly balanced!"
    return (
        f"{emoji} **Yield Forecast:** {yield_val} kg/acre ({status})\n"
        f"📊 **Efficiency Score:** {efficiency}/100\n\n"
        f"**Smart Advice:**\n{tip_msg}"
    )


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            req = json.loads(body)

            weather = get_simulated_weather(req.get("district", "Local"))
            soil = get_simulated_soil()

            ml_input = {
                "crop": req.get("crop", "Wheat"),
                "soil_type": soil["soil_type"],
                "season": "Whole Year",
                "rainfall_mm": float(req.get("rainfall_mm", 500)),
                "temperature_c": weather["temperature_c"],
                "nitrogen": soil["nitrogen"],
                "phosphorus": soil["phosphorus"],
                "potassium": soil["potassium"],
                "ph": soil["ph"],
                "pesticide": float(req.get("pesticide_kg", 2)),
                "fertilizer": float(req.get("fertilizer_kg", 100)),
            }

            prediction = predict_yield(ml_input)
            ai_advice = generate_advice(prediction, weather, ml_input)

            response = {
                "prediction": prediction,
                "weather": weather,
                "soil": soil,
                "ai_advice": ai_advice,
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
