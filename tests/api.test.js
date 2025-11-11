// tests/api.test.js

// Mock do DOM
document.body.innerHTML = `
  <input id="cityInput" />
  <button id="searchBtn"></button>
  <button id="backBtn"></button>
  <div id="loading"></div>
  <div id="error"></div>
  <div id="searchScreen"></div>
  <div id="resultScreen"></div>
  <div id="temperature"></div>
  <div id="cityName"></div>
  <div id="weatherIcon"></div>
  <div id="description"></div>
  <div id="currentDate"></div>
  <div id="humidity"></div>
  <div id="wind"></div>
  <div id="rain"></div>
`;

// Importar funções do api.js
const { buscarCoordenadas, buscarDadosClima, obterDescricaoClima, buscarClima } = require('../assets/js/api');

// Mock global fetch
let originalFetch;
beforeEach(() => {
  originalFetch = global.fetch;
  jest.clearAllMocks();
});

afterEach(() => {
  global.fetch = originalFetch;
});

// Elementos do DOM
const cityInput = document.getElementById('cityInput');
const searchScreen = document.getElementById('searchScreen');
const resultScreen = document.getElementById('resultScreen');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const temperature = document.getElementById('temperature');
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const description = document.getElementById('description');
const currentDate = document.getElementById('currentDate');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const rain = document.getElementById('rain');

describe('Funções de API - Projeto Clima', () => {

  // ===== TESTE 1: cidade válida =====
  test('1. Nome de cidade válido retorna coordenadas e dados meteorológicos', async () => {
    global.fetch = jest.fn((url) => {
      if (url.includes('geocoding-api')) {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({
            results: [
              { latitude: -23.5505, longitude: -46.6333, name: 'São Paulo', country: 'Brasil' },
            ],
          }),
        });
      }
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          current: { temperature_2m: 25.5, weather_code: 0, relative_humidity_2m: 80, wind_speed_10m: 10, precipitation: 2 },
        }),
      });
    });

    const coordenadas = await buscarCoordenadas('São Paulo');
    expect(coordenadas).toEqual({
      latitude: -23.5505,
      longitude: -46.6333,
      nome: 'São Paulo',
      pais: 'Brasil',
    });

    const clima = await buscarDadosClima(coordenadas);
    expect(clima.temperature_2m).toBe(25.5);
    expect(clima.weather_code).toBe(0);
    expect(clima.humidity).toBe(80);
    expect(clima.wind_speed).toBe(10);
    expect(clima.precipitation).toBe(2);
  });

  // ===== TESTE 2: cidade inexistente =====
  test('2. Nome de cidade inexistente retorna null', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => Promise.resolve({ results: [] }) })
    );

    const resultado = await buscarCoordenadas('CidadeInexistente123');
    expect(resultado).toBeNull();
  });

  // ===== TESTE 3: entrada vazia =====
  test('3. Entrada vazia retorna false após trim', () => {
    const cidadeVazia = '';
    const cidadeComEspacos = '   ';
    expect(cidadeVazia.trim().length > 0).toBe(false);
    expect(cidadeComEspacos.trim().length > 0).toBe(false);
  });

  // ===== TESTE 4: falha da API =====
  test('4. Falha da API gera erro tratado', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error')));
    await expect(buscarCoordenadas('QualquerCidade')).rejects.toThrow('Network Error');
  });

  // ===== TESTE 5: obterDescricaoClima =====
  test('5. obterDescricaoClima retorna descrição e ícone corretos', () => {
    expect(obterDescricaoClima(0)).toEqual({ descricao: 'Céu limpo', icone: 'wi-day-sunny' });
    expect(obterDescricaoClima(999)).toEqual({ descricao: 'Clima desconhecido', icone: 'wi-na' });
  });

  // ===== TESTE 6: buscarClima fluxo completo =====
  test('6. buscarClima exibe clima corretamente na interface', async () => {
    cityInput.value = 'São Paulo';
    global.fetch = jest.fn((url) => {
      if (url.includes('geocoding-api')) {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({
            results: [
              { latitude: -23.5505, longitude: -46.6333, name: 'São Paulo', country: 'Brasil' },
            ],
          }),
        });
      }
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          current: { temperature_2m: 25, weather_code: 0, relative_humidity_2m: 75, wind_speed_10m: 12, precipitation: 1 }
        }),
      });
    });

    await buscarClima();

    expect(cityName.textContent).toBe('São Paulo, Brasil');
    expect(temperature.textContent).toBe('25°');
    expect(weatherIcon.className).toBe('wi wi-day-sunny');
    expect(description.textContent).toBe('Céu limpo');
    expect(searchScreen.style.display).toBe('none');
    expect(resultScreen.style.display).toBe('flex');
    expect(humidity.textContent).toBe('75');
    expect(wind.textContent).toBe('12');
    expect(rain.textContent).toBe('1');
  });

  // ===== TESTE 7: buscarClima cidade não encontrada =====
  test('7. buscarClima com cidade inválida mostra erro', async () => {
    cityInput.value = 'CidadeErrada';
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => Promise.resolve({ results: [] }) })
    );

    await buscarClima();

    expect(error.style.display).toBe('block');
    expect(error.textContent).toBe('Cidade não encontrada!');
    expect(resultScreen.style.display).toBe('none');
  });

  // ===== TESTE 8: Limite de requisições da API excedido =====
  test('8. Limite de requisições da API excedido', async () => {
    cityInput.value = 'São Paulo';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 429,
        json: () => Promise.resolve({})
      })
    );

    await buscarClima();

    expect(error.style.display).toBe('block');
    expect(error.textContent).toBe('Você fez muitas requisições. Aguarde um pouco.');
    expect(resultScreen.style.display).toBe('none');
  });
  test('9. Conexão lenta gera erro na interface', async () => {
    jest.useFakeTimers();

    cityInput.value = 'São Paulo';

    // Mock do fetch simulando timeout / conexão lenta
    global.fetch = jest.fn(() =>
      new Promise((_, reject) => {
        const erro = new Error("Aborted");
        erro.name = "AbortError"; // necessário para fetchComTimeout
        setTimeout(() => reject(erro), 1500); // maior que TIMEOUT_MS
      })
    );

    const promise = buscarClima();

    // Avança o timer para disparar o timeout
    jest.advanceTimersByTime(2000);

    await promise;

    expect(error.style.display).toBe('block');
    expect(error.textContent).toBe('Erro ao buscar dados. Tente novamente.');
    expect(resultScreen.style.display).toBe('none');

    jest.useRealTimers();
  });

  // ===== TESTE 10: Mudança inesperada no formato da resposta JSON =====
  test('10. API mudou formato da resposta', async () => {
    cityInput.value = 'São Paulo';
    global.fetch = jest.fn((url) => {
      if (url.includes('geocoding-api')) {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ results: [] }),
        });
      }
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ currentWeather: { temperature_2m: 25, weather_code: 0 } }),
      });
    });

    const coordenadas = await buscarCoordenadas('São Paulo');
    expect(coordenadas).toBeNull();

    const dadosClima = await buscarDadosClima({ latitude: -23.5505, longitude: -46.6333 });
    expect(dadosClima.current).toBeUndefined();
    expect(dadosClima.currentWeather).toBeDefined();
  });

});
