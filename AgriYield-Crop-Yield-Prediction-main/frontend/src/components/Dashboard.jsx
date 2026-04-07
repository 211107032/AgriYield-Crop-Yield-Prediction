import React from 'react';
import { CloudRain, Thermometer, Wind, Droplets } from 'lucide-react';

const Dashboard = ({ weather, prediction, soil }) => {
    return (
        <div className="space-y-6">
            {/* Weather Card */}
            {weather && (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-farm-green mb-3 flex items-center gap-2">
                        <CloudRain size={20} /> Real-Time Weather
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-xl">
                            <p className="text-gray-500 text-xs">Condition</p>
                            <p className="font-bold text-lg">{weather.condition}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-xl">
                            <p className="text-gray-500 text-xs">Temperature</p>
                            <p className="font-bold text-lg flex items-center gap-1">
                                <Thermometer size={16} className="text-orange-500" /> {weather.temperature_c}°C
                            </p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-xl">
                            <p className="text-gray-500 text-xs">Rain Forecast</p>
                            <p className="font-bold text-lg">{weather.rainfall_forecast_mm} mm</p>
                        </div>
                        <div className="bg-teal-50 p-3 rounded-xl">
                            <p className="text-gray-500 text-xs">Humidity</p>
                            <p className="font-bold text-lg flex items-center gap-1">
                                <Droplets size={16} className="text-teal-500" /> {weather.humidity}%
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Yield Prediction */}
            {prediction && (
                <div className="bg-farm-light p-5 rounded-2xl shadow-md border border-green-200">
                    <h3 className="text-xl font-bold text-farm-green mb-2">🌾 Crop Yield Prediction</h3>
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-sm text-gray-600">Expected Yield</p>
                            <p className="text-4xl font-extrabold text-farm-green">
                                {prediction.prediction.yield_kg_acre} <span className="text-lg font-normal">kg/acre</span>
                            </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${prediction.prediction.risk_score > 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                            }`}>
                            Risk: {prediction.prediction.risk_score}%
                        </div>
                    </div>

                    {/* AI Advice Section */}
                    <div className="bg-white/80 p-4 rounded-xl backdrop-blur-sm">
                        <h4 className="font-bold text-gray-800 mb-2">🤖 AI Expert Consulation:</h4>
                        <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                            {/* Naive markdown rendering */}
                            {prediction.ai_advice.replace(/\*\*/g, '')}
                        </div>
                    </div>
                </div>
            )}

            {!prediction && !weather && (
                <div className="text-center p-10 text-gray-400">
                    <p>Tap the mic or enter details to get started.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
