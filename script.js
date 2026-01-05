const seasonalData = {
    "Kharif": {
        description: "June – October (Monsoon)",
        crops: [
            {
                name: "Rice (Paddy)",
                seedRate: { min: 20, max: 25 },
                fertilizer: {
                    Urea: 110,
                    DAP: 55,
                    MOP: 40
                },
                tips: ["Basal dose at transplanting", "Remaining nitrogen in 2 split doses"]
            },
            {
                name: "Soybean",
                seedRate: { min: 30, max: 35 },
                fertilizer: {
                    DAP: 90,
                    MOP: 35
                },
                tips: ["Avoid excess nitrogen"]
            },
            {
                name: "Maize",
                seedRate: { min: 8, max: 10 },
                fertilizer: {
                    Urea: 130,
                    DAP: 65,
                    MOP: 50
                },
                tips: []
            }
        ]
    },
    "Rabi": {
        description: "October – March (Winter)",
        crops: [
            {
                name: "Wheat",
                seedRate: { min: 40, max: 45 },
                fertilizer: {
                    Urea: 130,
                    DAP: 65,
                    MOP: 35
                },
                tips: ["Half nitrogen at sowing", "Half after first irrigation"]
            },
            {
                name: "Gram (Chana)",
                seedRate: { min: 30, max: 35 },
                fertilizer: {
                    DAP: 90
                },
                tips: ["No heavy nitrogen needed"]
            },
            {
                name: "Mustard",
                seedRate: { min: 2, max: 3 },
                fertilizer: {
                    Urea: 90,
                    DAP: 45,
                    Gypsum: 60
                },
                tips: ["Sulphur is crucial (Gypsum)"]
            }
        ]
    },
    "Zaid": {
        description: "March – June (Summer)",
        crops: [
            {
                name: "Moong (Green Gram)",
                seedRate: { min: 8, max: 10 },
                fertilizer: {
                    DAP: 55
                },
                tips: []
            }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const seasonTabsContainer = document.getElementById('season-tabs');
    const cropSelect = document.getElementById('crop-select');
    const landSizeInput = document.getElementById('land-size');
    const resultContainer = document.getElementById('result-container');
    
    // UI Elements for output
    const resCropName = document.getElementById('result-crop-name');
    const resSeason = document.getElementById('result-season');
    const resSeed = document.getElementById('res-seed');
    const fertilizerGrid = document.getElementById('fertilizer-grid');
    const resTips = document.getElementById('res-tips');

    let currentSeason = 'Kharif'; // Default

    // Initialize UI
    function init() {
        renderSeasonTabs();
        updateCropDropdown();
        
        // Listeners
        landSizeInput.addEventListener('input', calculate);
        cropSelect.addEventListener('change', calculate);
    }

    function renderSeasonTabs() {
        seasonTabsContainer.innerHTML = '';
        Object.keys(seasonalData).forEach(season => {
            const btn = document.createElement('div');
            btn.className = `season-tab ${season === currentSeason ? 'active' : ''}`;
            btn.textContent = season;
            btn.onclick = () => switchSeason(season);
            seasonTabsContainer.appendChild(btn);
        });
    }

    function switchSeason(season) {
        currentSeason = season;
        renderSeasonTabs();
        updateCropDropdown();
        resultContainer.classList.add('hidden'); // Hide results until crop selected
    }

    function updateCropDropdown() {
        cropSelect.innerHTML = '<option value="" disabled selected>Select a crop...</option>';
        seasonalData[currentSeason].crops.forEach((crop, index) => {
            const option = document.createElement('option');
            option.value = index; // Store index to easily retrieve object
            option.textContent = crop.name;
            cropSelect.appendChild(option);
        });
    }

    function calculate() {
        const cropIndex = cropSelect.value;
        const acres = parseFloat(landSizeInput.value) || 0;

        if (cropIndex === "" || acres <= 0) {
            resultContainer.classList.add('hidden');
            return;
        }

        const crop = seasonalData[currentSeason].crops[cropIndex];
        resultContainer.classList.remove('hidden');

        // Populate basic info
        resCropName.textContent = crop.name;
        resSeason.textContent = `${currentSeason} Season (${seasonalData[currentSeason].description})`;

        // Calculate Seed
        const seedMin = (crop.seedRate.min * acres).toFixed(1);
        const seedMax = (crop.seedRate.max * acres).toFixed(1);
        resSeed.textContent = `${seedMin} - ${seedMax} kg`;

        // Calculate Fertilizer
        fertilizerGrid.innerHTML = '';
        if (crop.fertilizer) {
            Object.entries(crop.fertilizer).forEach(([type, amount]) => {
                const totalAmount = (amount * acres).toFixed(1);
                
                const card = document.createElement('div');
                card.className = 'dose-card';
                card.innerHTML = `
                    <span class="value">${totalAmount.replace('.0', '')} kg</span>
                    <span class="label">${type}</span>
                `;
                fertilizerGrid.appendChild(card);
            });
        }

        // Tips
        resTips.innerHTML = '';
        if (crop.tips && crop.tips.length > 0) {
            crop.tips.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                resTips.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "Follow standard farming practices.";
            resTips.appendChild(li);
        }
        
        // Re-run icons if needed (though lucide usually auto-runs on load)
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    init();
});
