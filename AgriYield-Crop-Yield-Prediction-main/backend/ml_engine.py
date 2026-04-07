import numpy as np

# Scientific Crop Data (Ideal Conditions)
# This replaces random generation with agronomic logic
CROP_IDEALS = {
    "Rice": { "ideal_temp": 28, "ideal_rain": 1200, "ideal_fert": 120, "ideal_pest": 3, "base_yield": 2000, "max_yield": 3900 },
    "Wheat": { "ideal_temp": 20, "ideal_rain": 500, "ideal_fert": 100, "ideal_pest": 2, "base_yield": 3000, "max_yield": 4200 },
    "Maize": { "ideal_temp": 25, "ideal_rain": 800, "ideal_fert": 150, "ideal_pest": 2, "base_yield": 2000, "max_yield": 3500 },
    "Cotton": { "ideal_temp": 30, "ideal_rain": 700, "ideal_fert": 180, "ideal_pest": 3, "base_yield": 800, "max_yield": 1500 },
    "Sugarcane": { "ideal_temp": 28, "ideal_rain": 1500, "ideal_fert": 250, "ideal_pest": 5, "base_yield": 40000, "max_yield": 60000 },
    
    # Pulses
    "Arhar (Tur)": { "ideal_temp": 30, "ideal_rain": 600, "ideal_fert": 40, "ideal_pest": 1, "base_yield": 400, "max_yield": 800 },
    "Gram (Chana)": { "ideal_temp": 20, "ideal_rain": 400, "ideal_fert": 30, "ideal_pest": 1, "base_yield": 500, "max_yield": 1000 },
    "Urad": { "ideal_temp": 28, "ideal_rain": 500, "ideal_fert": 25, "ideal_pest": 1, "base_yield": 300, "max_yield": 600 },
    "Moong": { "ideal_temp": 30, "ideal_rain": 500, "ideal_fert": 25, "ideal_pest": 1, "base_yield": 300, "max_yield": 600 },
    
    # Oilseeds
    "Groundnut": { "ideal_temp": 28, "ideal_rain": 600, "ideal_fert": 60, "ideal_pest": 2, "base_yield": 800, "max_yield": 1500 },
    "Soybean": { "ideal_temp": 28, "ideal_rain": 700, "ideal_fert": 50, "ideal_pest": 2, "base_yield": 800, "max_yield": 1200 },
    "Mustard": { "ideal_temp": 20, "ideal_rain": 300, "ideal_fert": 60, "ideal_pest": 2, "base_yield": 600, "max_yield": 1000 },
    "Sunflower": { "ideal_temp": 25, "ideal_rain": 500, "ideal_fert": 60, "ideal_pest": 2, "base_yield": 600, "max_yield": 1200 },
    
    # Millets
    "Jowar": { "ideal_temp": 30, "ideal_rain": 500, "ideal_fert": 50, "ideal_pest": 2, "base_yield": 800, "max_yield": 1500 },
    "Bajra": { "ideal_temp": 32, "ideal_rain": 400, "ideal_fert": 40, "ideal_pest": 2, "base_yield": 700, "max_yield": 1500 },
    
    # Vegetables
    "Potato": { "ideal_temp": 18, "ideal_rain": 400, "ideal_fert": 120, "ideal_pest": 4, "base_yield": 8000, "max_yield": 12000 },
    "Onion": { "ideal_temp": 25, "ideal_rain": 500, "ideal_fert": 80, "ideal_pest": 4, "base_yield": 6000, "max_yield": 10000 },
    "Tomato": { "ideal_temp": 25, "ideal_rain": 600, "ideal_fert": 100, "ideal_pest": 4, "base_yield": 10000, "max_yield": 25000 },
    "Brinjal": { "ideal_temp": 28, "ideal_rain": 700, "ideal_fert": 90, "ideal_pest": 4, "base_yield": 8000, "max_yield": 15000 },
    
    # Fruits/Plantation
    "Banana": { "ideal_temp": 27, "ideal_rain": 1800, "ideal_fert": 200, "ideal_pest": 5, "base_yield": 15000, "max_yield": 30000 },
    "Mango": { "ideal_temp": 28, "ideal_rain": 1000, "ideal_fert": 100, "ideal_pest": 5, "base_yield": 3000, "max_yield": 6000 },
    "Coconut": { "ideal_temp": 27, "ideal_rain": 2000, "ideal_fert": 150, "ideal_pest": 5, "base_yield": 4000, "max_yield": 8000 }
}

class CropYieldPredictor:
    def __init__(self):
        self.model = None # Using logic-based approach for transparency
        
    def train(self):
        print("Using Logic-Based Agronomic Model (No training needed for V2).")

    def predict(self, features):
        """
        Calculate yield based on deviation from ideal conditions.
        """
        crop = features.get('crop', 'Wheat')
        
        # Get Crop Standards (Default to Wheat if unknown)
        ideals = CROP_IDEALS.get(crop, CROP_IDEALS['Wheat'])
        
        # 1. Access Inputs
        try:
            actual_rain = float(features.get('rainfall_mm', ideals['ideal_rain']))
            actual_temp = float(features.get('temperature_c', ideals['ideal_temp']))
            actual_fert = float(features.get('fertilizer', ideals['ideal_fert'])) 
            actual_pest = float(features.get('pesticide', ideals['ideal_pest'])) 
        except:
            # Fallback for bad data
            actual_rain = ideals['ideal_rain']
            actual_temp = ideals['ideal_temp']
            actual_fert = ideals['ideal_fert']
            actual_pest = ideals['ideal_pest']

        # 2. Calculate Deviation Factors (0.0 to 1.0)
        # Using a Gaussian-like decay: Score = 1 / (1 + error_rate)
        
        # Temp: High sensitivity (crops die in extreme heat/cold)
        temp_diff = abs(actual_temp - ideals['ideal_temp'])
        temp_score = max(0, 1 - (temp_diff * 0.05)) # Lose 5% yield per degree diff
        
        # Rain: Moderate sensitivity
        rain_diff = abs(actual_rain - ideals['ideal_rain'])
        rain_score = max(0.2, 1 - (rain_diff / 2000)) # Can't go below 20%
        
        # Fertilizer: Diminishing returns (Too little is bad, too much is wasteful but okayish up to a point)
        if actual_fert < ideals['ideal_fert']:
            fert_score = actual_fert / ideals['ideal_fert'] # Linear drop if low
        else:
            fert_score = max(0.8, 1 - ((actual_fert - ideals['ideal_fert']) / 500)) # Slight penalty for overuse
            
        # Pesticide: Similar to fertilizer
        if actual_pest < ideals['ideal_pest']:
             pest_score = actual_pest / ideals['ideal_pest']
        else:
             pest_score = 1.0 # Extra pesticide doesn't typically reduce yield unless toxic levels
        
        # 3. Combine Scores
        # Total Efficiency = Temp * Rain * (Fert + Pest)/2
        efficiency = temp_score * rain_score * ((fert_score * 0.6) + (pest_score * 0.4))
        
        # 4. Final Yield
        # Yield ranges between base and max based on efficiency + random natural variation (5%)
        yield_range = ideals['max_yield'] - ideals['base_yield']
        final_yield = ideals['base_yield'] + (yield_range * efficiency)
        
        # Add slight randomization for realism
        noise = final_yield * (np.random.uniform(-0.05, 0.05))
        final_yield += noise
        
        return {
            "yield_kg_acre": round(final_yield, 2),
            "efficiency_score": round(efficiency * 100, 1),
            "ideal_vals": ideals
        }

crop_predictor = CropYieldPredictor()
