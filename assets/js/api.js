const form = document.getElementById("form");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const city = document.getElementById("city").value;

    // 1. Busca latitude / longitude
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=pt&format=json`;

    const geoResponse = await fetch(geoURL);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
        result.style.display = "block";
        result.innerHTML = "Cidade não encontrada 😢";
        return;
    }

    const { latitude, longitude } = geoData.results[0];

    // 2. Busca clima
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();

    const temp = weatherData.current_weather.temperature;

    result.style.display = "block";
    result.innerHTML = `Temperatura em <strong>${city}</strong>: ${temp}°C`;
});
