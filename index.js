import axios from '../node_modules/axios';

// form fields
const form = document.querySelector('.form-data');
const region1 = document.getElementById('region1');
const region2 = document.getElementById('region2');
const region3 = document.getElementById('region3');
const apiKeyInput = document.querySelector('.api-key');

// results containers
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results1 = document.querySelector('.result-container1');
const results2 = document.querySelector('.result-container2');
const results3 = document.querySelector('.result-container3');
const clearBtn = document.querySelector('.clear-btn');

const calculateColor = (value) => {
    let co2Scale = [0, 150, 600, 750, 800];
    let colors = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];
    let closestNum = co2Scale.sort((a, b) => Math.abs(a - value) - Math.abs(b - value))[0];
    let scaleIndex = co2Scale.findIndex(element => element > closestNum);
    let closestColor = colors[scaleIndex];
    chrome.runtime.sendMessage({ action: 'updateIcon', value: { color: closestColor } });
};

// 각 지역에 대해 별도의 displayCarbonUsage 호출
const displayMultipleRegions = async (apiKey) => {
    // API 요청 시 로딩 텍스트 표시
    loading.style.display = 'block';
    errors.textContent = '';

    try {
        await Promise.all([
            displayCarbonUsage(apiKey, region1.value, results1),
            displayCarbonUsage(apiKey, region2.value, results2),
            displayCarbonUsage(apiKey, region3.value, results3),
        ]);
    } catch (error) {
        console.log(error);
        errors.textContent = 'Error while fetching data for regions.';
    } finally {
        loading.style.display = 'none'; // 로딩 텍스트 숨기기
    }
};

const displayCarbonUsage = async (apiKey, region, resultContainer) => {
    if (!region) {
        resultContainer.querySelector('.my-region').textContent = 'No region specified';
        resultContainer.querySelector('.carbon-usage').textContent = '';
        resultContainer.querySelector('.fossil-fuel').textContent = '';
        resultContainer.style.display = 'block';
        return;
    }

    try {
        const response = await axios.get('https://api.co2signal.com/v1/latest', {
            params: { countryCode: region },
            headers: { 'auth-token': apiKey },
        });

        let CO2 = Math.floor(response.data.data.carbonIntensity);
        calculateColor(CO2);

        resultContainer.querySelector('.my-region').textContent = region;
        resultContainer.querySelector('.carbon-usage').textContent =
            `${Math.round(response.data.data.carbonIntensity)} grams (grams CO2 emitted per kilowatt hour)`;
        resultContainer.querySelector('.fossil-fuel').textContent =
            `${response.data.data.fossilFuelPercentage.toFixed(2)}% (percentage of fossil fuels used to generate electricity)`;
        resultContainer.style.display = 'block';

    } catch (error) {
        console.log(error);
        resultContainer.querySelector('.my-region').textContent = `Error for region: ${region}`;
        resultContainer.querySelector('.carbon-usage').textContent = '';
        resultContainer.querySelector('.fossil-fuel').textContent = '';
        resultContainer.style.display = 'block';
    }
};

function setUpUser(apiKey) {
    // API Key 및 지역 초기화
    if (!apiKey) {
        errors.textContent = 'API key is required.';
        return;
    }

    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';
    displayMultipleRegions(apiKey);
}

function handleSubmit(e) {
    e.preventDefault();
    setUpUser(apiKeyInput.value.trim());
}

function init() {
    form.style.display = 'block';
    results1.style.display = 'none';
    results2.style.display = 'none';
    results3.style.display = 'none';
    loading.style.display = 'none';
    clearBtn.style.display = 'none';
    errors.textContent = '';
}

function reset(e) {
    e.preventDefault();
    region1.value = '';
    region2.value = '';
    region3.value = '';
    apiKeyInput.value = '';
    init();
}

form.addEventListener('submit', handleSubmit);
clearBtn.addEventListener('click', reset);
init();
console.log('Region1 value:', region1.value);