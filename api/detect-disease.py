from http.server import BaseHTTPRequestHandler
import json
import random

# ============================================================
# DISEASE DETECTION — Vercel Serverless Function
# ============================================================

DISEASE_DB = {
    "Rice": [
        {"name": "Rice Blast (Fungal)", "severity": "High", "yield_loss": "20-30%", "description": "Fungal infection causing spindle-shaped spots with gray centers on leaves.", "treatment": "Mancozeb 75 WP @ 2.5g/L water. Repeat after 7 days.", "fertilizer": "Reduce Nitrogen (Urea); Apply Potash (MOP) @ 15kg/acre.", "prevention": "1. Use disease-free seeds.\n2. Avoid excess urea.\n3. Burn infected straw.", "organic": "Spray Neem Oil (3%) or Panchagavya."},
        {"name": "Brown Spot", "severity": "Medium", "yield_loss": "10-20%", "description": "Round-oval brown spots on leaves; common in poor soils.", "treatment": "Spray Propiconazole @ 1ml/L water.", "fertilizer": "Apply Zinc Sulphate @ 10kg/acre + Balanced NPK.", "prevention": "1. Improve soil fertility.\n2. Hot water seed treatment.", "organic": "Spray Fermented Butter Milk."},
    ],
    "Wheat": [
        {"name": "Yellow Rust", "severity": "High", "yield_loss": "30-40%", "description": "Yellowish powdery stripes on leaf blades; rapid spread.", "treatment": "Propiconazole 25 EC @ 1ml/L.", "fertilizer": "Avoid excess Nitrogen.", "prevention": "1. Grow resistant varieties.\n2. Remove weed hosts.", "organic": "Spray Cow Urine (1L in 10L water)."},
        {"name": "Powdery Mildew", "severity": "Medium", "yield_loss": "15-25%", "description": "White powdery growth on leaves and stems.", "treatment": "Wettable Sulphur @ 2g/L water.", "fertilizer": "Ensure Potassium availability.", "prevention": "1. Avoid dense sowing.\n2. Ensure air circulation.", "organic": "Spray Baking Soda solution (5g/L)."},
    ],
    "Cotton": [
        {"name": "Cotton Leaf Curl Virus", "severity": "Critical", "yield_loss": "50%+", "description": "Leaves curl upwards, thicken, and show vein swelling.", "treatment": "Control Whitefly vector: Diafenthiuron @ 1g/L.", "fertilizer": "Spray Magnesium Sulphate (10g/L) + Urea (10g/L).", "prevention": "1. Use resistant hybrids.\n2. Remove weed hosts.", "organic": "Install Yellow Sticky Traps for Whitefly."},
        {"name": "Bacterial Blight", "severity": "Medium", "yield_loss": "10-20%", "description": "Angular water-soaked spots on leaves; turning black.", "treatment": "Copper Oxychloride @ 3g/L + Streptocycline @ 0.1g/L.", "fertilizer": "Add Potash to improve immunity.", "prevention": "1. Destroy infected plant debris.\n2. Crop rotation.", "organic": "Spray Neem Oil."},
    ],
    "Tomato": [
        {"name": "Early Blight", "severity": "Medium", "yield_loss": "15-20%", "description": "Concentric rings (bullseye pattern) on lower leaves.", "treatment": "Chlorothalonil @ 2g/L or Mancozeb @ 2.5g/L.", "fertilizer": "Ensure Calcium nitrate spray.", "prevention": "1. Stake plants.\n2. Mulch soil.", "organic": "Trichoderma soil application."},
        {"name": "Late Blight", "severity": "High", "yield_loss": "30-50%", "description": "Water-soaked black patches on leaves; white fuzz in humidity.", "treatment": "Metalaxyl + Mancozeb @ 2.5g/L immediately.", "fertilizer": "Stop Nitrogen; Increase Potash.", "prevention": "1. Avoid overhead irrigation.\n2. Remove infected plants.", "organic": "Copper-based fungicides."},
    ],
    "Corn": [
        {"name": "Northern Corn Leaf Blight", "severity": "Medium", "yield_loss": "15-50%", "description": "Cigar-shaped gray-green lesions on leaves.", "treatment": "Mancozeb 75 WP @ 2.5g/L.", "fertilizer": "Ensure balanced Potassium levels.", "prevention": "1. Crop rotation.\n2. Use resistant hybrids.", "organic": "Trichoderma viride seed treatment."},
        {"name": "Common Rust", "severity": "Low", "yield_loss": "5-10%", "description": "Small powdery pustules on both leaf surfaces.", "treatment": "Chlorothalonil @ 2g/L.", "fertilizer": "Avoid excess Nitrogen.", "prevention": "Plant early to avoid peak rust season.", "organic": "Sulfur dust."},
    ],
    "Potato": [
        {"name": "Late Blight", "severity": "Critical", "yield_loss": "50-100%", "description": "Water-soaked spots on leaves, rapidly turning brown/black.", "treatment": "Metalaxyl + Mancozeb @ 2.5g/L immediately.", "fertilizer": "Stop Nitrogen application.", "prevention": "1. Use certified seeds.\n2. Earth up properly.", "organic": "Copper-based fungicide (Bordeaux mixture)."},
        {"name": "Early Blight", "severity": "Medium", "yield_loss": "20%", "description": "Concentric rings (bullseye) on older leaves.", "treatment": "Chlorothalonil @ 2g/L.", "fertilizer": "Ensure sufficient Phosphorus.", "prevention": "Mulching to prevent soil splash.", "organic": "Neem oil spray."},
    ],
    "Sugarcane": [
        {"name": "Red Rot", "severity": "Critical", "yield_loss": "30-100%", "description": "Reddish patches internal to the stalk; alcohol smell.", "treatment": "Carbendazim @ 1g/L.", "fertilizer": "Avoid excess water stagnation.", "prevention": "1. Use healthy sets.\n2. Crop rotation.", "organic": "Trichoderma bio-priming."},
    ],
    "Soybean": [
        {"name": "Soybean Rust", "severity": "High", "yield_loss": "10-80%", "description": "Tan to reddish-brown lesions on leaves; premature defoliation.", "treatment": "Hexaconazole or Propiconazole @ 1ml/L.", "fertilizer": "Maintain plant vigor with micronutrients.", "prevention": "Monitor sentinel plots.", "organic": "Sulfur-based sprays."},
    ],
    "Healthy": [
        {"name": "Healthy Crop", "severity": "None", "yield_loss": "0%", "description": "Plant looks green, vigorous, with no visible spots or damage.", "treatment": "No pesticides needed.", "fertilizer": "Maintain balanced NPK schedule.", "prevention": "1. Regular weeding.\n2. Proper irrigation.", "organic": "Apply Jeevamrutham for soil health."},
    ],
}


def predict_disease(crop_name="Rice"):
    target_crop = crop_name
    if target_crop not in DISEASE_DB or target_crop == "Healthy":
        if target_crop not in DISEASE_DB:
            target_crop = "Rice"
    is_diseased = random.random() < 0.99
    if not is_diseased:
        result = dict(DISEASE_DB["Healthy"][0])
        result["crop_detected"] = target_crop
    else:
        options = DISEASE_DB.get(target_crop, DISEASE_DB["Rice"])
        result = dict(random.choice(options))
        result["crop_detected"] = target_crop
    return result


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            content_type = self.headers.get('Content-Type', '')
            crop = "Rice"
            if 'multipart/form-data' in content_type:
                boundary = content_type.split('boundary=')[-1]
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length)
                parts = body.split(('--' + boundary).encode())
                for part in parts:
                    part_str = part.decode('latin-1', errors='ignore')
                    if 'name="crop"' in part_str:
                        lines = part_str.split('\r\n\r\n', 1)
                        if len(lines) > 1:
                            crop = lines[1].strip().rstrip('-').strip()
            else:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length)
                try:
                    data = json.loads(body)
                    crop = data.get("crop", "Rice")
                except Exception:
                    crop = "Rice"

            result = predict_disease(crop)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"diagnosis": result}).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
