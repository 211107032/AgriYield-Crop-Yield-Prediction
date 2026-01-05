import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath("backend"))

from ml_engine import crop_predictor

# User specific inputs
inputs = {
    "crop": "Rice",
    "temperature_c": 28,  # Ideal
    "rainfall_mm": 1100,  # Close to ideal (1200)
    "fertilizer": 120,    # Ideal
    "pesticide": 3        # New Ideal
}

print(f"Testing with inputs: {inputs}")

result = crop_predictor.predict(inputs)

print("\n--- Result ---")
print(f"Yield (kg/acre): {result['yield_kg_acre']}")
print(f"Efficiency Score: {result['efficiency_score']}%")
print(f"Ideal Values Used: {result['ideal_vals']}")

expected_yield = 3800 # Approx target
lower_bound = expected_yield * 0.9
upper_bound = 4000 # Max

if lower_bound <= result['yield_kg_acre'] <= upper_bound:
    print("\n✅ Verification PASSED: Yield is within expected range.")
else:
    print(f"\n❌ Verification FAILED: Yield {result['yield_kg_acre']} is out of range ({lower_bound} - {upper_bound})")
