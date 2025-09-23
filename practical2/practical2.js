const weatherData = {
    Ahmedabad: 40,
    Mumbai: 32,
    Delhi: 38,
    Bangalore: 28,
    Chennai: 34
};


document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    const result = document.getElementById('weatherResult');

    if (weatherData[city]) {
        result.textContent = `The weather in ${city} is ${weatherData[city]}°C`;
    } else {
        result.textContent = `Weather data for "${city}" not found.`;
    }
});
document.getElementById('getWeatherBtn').addEventListener('click', async() => {
    const city = document.getElementById('cityInput').value.trim();
    const result = document.getElementById('weatherResult');
    const apiKey = '163608c623bb421c93170925250407'; // Replace with your OpenWeatherMap API key

    if (!city) {
        result.textContent = 'Please enter a city name.';
        return;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        result.textContent = `The weather in ${city} is ${data.main.temp}°C`;
    } catch (error) {
        result.textContent = `Weather data for "${city}" not found.`;
    }
});