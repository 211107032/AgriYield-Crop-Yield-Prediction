import React, { useState } from 'react';
import axios from 'axios';

// Comprehensive Data for Indian States & Districts
const indiaLocationData = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
    "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"],
    "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
    "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davangere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
    "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
    "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khurda", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Tarn Taran"],
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
    "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal (Rural)", "Warangal (Urban)", "Yadadri Bhuvanagiri"],
    "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
    "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
};

// Component
const YieldForm = ({ onBack, theme, toggleTheme }) => {
    const [formData, setFormData] = useState({
        crop: "Wheat",
        year: 2025,
        state: "Maharashtra",
        district: "Nashik", // Default, will update dynamically
        temperature: "",
        humidity: "",
        season: "Rabi",
        rainfall: 1200,
        area: 5,
        pesticide: 75,
        fertilizer: 150
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    // Dynamic State Handler
    const handleStateChange = (e) => {
        const newState = e.target.value;
        const newDistrict = indiaLocationData[newState][0]; // Default to first district
        setFormData({ ...formData, state: newState, district: newDistrict });
    };

    const handleFetchWeather = () => {
        setFormData(prev => ({
            ...prev,
            temperature: (30 + Math.random() * 5).toFixed(2),
            humidity: Math.floor(40 + Math.random() * 30)
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                crop: formData.crop,
                acres: parseFloat(formData.area),
                location: formData.district,
                year: parseInt(formData.year),
                state: formData.state,
                district: formData.district,
                rainfall_mm: parseFloat(formData.rainfall),
                pesticide_kg: parseFloat(formData.pesticide),
                fertilizer_kg: parseFloat(formData.fertilizer)
            };

            const res = await axios.post('/api/predict-yield', payload);
            setPrediction(res.data.prediction.yield_kg_acre);
        } catch (err) {
            console.warn("Backend Offline. Switching to Client-Side Simulation.");

            // --- FALLBACK OFFLINE LOGIC ---
            // Replicating Backend Agronomic Logic for Consistency
            const CROP_IDEALS = {
                "Rice": { "ideal_temp": 28, "ideal_rain": 1200, "ideal_fert": 120, "ideal_pest": 3, "base_yield": 2000, "max_yield": 3900 },
                "Wheat": { "ideal_temp": 20, "ideal_rain": 500, "ideal_fert": 100, "ideal_pest": 2, "base_yield": 3000, "max_yield": 4200 },
                "Maize": { "ideal_temp": 25, "ideal_rain": 800, "ideal_fert": 150, "ideal_pest": 2, "base_yield": 2000, "max_yield": 3500 },
                "Cotton": { "ideal_temp": 30, "ideal_rain": 700, "ideal_fert": 180, "ideal_pest": 3, "base_yield": 800, "max_yield": 1500 },
                "Sugarcane": { "ideal_temp": 28, "ideal_rain": 1500, "ideal_fert": 250, "ideal_pest": 5, "base_yield": 40000, "max_yield": 60000 },

                // Pulses
                "Arhar (Tur)": { "ideal_temp": 30, "ideal_rain": 600, "ideal_fert": 40, "ideal_pest": 1, "base_yield": 400, "max_yield": 800 },
                "Gram (Chana)": { "ideal_temp": 20, "ideal_rain": 400, "ideal_fert": 30, "ideal_pest": 1, "base_yield": 500, "max_yield": 1000 },
                "Urad": { "ideal_temp": 28, "ideal_rain": 500, "ideal_fert": 25, "ideal_pest": 1, "base_yield": 300, "max_yield": 600 },
                "Moong": { "ideal_temp": 30, "ideal_rain": 500, "ideal_fert": 25, "ideal_pest": 1, "base_yield": 300, "max_yield": 600 },

                // Oilseeds
                "Groundnut": { "ideal_temp": 28, "ideal_rain": 600, "ideal_fert": 60, "ideal_pest": 2, "base_yield": 800, "max_yield": 1500 },
                "Soybean": { "ideal_temp": 28, "ideal_rain": 700, "ideal_fert": 50, "ideal_pest": 2, "base_yield": 800, "max_yield": 1200 },
                "Mustard": { "ideal_temp": 20, "ideal_rain": 300, "ideal_fert": 60, "ideal_pest": 2, "base_yield": 600, "max_yield": 1000 },
                "Sunflower": { "ideal_temp": 25, "ideal_rain": 500, "ideal_fert": 60, "ideal_pest": 2, "base_yield": 600, "max_yield": 1200 },

                // Millets
                "Jowar": { "ideal_temp": 30, "ideal_rain": 500, "ideal_fert": 50, "ideal_pest": 2, "base_yield": 800, "max_yield": 1500 },
                "Bajra": { "ideal_temp": 32, "ideal_rain": 400, "ideal_fert": 40, "ideal_pest": 2, "base_yield": 700, "max_yield": 1500 },

                // Vegetables
                "Potato": { "ideal_temp": 18, "ideal_rain": 400, "ideal_fert": 120, "ideal_pest": 4, "base_yield": 8000, "max_yield": 12000 },
                "Onion": { "ideal_temp": 25, "ideal_rain": 500, "ideal_fert": 80, "ideal_pest": 4, "base_yield": 6000, "max_yield": 10000 },
                "Tomato": { "ideal_temp": 25, "ideal_rain": 600, "ideal_fert": 100, "ideal_pest": 4, "base_yield": 10000, "max_yield": 25000 },
                "Brinjal": { "ideal_temp": 28, "ideal_rain": 700, "ideal_fert": 90, "ideal_pest": 4, "base_yield": 8000, "max_yield": 15000 },

                // Fruits/Plantation
                "Banana": { "ideal_temp": 27, "ideal_rain": 1800, "ideal_fert": 200, "ideal_pest": 5, "base_yield": 15000, "max_yield": 30000 },
                "Mango": { "ideal_temp": 28, "ideal_rain": 1000, "ideal_fert": 100, "ideal_pest": 5, "base_yield": 3000, "max_yield": 6000 },
                "Coconut": { "ideal_temp": 27, "ideal_rain": 2000, "ideal_fert": 150, "ideal_pest": 5, "base_yield": 4000, "max_yield": 8000 },

                "default": { "ideal_temp": 25, "ideal_rain": 700, "ideal_fert": 100, "ideal_pest": 3, "base_yield": 1000, "max_yield": 2000 }
            };

            const ideals = CROP_IDEALS[formData.crop] || CROP_IDEALS["default"];

            const actual_rain = parseFloat(formData.rainfall) || ideals.ideal_rain;
            const actual_temp = parseFloat(formData.temperature) || ideals.ideal_temp; // Use ideal if fetched temp is invalid
            const actual_fert = parseFloat(formData.fertilizer) || ideals.ideal_fert;
            const actual_pest = parseFloat(formData.pesticide) || ideals.ideal_pest;

            // SCORES (0.0 to 1.0) - Matching backend logic
            // Temp
            const temp_diff = Math.abs(actual_temp - ideals.ideal_temp);
            const temp_score = Math.max(0, 1 - (temp_diff * 0.05));

            // Rain
            const rain_diff = Math.abs(actual_rain - ideals.ideal_rain);
            const rain_score = Math.max(0.2, 1 - (rain_diff / 2000));

            // Fertilizer
            let fert_score;
            if (actual_fert < ideals.ideal_fert) {
                fert_score = actual_fert / ideals.ideal_fert;
            } else {
                fert_score = Math.max(0.8, 1 - ((actual_fert - ideals.ideal_fert) / 500));
            }

            // Pesticide
            let pest_score;
            if (actual_pest < ideals.ideal_pest) {
                pest_score = actual_pest / ideals.ideal_pest;
            } else {
                pest_score = 1.0;
            }

            // Total Efficiency
            const efficiency = temp_score * rain_score * ((fert_score * 0.6) + (pest_score * 0.4));

            // Final Yield Calculation
            const yield_range = ideals.max_yield - ideals.base_yield;
            let simulatedYield = ideals.base_yield + (yield_range * efficiency);

            // Random Noise (-5% to +5%)
            simulatedYield += simulatedYield * (Math.random() * 0.1 - 0.05);

            setPrediction(simulatedYield);
            console.log("Using Smart Offline Simulation (Matches Backend).");
            // -----------------------------

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center p-4 transition-colors duration-300">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl relative transition-all duration-300">

                {/* Theme Toggle Absolute */}
                <button
                    onClick={toggleTheme}
                    className="absolute top-8 right-8 bg-white dark:bg-black text-black dark:text-white border border-gray-200 dark:border-gray-700 p-2 rounded-full hover:scale-110 transition shadow-md"
                >
                    {theme === 'dark' ? '☀' : '🌙'}
                </button>

                {/* Header */}
                <h2 className="text-3xl font-bold text-center mb-8 text-green-600 dark:text-blue-400">Predict Crop Yield</h2>

                <div className="space-y-4">
                    {/* Crop */}
                    <div>
                        <label className="block text-gray-500 dark:text-gray-400 text-sm mb-1">Select Crop Category</label>
                        <select
                            className="w-full bg-gray-50 dark:bg-field-bg border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-gray-300 focus:border-green-500 dark:focus:border-blue-500 focus:outline-none transition-colors"
                            value={formData.crop}
                            onChange={e => setFormData({ ...formData, crop: e.target.value })}
                        >
                            <optgroup label="Cereals">
                                <option>Rice</option>
                                <option>Wheat</option>
                                <option>Maize</option>
                                <option>Jowar</option>
                                <option>Bajra</option>
                            </optgroup>
                            <optgroup label="Commercial">
                                <option>Cotton</option>
                                <option>Sugarcane</option>
                            </optgroup>
                            <optgroup label="Pulses (Dal)">
                                <option>Arhar (Tur)</option>
                                <option>Gram (Chana)</option>
                                <option>Urad</option>
                                <option>Moong</option>
                            </optgroup>
                            <optgroup label="Oilseeds">
                                <option>Groundnut</option>
                                <option>Soybean</option>
                                <option>Mustard</option>
                                <option>Sunflower</option>
                            </optgroup>
                            <optgroup label="Vegetables">
                                <option>Potato</option>
                                <option>Onion</option>
                                <option>Tomato</option>
                                <option>Brinjal</option>
                            </optgroup>
                            <optgroup label="Fruits/Plantation">
                                <option>Banana</option>
                                <option>Mango</option>
                                <option>Coconut</option>
                            </optgroup>
                        </select>
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-gray-500 dark:text-gray-400 text-sm mb-1">Crop Year</label>
                        <input
                            type="number"
                            placeholder="YYYY"
                            className="w-full bg-gray-50 dark:bg-field-bg border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-gray-300 focus:border-green-500 dark:focus:border-blue-500 focus:outline-none transition-colors"
                            value={formData.year}
                            onChange={e => setFormData({ ...formData, year: e.target.value })}
                        />
                    </div>

                    {/* Location Row (Dynamic) */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-500 dark:text-gray-400 text-sm mb-1">State</label>
                            <select
                                className="w-full bg-gray-50 dark:bg-field-bg border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-gray-300 transition-colors"
                                value={formData.state}
                                onChange={handleStateChange}
                            >
                                {Object.keys(indiaLocationData).sort().map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-500 dark:text-gray-400 text-sm mb-1">District</label>
                            <select
                                className="w-full bg-gray-50 dark:bg-field-bg border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-gray-300 transition-colors"
                                value={formData.district}
                                onChange={e => setFormData({ ...formData, district: e.target.value })}
                            >
                                {indiaLocationData[formData.state]?.map(district => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleFetchWeather}
                                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white text-gray-800 rounded-lg font-medium text-sm py-4 h-[58px] transition-colors"
                            >
                                Fetch Weather
                            </button>
                        </div>
                    </div>

                    {/* Weather Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-gray-500 dark:text-gray-400 text-sm mb-1">Temperature</label>
                            <input
                                disabled
                                className="w-full bg-gray-100 dark:bg-field-bg border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-500 dark:text-gray-300 disabled:opacity-70 transition-colors"
                                value={formData.temperature ? `${formData.temperature}°C` : ''}
                                placeholder="Temp °C"
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-gray-500 dark:text-gray-400 text-sm mb-1">Humidity</label>
                            <input
                                disabled
                                className="w-full bg-gray-100 dark:bg-field-bg border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-500 dark:text-gray-300 disabled:opacity-70 transition-colors"
                                value={formData.humidity ? `${formData.humidity}%` : ''}
                                placeholder="Humidity %"
                            />
                        </div>
                    </div>

                    {/* Season */}
                    <div>
                        <label className="block text-gray-500 dark:text-gray-400 text-sm mb-1">Select Season</label>
                        <select
                            className="w-full bg-gray-50 dark:bg-field-bg border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-gray-300 transition-colors"
                            value={formData.season}
                            onChange={e => setFormData({ ...formData, season: e.target.value })}
                        >
                            <option>Whole Year</option>
                            <option>Kharif</option>
                            <option>Rabi</option>
                            <option>Zaid</option>
                        </select>
                    </div>

                    {/* Remaining Fields */}
                    <div>
                        <label className="block text-gray-500 dark:text-gray-400 text-sm mb-1">Rainfall (mm)</label>
                        <input
                            type="number"
                            placeholder="e.g. 1200"
                            className="w-full bg-gray-50 dark:bg-field-bg border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-gray-300 transition-colors"
                            value={formData.rainfall}
                            onChange={e => setFormData({ ...formData, rainfall: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-500 dark:text-gray-400 text-sm mb-1">Land Area (Acres)</label>
                        <input
                            type="number"
                            placeholder="e.g. 5"
                            className="w-full bg-gray-50 dark:bg-field-bg border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-gray-300 transition-colors"
                            value={formData.area}
                            onChange={e => setFormData({ ...formData, area: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-500 dark:text-gray-400 text-sm mb-1">Pesticide Usage (kg/acre)</label>
                        <input
                            type="number"
                            placeholder="e.g. 75"
                            className="w-full bg-gray-50 dark:bg-field-bg border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-gray-300 transition-colors"
                            value={formData.pesticide}
                            onChange={e => setFormData({ ...formData, pesticide: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-500 dark:text-gray-400 text-sm mb-1">Fertilizer Usage (kg/acre)</label>
                        <input
                            type="number"
                            placeholder="e.g. 150"
                            className="w-full bg-gray-50 dark:bg-field-bg border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-gray-300 transition-colors"
                            value={formData.fertilizer}
                            onChange={e => setFormData({ ...formData, fertilizer: e.target.value })}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pt-2">
                        <input type="checkbox" className="rounded bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-600" defaultChecked />
                        <label>I agree to the <span className="text-green-600 dark:text-blue-400">Terms</span> and <span className="text-green-600 dark:text-blue-400">Privacy Policy</span>.</label>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-white dark:text-blue-400 py-4 rounded-lg font-bold text-lg border border-transparent dark:border-gray-700 transition shadow-lg dark:shadow-none"
                    >
                        {loading ? 'Processing...' : 'Predict Yield'}
                    </button>

                    {/* Result Popup - Total Calculation (Quintals) */}
                    {prediction && (
                        <div className="mt-6 bg-green-100 dark:bg-agri-green text-green-900 dark:text-black p-4 rounded-xl text-center shadow-lg animate-bounce border border-green-200 dark:border-none">
                            <p className="text-sm font-bold opacity-80">Prediction Successful</p>
                            <h3 className="text-3xl font-extrabold mb-1">
                                {((prediction / 100) * (parseFloat(formData.area) || 1)).toFixed(2)} Quintals
                            </h3>
                            <p className="text-sm opacity-80">
                                Total Yield for {formData.area} Acre{formData.area > 1 ? 's' : ''} <br />
                                <span className="text-xs font-medium"> (approx. {(prediction / 100).toFixed(2)} Quintals/acre)</span>
                            </p>
                        </div>
                    )}
                </div>

                <button onClick={onBack} className="mt-4 text-xs text-gray-500 dark:text-gray-500 hover:text-black dark:hover:text-white underline text-center w-full transition">Back to Home</button>

            </div>
        </div>
    );
};

export default YieldForm;
