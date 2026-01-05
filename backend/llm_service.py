class FarmerLLM:
    """
    A simulated LLM that acts as an intelligent farming assistant.
    It takes structured data and natural language inputs and generates
    simple, farmer-friendly responses.
    """
    
    @staticmethod
    def generate_yield_explanation(prediction_data, weather_data, user_inputs):
        """
        Explains the prediction in simple terms, comparing actuals vs ideals.
        """
        yield_val = prediction_data['yield_kg_acre']
        efficiency = prediction_data.get('efficiency_score', 0)
        ideals = prediction_data.get('ideal_vals', {})
        
        # Determine Status
        if efficiency > 85:
            status = "Excellent"
            emoji = "🌟"
        elif efficiency > 60:
            status = "Good"
            emoji = "✅"
        else:
            status = "Needs Improvement"
            emoji = "⚠️"
            
        # Analysis of inputs
        advice = []
        
        # Rain/Water
        rain_diff = user_inputs['rainfall_mm'] - ideals.get('ideal_rain', 0)
        if rain_diff < -200:
            advice.append(f"💧 **Water:** Low rainfall. Consider irrigation to reach ~{ideals['ideal_rain']}mm.")
        elif rain_diff > 300:
             advice.append(f"🌧 **Water:** High rainfall. Ensure good drainage.")
             
        # Fertilizer
        fert_diff = user_inputs['fertilizer'] - ideals.get('ideal_fert', 0)
        if abs(fert_diff) > 20:
            if fert_diff < 0:
                advice.append(f"🌿 **Fertilizer:** Used {user_inputs['fertilizer']}kg. Recommended is ~{ideals['ideal_fert']}kg. Increasing it may help.")
            else:
                advice.append(f"💰 **Fertilizer:** High usage ({user_inputs['fertilizer']}kg). You can save money by reducing to ~{ideals['ideal_fert']}kg.")

        # Pesticide
        pest_diff = user_inputs['pesticide'] - ideals.get('ideal_pest', 0)
        if abs(pest_diff) > 10:
             if pest_diff < 0:
                advice.append(f"🐛 **Pesticide:** Usage is low. Watch out for pest outbreaks.")
             else:
                advice.append(f"⚠️ **Pesticide:** Usage is high ({user_inputs['pesticide']}kg). Ensure it's necessary to avoid toxicity.")

        # Construct Message
        tip_msg = "\n".join(advice) if advice else "Your inputs are perfectly balanced!"
        
        return (
            f"{emoji} **Yield Forecast:** {yield_val} kg/acre ({status})\n"
            f"📊 **Efficiency Score:** {efficiency}/100\n\n"
            f"**Smart Advice:**\n{tip_msg}"
        )

    @staticmethod
    def chat_response(user_text: str):
        """
        Simulates answers to common farmer questions.
        """
        user_text = user_text.lower()
        
        if "rain" in user_text or "weather" in user_text:
            return "🌧 It looks like there might be some rain soon. Make sure your drainage is clear so water doesn't stagnate."
        elif "fertilizer" in user_text or "urea" in user_text:
            return "🌿 For Urea, apply it in split doses. Don't put it all at once! Use 50% now and 50% later."
        elif "pest" in user_text or "worm" in user_text:
            return "🐛 If you see pests, try using Neem oil first. It's safe and effective. If it's severe, consult a local store."
        else:
             return "👨‍🌾 I am your AI Farming Assistant. You can ask me about weather, fertilizer, or crop health!"

farmer_bot = FarmerLLM()
