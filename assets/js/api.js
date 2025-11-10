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
/**
 * Elementos HTML manipulados pela aplicação
 * @type {HTMLElement}
 */
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

// ===== CONSTANTES =====
/**
 * Tempo máximo de espera por resposta da API (em milissegundos)
 * @constant {number}
 * @default 10000
 */
const TIMEOUT_MS = 10000;

// ===== FUNÇÕES AUXILIARES =====

/**
 * Retorna a data atual formatada em português
 * @returns {string} Data formatada (ex: "segunda-feira, 13 de outubro de 2025")
 * @example
 * const hoje = obterDataAtual();
 * console.log(hoje); // "segunda-feira, 13 de outubro de 2025"
 */
function obterDataAtual() {
    const hoje = new Date();
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return hoje.toLocaleDateString('pt-BR', opcoes);
}

/**
 * Executa fetch com timeout configurável
 * @async
 * @param {string} url - URL da requisição
 * @param {number} [timeout=TIMEOUT_MS] - Tempo máximo em milissegundos
 * @returns {Promise<Response>} Resposta HTTP
 * @throws {Error} Lança 'Timeout' se exceder o tempo limite
 * @throws {Error} Propaga erros de rede
 * @example
 * try {
 *   const response = await fetchComTimeout('https://api.example.com');
 * } catch (erro) {
 *   console.error(erro);
 * }
 */
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

/**
 * Busca coordenadas geográficas de uma cidade
 * @async
 * @param {string} cidade - Nome da cidade
 * @returns {Promise<Object|null>} Objeto com latitude, longitude, nome e país, ou null se não encontrado
 * @throws {Error} Erro de requisição ou limite de requisições
 * @example
 * const coords = await buscarCoordenadas('São Paulo');
 * // { latitude: -23.5505, longitude: -46.6333, nome: 'São Paulo', pais: 'Brasil' }
 */
async function buscarCoordenadas(cidade) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
    const resposta = await fetchComTimeout(url);

    if (resposta.status === 429) {
        throw new Error('limite');
    }

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

/**
 * Busca dados climáticos atuais de uma localização
 * @async
 * @param {Object} coordenadas - Objeto com latitude e longitude
 * @param {number} coordenadas.latitude
 * @param {number} coordenadas.longitude
 * @returns {Promise<Object>} Dados climáticos atuais
 * @example
 * const clima = await buscarDadosClima({ latitude: -23.5505, longitude: -46.6333 });
 * // { temperature_2m: 25, weather_code: 0, current: {...}, currentWeather: {...} }
 */
async function buscarDadosClima(coordenadas) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordenadas.latitude}&longitude=${coordenadas.longitude}&current=temperature_2m,weather_code&timezone=auto`;
    const resposta = await fetchComTimeout(url);
    const dados = await resposta.json();

    const temp = dados.current?.temperature_2m ?? dados.currentWeather?.temp;
    const code = dados.current?.weather_code ?? dados.currentWeather?.code;

    return {
        temperature_2m: temp,
        weather_code: code,
        current: dados.current,
        currentWeather: dados.currentWeather
    };
}

/**
 * Converte código do clima em descrição e ícone visual
 * @param {number} codigo - Código do clima (0-99)
 * @returns {Object} Objeto com descrição e classe de ícone
 * @returns {string} descricao
 * @returns {string} icone
 * @example
 * obterDescricaoClima(0);
 * // { descricao: 'Céu limpo', icone: 'wi-day-sunny' }
 */
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

/**
 * Função principal para buscar clima e atualizar interface
 * @async
 * @returns {Promise<void>}
 * @example
 * await buscarClima();
 */
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

// ===== FUNÇÕES DE INTERFACE =====

/**
 * Exibe dados climáticos na interface
 * @param {string} nome - Nome da cidade
 * @param {string} pais - Nome do país
 * @param {Object} dados - Dados do clima
 * @param {number} dados.temperature_2m
 * @param {number} dados.weather_code
 */
function exibirClima(nome, pais, dados) {
    esconderMensagens();
    cityName.textContent = `${nome}, ${pais}`;
    temperature.textContent = `${Math.round(dados.temperature_2m)}°`;
    currentDate.textContent = obterDataAtual();
    const clima = obterDescricaoClima(dados.weather_code);
    weatherIcon.className = `wi ${clima.icone}`;
    description.textContent = clima.descricao;
    searchScreen.style.display = 'none';
    resultScreen.style.display = 'flex';
}

/**
 * Volta para a tela de busca e limpa estado
 */
function voltarParaBusca() {
    cityInput.value = '';
    esconderMensagens();
    resultScreen.style.display = 'none';
    searchScreen.style.display = 'flex';
}

/**
 * Mostra mensagem de erro
 * @param {string} msg - Mensagem a exibir
 */
function mostrarErro(msg) {
    error.textContent = msg;
    error.style.display = 'block';
    resultScreen.style.display = 'none';
}

/**
 * Mostra indicador de carregamento
 */
function mostrarCarregamento() {
    loading.style.display = 'block';
}

/**
 * Esconde indicador de carregamento
 */
function esconderCarregamento() {
    loading.style.display = 'none';
}

/**
 * Esconde todas as mensagens
 */
function esconderMensagens() {
    loading.style.display = 'none';
    error.style.display = 'none';
}

/**
 * Aplica tema dia/noite conforme horário
 */
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

// ===== EXPORTA FUNÇÕES PARA TESTES =====
module.exports = { buscarCoordenadas, buscarDadosClima, obterDescricaoClima, buscarClima };
