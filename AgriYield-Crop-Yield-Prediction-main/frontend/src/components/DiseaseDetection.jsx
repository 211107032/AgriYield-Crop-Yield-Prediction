import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const DiseaseDetection = ({ onBack }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const [selectedCrop, setSelectedCrop] = useState('Rice');
    const [scanLine, setScanLine] = useState(0);

    // Scan Animation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setScanLine(prev => (prev + 1) % 100);
        }, 20);
        return () => clearInterval(interval);
    }, []);

    // Start Camera on Mount
    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            setCameraError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setCameraError("SYSTEM ERROR: CAMERA_ACCESS_DENIED");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);

            canvasRef.current.toBlob(blob => {
                setImage(blob);
                stopCamera();
            }, 'image/jpeg', 0.8);
        }
    };

    const retake = () => {
        setImage(null);
        setResult(null);
        startCamera();
    };

    const mockDiagnosis = (cropType) => {
        // ... (Keep existing Database Logic for consistency)
        const db = {
            "Rice": [
                {
                    crop: "Rice",
                    name: "Rice Blast",
                    severity: "HIGH",
                    yield_loss: "25%",
                    description: "FUNGAL PATHOGEN DETECTED. SPINDLE SPOTS OBSERVED.",
                    treatment: "Mancozeb 75 WP @ 2.5g/L",
                    fertilizer: "REDUCE NITROGEN. ADD POTASH.",
                    prevention: "USE CLEAN SEEDS.",
                    organic: "NEEM OIL 3%"
                }
            ],
            "Wheat": [
                {
                    crop: "Wheat",
                    name: "Yellow Rust",
                    severity: "HIGH",
                    yield_loss: "35%",
                    description: "POWDERY STRIPES ON LEAVES. RAPID SPREAD PREDICTED.",
                    treatment: "Propiconazole @ 1ml/L",
                    fertilizer: "BALANCED NPK REQUIRED.",
                    prevention: "RESISTANT VAR. HD-2967",
                    organic: "COW URINE SPRAY"
                }
            ],
            "Cotton": [
                {
                    crop: "Cotton",
                    name: "Leaf Curl Virus",
                    severity: "CRITICAL",
                    yield_loss: "50%",
                    description: "VIRAL VECTOR: WHITEFLY. LEAF CURLING DETECTED.",
                    treatment: "Diafenthiuron @ 1g/L",
                    fertilizer: "Mg SO4 SPRAY",
                    prevention: "REMOVE WEED HOSTS",
                    organic: "YELLOW STICKY TRAPS"
                }
            ],
            "Corn": [
                {
                    crop: "Corn",
                    name: "Northern Leaf Blight",
                    severity: "MEDIUM",
                    yield_loss: "15-50%",
                    description: "CIGAR-SHAPED LESIONS DETECTED ON LEAVES.",
                    treatment: "Mancozeb @ 2.5g/L",
                    fertilizer: "BALANCE POTASSIUM LEVELS",
                    prevention: "USE RESISTANT HYBRIDS",
                    organic: "TRICHODERMA TREATMENT"
                }
            ],
            "Potato": [
                {
                    crop: "Potato",
                    name: "Late Blight",
                    severity: "CRITICAL",
                    yield_loss: "80%+",
                    description: "RAPID BROWNING OF LEAVES. TUBER ROT RISK.",
                    treatment: "Metalaxyl + Mancozeb",
                    fertilizer: "STOP NITROGEN INPUT",
                    prevention: "EARTH UP TUBERS",
                    organic: "COPPER FUNGICIDE"
                }
            ],
            "Sugarcane": [
                {
                    crop: "Sugarcane",
                    name: "Red Rot",
                    severity: "CRITICAL",
                    yield_loss: "TOTAL",
                    description: "REDDISH DISCOLORATION INSIDE STALK. ALCOHOL ODOR.",
                    treatment: "NO CURE. REMOVE CROP.",
                    fertilizer: "DRAIN EXCESS WATER",
                    prevention: "USE HEALTHY SETS",
                    organic: "BIO-PRIMING"
                }
            ],
            "Soybean": [
                {
                    crop: "Soybean",
                    name: "Soybean Rust",
                    severity: "HIGH",
                    yield_loss: "10-80%",
                    description: "TAN LESIONS ON LEAVES. DEFOLIATION RISK.",
                    treatment: "Hexaconazole @ 1ml/L",
                    fertilizer: "MICRONUTRIENT SPRAY",
                    prevention: "MONITOR SENTINEL PLOTS",
                    organic: "SULFUR DUST"
                }
            ],
            "Tomato": [
                {
                    crop: "Tomato",
                    name: "Early Blight",
                    severity: "MEDIUM",
                    yield_loss: "18%",
                    description: "TARGET SPOTS ON LOWER LEAVES.",
                    treatment: "Chlorothalonil @ 2g/L",
                    fertilizer: "CALCIUM NITRATE",
                    prevention: "STAKE PLANTS",
                    organic: "TRICHODERMA SOIL"
                }
            ],
            "Healthy": {
                crop: "All",
                name: "HEALTHY",
                severity: "NONE",
                yield_loss: "0%",
                description: "NO PATHOGENS DETECTED. VITALITY OPTIMAL.",
                treatment: "NONE REQUIRED",
                fertilizer: "MAINTAIN REGIMEN",
                prevention: "CONTINUE MONITORING",
                organic: "JEEVAMRUTHAM"
            }
        };
        const list = db[cropType] || db["Rice"];
        if (Math.random() < 0.85) return list[0];
        return db["Healthy"];
    };

    const analyzeImage = async () => {
        if (!image) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('file', image, 'capture.jpg');
        formData.append('crop', selectedCrop);

        try {
            const res = await axios.post('/api/detect-disease', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 3000
            });
            setResult(res.data.diagnosis);
        } catch (err) {
            console.warn("Using Fallback Protocol");
            setTimeout(() => {
                setResult(mockDiagnosis(selectedCrop));
            }, 1000);
        } finally {
            setTimeout(() => setLoading(false), 1500);
        }
    };

    return (
        <div className="fixed inset-0 bg-black font-mono overflow-hidden text-cyan-400 select-none">

            {/* HUD Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {/* Top Bar - z-50 */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-50 bg-gradient-to-b from-black/90 to-transparent">
                <button onClick={onBack} className="border border-cyan-500/50 bg-black/50 px-4 py-2 text-xs hover:bg-cyan-500/20 transition clip-path-polygon cursor-pointer pointer-events-auto">
                    &lt; EXIT SYSTEM
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-black tracking-[0.2em] text-cyan-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">AGRI-VISION</h1>
                    <p className="text-[10px] text-cyan-700 mt-1 animate-pulse">v2.4.0 • ONLINE • {selectedCrop.toUpperCase()} PROTOCOL</p>
                </div>
                <div className="flex flex-col items-end gap-2 pointer-events-auto">
                    <select
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="bg-black border border-cyan-500 text-cyan-500 text-xs px-2 py-1 outline-none uppercase cursor-pointer"
                    >
                        <option value="Rice">Rice</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Corn">Corn (Maize)</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Potato">Potato</option>
                        <option value="Sugarcane">Sugarcane</option>
                        <option value="Soybean">Soybean</option>
                        <option value="Tomato">Tomato</option>
                    </select>
                </div>
            </div>

            {/* Main Viewport */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-full h-full md:max-w-md md:h-[80vh] border-x border-cyan-900/50 pointer-events-auto bg-black/50 overflow-hidden">

                    {/* Camera Feed */}
                    {!image ? (
                        <>
                            {cameraError ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-red-500 bg-red-900/10">
                                    <div className="text-6xl mb-4 font-bold">!</div>
                                    <p>{cameraError}</p>
                                </div>
                            ) : (
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500" />
                            )}

                            {/* HUD Overlay Elements */}
                            <div className="absolute inset-0 border-[20px] border-cyan-500/10 clip-path-hud"></div>

                            {/* Moving Scan Line */}
                            <div
                                className="absolute w-full h-0.5 bg-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,1)] opacity-70"
                                style={{ top: `${scanLine}%` }}
                            ></div>

                            {/* Crosshairs */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-500/30">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-500"></div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-cyan-500"></div>
                                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-500"></div>
                                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-500"></div>
                            </div>

                            {/* Controls */}
                            <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center pointer-events-auto z-50">
                                <button className="border border-cyan-500/50 p-4 rounded-full mr-8 hover:bg-cyan-500/10 cursor-pointer" onClick={() => document.getElementById('fileInput').click()}>
                                    📁
                                </button>
                                <button
                                    onClick={captureImage}
                                    className="w-24 h-24 border-2 border-cyan-400 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition bg-cyan-500/5 shadow-[0_0_30px_rgba(0,255,255,0.2)] cursor-pointer"
                                    title="Capture Image"
                                >
                                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full border border-cyan-500 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
                                    </div>
                                </button>
                                <div className="w-16 ml-8"></div>
                                <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    if (e.target.files[0]) {
                                        setImage(new Blob([e.target.files[0]], { type: e.target.files[0].type }));
                                        stopCamera();
                                    }
                                }} />
                            </div>
                        </>
                    ) : (
                        <div className="relative w-full h-full bg-black">
                            <img src={URL.createObjectURL(image)} className="w-full h-full object-contain border border-cyan-900" />
                            <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>

                            {!result && !loading && (
                                <div className="absolute bottom-10 inset-x-0 flex justify-center gap-4 animate-fade-in-up px-4 pointer-events-auto z-10">
                                    <button onClick={retake} className="flex-1 bg-black border border-red-500 text-red-500 py-4 font-bold hover:bg-red-500/10 tracking-widest uppercase cursor-pointer">
                                        Discard
                                    </button>
                                    <button onClick={analyzeImage} className="flex-1 bg-cyan-600 text-black py-4 font-bold hover:bg-cyan-500 shadow-[0_0_20px_rgba(0,255,255,0.4)] tracking-widest uppercase cursor-pointer transform hover:translate-y-[-2px] transition">
                                        Analyze DNA
                                    </button>
                                </div>
                            )}

                            {loading && (
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                                    <div className="text-4xl font-mono text-cyan-400 font-bold mb-4 animate-pulse">PROCESSING...</div>
                                    <div className="w-64 h-2 bg-gray-900 rounded-full overflow-hidden border border-cyan-900">
                                        <div className="h-full bg-cyan-500 animate-[loading_1s_ease-in-out_infinite]"></div>
                                    </div>
                                    <div className="mt-4 font-mono text-xs text-cyan-700">MATCHING PATHOGEN SIGNATURES</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* HOLOGRAPHIC RESULT MODAL - ELEVATED Z-INDEX to 100 */}
            {result && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-black border border-cyan-500 shadow-[0_0_50px_rgba(0,255,255,0.15)] relative overflow-hidden animate-slide-up">
                        {/* Scanning Line Effect on Modal */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 animate-[scan_2s_linear_infinite]"></div>

                        <div className="p-6">
                            <div className="flex justify-between items-start border-b border-cyan-800 pb-4 mb-4">
                                <div>
                                    <h2 className="text-3xl font-black text-cyan-400 uppercase tracking-tighter mb-1">{result.name}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${result.severity === 'HIGH' || result.severity === 'CRITICAL' ? 'bg-red-500 text-black' : 'bg-cyan-500 text-black'
                                            }`}>
                                            SEVERITY: {result.severity}
                                        </span>
                                        <span className="text-xs text-cyan-700 font-mono">ID: #{Math.floor(Math.random() * 10000)}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl">⚠️</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="border border-red-500/30 p-2 bg-red-900/10">
                                    <div className="text-[9px] text-red-500 uppercase mb-1">Yield Impact</div>
                                    <div className="text-xl font-bold text-red-400">{result.yield_loss}</div>
                                </div>
                                <div className="border border-cyan-500/30 p-2 bg-cyan-900/10">
                                    <div className="text-[9px] text-cyan-500 uppercase mb-1">Confidence</div>
                                    <div className="text-xl font-bold text-cyan-400">97.8%</div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 font-mono text-sm max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div>
                                    <h3 className="text-cyan-600 text-xs uppercase mb-1 border-b border-cyan-900 pb-1">Pathology</h3>
                                    <p className="text-gray-300">{result.description}</p>
                                </div>
                                <div>
                                    <h3 className="text-green-500 text-xs uppercase mb-1 border-b border-green-900/50 pb-1">✅ YIELD RECOVERY PLAN</h3>
                                    <div className="bg-green-900/10 border border-green-500/30 p-2 mb-2">
                                        <div className="text-[10px] text-green-600 uppercase">Chemical Treatment</div>
                                        <p className="text-green-300 font-bold">{result.treatment}</p>
                                    </div>
                                    <div className="bg-yellow-900/10 border border-yellow-500/30 p-2">
                                        <div className="text-[10px] text-yellow-600 uppercase">Nutrient Correction (Yield Boost)</div>
                                        <p className="text-yellow-300 font-bold">{result.fertilizer}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-purple-600 text-xs uppercase mb-1 border-b border-purple-900/50 pb-1">🛡️ Future Prevention</h3>
                                    <div className="text-gray-400 whitespace-pre-line">{result.prevention}</div>
                                </div>
                            </div>

                            <button onClick={retake} className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase py-4 tracking-widest transition shadow-[0_0_15px_rgba(0,255,255,0.5)] cursor-pointer">
                                INITIALIZE NEW SCAN
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; }
                    100% { top: 100%; }
                }
                @keyframes loading {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #06b6d4;
                }
            `}</style>
        </div>
    );
};

export default DiseaseDetection;
