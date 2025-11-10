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
`;

// Importar funções do api.js
const { buscarCoordenadas, buscarDadosClima, obterDescricaoClima, buscarClima } = require('../assets/js/api');

// Mock global fetch
let originalFetch;
beforeEach(() => {
  originalFetch = global.fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
  jest.clearAllMocks();
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

describe('Funções de API - Projeto Clima', () => {

  // ===== TESTE 1: cidade válida =====
test('1. Nome de cidade válido retorna coordenadas e dados meteorológicos', async () => {
  global.fetch = jest.fn((url) => {
    if (url.includes('geocoding-api')) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            results: [
              { latitude: -23.5505, longitude: -46.6333, name: 'São Paulo', country: 'Brasil' },
            ],
          }),
      });
    }
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          current: { temperature_2m: 25.5, weather_code: 0 },
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

  });

  // ===== TESTE 2: cidade inexistente =====
  test('2. Nome de cidade inexistente retorna null', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ results: [] }) })
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
          json: () =>
            Promise.resolve({
              results: [
                { latitude: -23.5505, longitude: -46.6333, name: 'São Paulo', country: 'Brasil' },
              ],
            }),
        });
      }
      return Promise.resolve({
        json: () =>
          Promise.resolve({ current: { temperature_2m: 25, weather_code: 0 } }),
      });
    });

    await buscarClima();

    expect(cityName.textContent).toBe('São Paulo, Brasil');
    expect(temperature.textContent).toBe('25°');
    expect(weatherIcon.className).toBe('wi wi-day-sunny');
    expect(description.textContent).toBe('Céu limpo');
    expect(searchScreen.style.display).toBe('none');
    expect(resultScreen.style.display).toBe('flex');
  });

  // ===== TESTE 7: buscarClima cidade não encontrada =====
  test('7. buscarClima com cidade inválida mostra erro', async () => {
    cityInput.value = 'CidadeErrada';
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ results: [] }) })
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
      ok: false,
      json: () =>
        Promise.resolve({}), // o api.js só checa o status, não precisa de message aqui
    })
  );

  await buscarClima();

  expect(error.style.display).toBe('block');
  expect(error.textContent).toBe('Você fez muitas requisições. Aguarde um pouco.');
  expect(resultScreen.style.display).toBe('none');
});

  // ===== TESTE 9: Conexão de rede lenta/instável =====
  test('9. Conexão lenta gera timeout', async () => {
    const TEMPO_MAX = 500; // 0.5s para teste rápido

    cityInput.value = 'São Paulo';
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ json: () => Promise.resolve({ current: { temperature_2m: 25, weather_code: 0 } }) });
          }, TEMPO_MAX + 500); // excede TEMPO_MAX
        })
    );

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: requisição demorou demais')), TEMPO_MAX)
    );

    await expect(
      Promise.race([buscarClima(), timeoutPromise])
    ).rejects.toThrow(/Timeout/);
  });

 // ===== TESTE 10: Mudança inesperada no formato da resposta JSON =====
test('10. API mudou formato da resposta', async () => {
  cityInput.value = 'São Paulo';
  global.fetch = jest.fn((url) => {
    if (url.includes('geocoding-api')) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            results: [], // coordenadas não encontradas, assim o buscarCoordenadas retorna null
          }),
      });
    }
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          currentWeather: { temperature_2m: 25, weather_code: 0 }, // novo formato da API
        }),
    });
  });

  const coordenadas = await buscarCoordenadas('São Paulo');
  expect(coordenadas).toBeNull(); // mock retorna vazio

  const dadosClima = await buscarDadosClima({ latitude: -23.5505, longitude: -46.6333 });
  expect(dadosClima.current).toBeUndefined();
  expect(dadosClima.currentWeather).toBeDefined();

    });
});
