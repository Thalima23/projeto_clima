/**
 * @fileoverview Sistema de Previsão do Tempo - Thali Weather 
 * @description Aplicação web para consulta de dados meteorológicos em tempo real.
 * Utiliza as APIs Open-Meteo (Geocoding e Weather) para buscar informações climáticas
 * de cidades ao redor do mundo.
 * 
 * @author Thalita
 * @version 1.0.0
 * @license MIT
 */

// ===== SELEÇÃO DE ELEMENTOS DO DOM =====
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const searchScreen = document.getElementById('searchScreen');
const resultScreen = document.getElementById('resultScreen');
const temperature = document.getElementById('temperature');
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const description = document.getElementById('description');
const currentDate = document.getElementById('currentDate');
const backBtn = document.getElementById('backBtn');

// NOVOS CAMPOS
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const rain = document.getElementById('rain');

// ===== ESTADO INICIAL PARA OS TESTES =====
searchScreen.style.display = 'flex';
resultScreen.style.display = 'none';
error.style.display = 'none';
loading.style.display = 'none';

// ===== CONSTANTES =====
const TIMEOUT_MS = 10000;

// ===== FUNÇÕES AUXILIARES =====
function obterDataAtual() {
    const hoje = new Date();
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return hoje.toLocaleDateString('pt-BR', opcoes);
}

async function fetchComTimeout(url, timeout = TIMEOUT_MS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (erro) {
        clearTimeout(timeoutId);
        throw erro;
    }
}

// ===== FUNÇÕES DE API =====
async function buscarCoordenadas(cidade) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
    const resposta = await fetchComTimeout(url);

    if (resposta.status === 429) throw new Error('limite');

    const dados = await resposta.json();
    if (!dados.results || dados.results.length === 0) return null;

    const resultado = dados.results[0];
    return {
        latitude: resultado.latitude,
        longitude: resultado.longitude,
        nome: resultado.name,
        pais: resultado.country
    };
}

async function buscarDadosClima(coordenadas) {
    // 🔥 ADICIONADO: umidade, vento, precipitação
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordenadas.latitude}&longitude=${coordenadas.longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation&timezone=auto`;

    const resposta = await fetchComTimeout(url);
    const dados = await resposta.json();

    // valores principais (já existiam)
    const temp = dados.current?.temperature_2m ?? dados.currentWeather?.temp;
    const code = dados.current?.weather_code ?? dados.currentWeather?.code;

    // 🔥 NOVOS DADOS
    const hum = dados.current?.relative_humidity_2m ?? null;
    const windSpeed = dados.current?.wind_speed_10m ?? null;
    const prec = dados.current?.precipitation ?? null;

    return {
        temperature_2m: temp,
        weather_code: code,
        humidity: hum,
        wind_speed: windSpeed,
        precipitation: prec,
        current: dados.current,
        currentWeather: dados.currentWeather
    };
}

// ===== DESCRIÇÃO DO CLIMA =====
function obterDescricaoClima(codigo) {
    const codigos = {
        0: { descricao: 'Céu limpo', icone: 'wi-day-sunny' },
        1: { descricao: 'Principalmente limpo', icone: 'wi-day-sunny-overcast' },
        2: { descricao: 'Parcialmente nublado', icone: 'wi-day-cloudy' },
        3: { descricao: 'Nublado', icone: 'wi-cloudy' },
        45: { descricao: 'Neblina', icone: 'wi-fog' },
        48: { descricao: 'Nevoeiro', icone: 'wi-fog' },
        51: { descricao: 'Garoa leve', icone: 'wi-sprinkle' },
        53: { descricao: 'Garoa moderada', icone: 'wi-sprinkle' },
        55: { descricao: 'Garoa forte', icone: 'wi-showers' },
        61: { descricao: 'Chuva leve', icone: 'wi-rain' },
        63: { descricao: 'Chuva moderada', icone: 'wi-rain' },
        65: { descricao: 'Chuva forte', icone: 'wi-rain-wind' },
        71: { descricao: 'Neve leve', icone: 'wi-snow' },
        73: { descricao: 'Neve moderada', icone: 'wi-snow' },
        75: { descricao: 'Neve forte', icone: 'wi-snow-wind' },
        80: { descricao: 'Pancadas de chuva', icone: 'wi-showers' },
        81: { descricao: 'Pancadas moderadas', icone: 'wi-showers' },
        82: { descricao: 'Pancadas fortes', icone: 'wi-rain-wind' },
        95: { descricao: 'Tempestade', icone: 'wi-thunderstorm' },
        96: { descricao: 'Tempestade com granizo', icone: 'wi-storm-showers' },
        99: { descricao: 'Tempestade severa', icone: 'wi-hail' }
    };
    return codigos[codigo] || { descricao: 'Clima desconhecido', icone: 'wi-na' };
}

// ===== PRINCIPAL =====
async function buscarClima() {
    const cidade = cityInput.value.trim();
    if (!cidade) return;

    esconderMensagens();

    mostrarCarregamento();

    try {
        const coordenadas = await buscarCoordenadas(cidade);
        if (!coordenadas) {
            mostrarErro("Cidade não encontrada!");
            return;
        }

        const dadosClima = await buscarDadosClima(coordenadas);
        exibirClima(coordenadas.nome, coordenadas.pais, dadosClima);

    } catch (erro) {
        if (erro.message === "limite") {
            mostrarErro("Você fez muitas requisições. Aguarde um pouco.");
        } else {
            mostrarErro("Erro ao buscar dados. Tente novamente.");
        }

    } finally {
        esconderCarregamento();
    }
}

// ===== INTERFACE =====
function exibirClima(nome, pais, dados) {
    esconderMensagens();
    cityName.textContent = `${nome}, ${pais}`;
    temperature.textContent = `${Math.round(dados.temperature_2m)}°`;
    currentDate.textContent = obterDataAtual();

    const clima = obterDescricaoClima(dados.weather_code);
    weatherIcon.className = `wi ${clima.icone}`;
    description.textContent = clima.descricao;

    // 🔥 NOVOS CAMPOS NO DOM
    humidity.textContent = dados.humidity ?? '--';
    wind.textContent = dados.wind_speed ?? '--';
    rain.textContent = dados.precipitation ?? '--';

    searchScreen.style.display = 'none';
    resultScreen.style.display = 'flex';
}

function voltarParaBusca() {
    cityInput.value = '';
    esconderMensagens();
    resultScreen.style.display = 'none';
    searchScreen.style.display = 'flex';
}

function mostrarErro(msg) {
    error.textContent = msg;
    error.style.display = 'block';
}

function mostrarCarregamento() {
    loading.style.display = 'block';
}

function esconderCarregamento() {
    loading.style.display = 'none';
}

function esconderMensagens() {
    loading.style.display = 'none';
    error.style.display = 'none';
}

function aplicarTemaHorario() {
    const hora = new Date().getHours();
    const body = document.body;

    if (hora >= 18 || hora < 6) {
        body.classList.add('night-mode');
    } else {
        body.classList.remove('night-mode');
    }
}

// ===== INICIALIZAÇÃO =====
aplicarTemaHorario();

// ===== EVENTOS =====
searchBtn.addEventListener('click', buscarClima);
cityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') buscarClima(); });
backBtn.addEventListener('click', voltarParaBusca);

// ===== EXPORTA PARA TESTES =====
module.exports = { buscarCoordenadas, buscarDadosClima, obterDescricaoClima, buscarClima };
