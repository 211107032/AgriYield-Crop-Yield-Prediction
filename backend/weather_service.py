import random

class WeatherService:
    @staticmethod
    def get_current_weather(location: str = "Local"):
        """
        Simulates fetching real-time weather data.
        In a real app, this would call OpenWeatherMap API.
        """
        # Randomly simulate different conditions for demo variety
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
            "alert": "Heatwave Alert" if temp > 35 else "No Alerts"
        }

class SoilService:
    @staticmethod
    def get_soil_data(location_coords: tuple = None):
        """
        Simulates fetching soil health data.
        """
        return {
            "soil_type": random.choice(["Clay", "Loamy", "Black"]),
            "nitrogen": random.randint(40, 120),
            "phosphorus": random.randint(20, 60),
            "potassium": random.randint(30, 80),
            "ph": round(random.uniform(6.0, 7.5), 1),
            "moisture": random.randint(20, 80)
        }
