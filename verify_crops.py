import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath("backend"))

try:
    from ml_engine import crop_predictor
except ImportError as e:
    with open("verify_result_crops.txt", "w") as f:
        f.write(f"Import Error: {e}")
    sys.exit(1)

# TEST CASES
test_cases = [
    {
        "crop": "Wheat",
        "inputs": { "crop": "Wheat", "temperature_c": 20, "rainfall_mm": 500, "fertilizer": 100, "pesticide": 2 },
        "target_min": 3900, "target_max": 4250, # Aiming for ~40-42Q
    },
    {
        "crop": "Maize",
        "inputs": { "crop": "Maize", "temperature_c": 25, "rainfall_mm": 800, "fertilizer": 150, "pesticide": 2 },
        "target_min": 3300, "target_max": 3600, # Aiming for ~35Q
    }
]

output = []

try:
    for case in test_cases:
        result = crop_predictor.predict(case["inputs"])
        yield_val = result['yield_kg_acre']
        
        status = "✅ PASSED" if case["target_min"] <= yield_val <= case["target_max"] else f"❌ FAILED (Expected {case['target_min']}-{case['target_max']})"
        
        output.append(f"Crop: {case['crop']}")
        output.append(f"  Inputs: {case['inputs']}")
        output.append(f"  Yield: {yield_val} kg/acre ({yield_val/100:.2f} Quintals)")
        output.append(f"  Status: {status}")
        output.append("-" * 30)

    with open("verify_result_crops.txt", "w") as f:
        f.write("\n".join(output))

except Exception as e:
    with open("verify_result_crops.txt", "w") as f:
        f.write(f"Execution Error: {e}")
