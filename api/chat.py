from http.server import BaseHTTPRequestHandler
import json


def chat_response(user_text):
    user_text = user_text.lower()
    if "rain" in user_text or "weather" in user_text:
        return "🌧 It looks like there might be some rain soon. Make sure your drainage is clear so water doesn't stagnate."
    elif "fertilizer" in user_text or "urea" in user_text:
        return "🌿 For Urea, apply it in split doses. Don't put it all at once! Use 50% now and 50% later."
    elif "pest" in user_text or "worm" in user_text:
        return "🐛 If you see pests, try using Neem oil first. It's safe and effective. If it's severe, consult a local store."
    else:
        return "👨‍🌾 I am your AI Farming Assistant. You can ask me about weather, fertilizer, or crop health!"


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
            message = req.get("message", "")
            reply = chat_response(message)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"reply": reply}).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
