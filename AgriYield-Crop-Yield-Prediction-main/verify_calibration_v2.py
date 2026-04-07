import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath("backend"))

try:
    from ml_engine import crop_predictor
except ImportError as e:
    with open("verify_result.txt", "w") as f:
        f.write(f"Import Error: {e}")
    sys.exit(1)

# User specific inputs
inputs = {
    "crop": "Rice",
    "temperature_c": 28,  # Ideal
    "rainfall_mm": 1100,  # Close to ideal (1200)
    "fertilizer": 120,    # Ideal
    "pesticide": 3        # New Ideal
}

try:
    result = crop_predictor.predict(inputs)
    
    output = []
    output.append(f"Testing with inputs: {inputs}")
    output.append("--- Result ---")
    output.append(f"Yield (kg/acre): {result['yield_kg_acre']}")
    output.append(f"Efficiency Score: {result['efficiency_score']}%")
    output.append(f"Ideal Values Used: {result['ideal_vals']}")

    expected_yield = 3800 # Approx target
    lower_bound = expected_yield * 0.9
    upper_bound = 4000 # Max

    if lower_bound <= result['yield_kg_acre'] <= upper_bound:
        output.append("✅ Verification PASSED: Yield is within expected range.")
    else:
        output.append(f"❌ Verification FAILED: Yield {result['yield_kg_acre']} is out of range ({lower_bound} - {upper_bound})")

    with open("verify_result.txt", "w") as f:
        f.write("\n".join(output))

except Exception as e:
    with open("verify_result.txt", "w") as f:
        f.write(f"Execution Error: {e}")
