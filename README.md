# Projeto Clima 🌤️

**Sistema de Previsão do Tempo**  
Aplicação web para consulta de dados meteorológicos em tempo real. Utiliza as APIs **Open-Meteo** (Geocoding e Weather) para buscar informações climáticas de cidades ao redor do mundo.

---

## ✨ Funcionalidades

- 🔍 Buscar o clima atual de **qualquer cidade**.
- 🌡️ Exibir:
  - Temperatura em °C  
  - Descrição do clima  
  - Ícone correspondente (via Weather Icons)
  - Umidade (%)
  - Vento (km/h)
  - Precipitação (mm)
  - Data atual formatada
- 🌗 Tema dinâmico (dia/noite) baseado no horário local.
- 🔁 Navegação intuitiva entre telas de busca e resultado.
- ⚠️ Tratamento de erros e mensagens amigáveis:
  - Cidade não encontrada  
  - Limite de requisições da API  
  - Erros de conexão  
  - Timeout de requisição

---

## 🛠 Tecnologias Utilizadas

- **HTML5** e **CSS3**
- **JavaScript (ES6+)**
- **APIs externas:**  
  - Open-Meteo Geocoding  
  - Open-Meteo Weather  
- **Jest** → testes automatizados  
- **Weather Icons** → ícones visuais para condições climáticas  

---

## 💻 Estrutura do Projeto
```bash
projeto_clima/
│
├─ assets/
│   └─ js/
│       └─ api.js          # Lógica principal da aplicação
│
├─ tests/
│   └─ api.test.js         # Testes unitários com Jest
│
├─ index.html              # Página principal
├─ style.css               # Estilos da aplicação
└─ README.md               # Documentação do projeto
```

---
## 🚀 Instalação e Execução

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/projeto_clima.git
```

2. Acesse a pasta do projeto:
```bash
cd projeto_clima
```
3. Abra o arquivo index.html no navegador de sua preferência.
-- Execute o projeto:
Abra o arquivo index.html diretamente no navegador.
💡 Dica: Nenhum servidor local é necessário — basta abrir o arquivo HTML.
---
## ⚙️ Uso

1. Digite o nome de uma cidade no campo de busca

2. Clique em “Buscar” ou pressione Enter.

3. Veja a temperatura, descrição do clima e ícone correspondente.

4. Visualize os dados climáticos:
   
| 🌡️ Temperatura | 💧 Umidade | 🌬️ Vento | 🌧️ Precipitação |


6. Clique em “Voltar” para fazer outra consulta.

7. O tema do fundo muda automaticamente (claro ou escuro) conforme o horário local.
---
## 🧪 Testes

O projeto utiliza Jest para testes unitários.

## 🔧 Como rodar os testes:

```bash
npm install
npm test
```

---
## 📋 Cobertura dos testes:

- Coordenadas válidas retornadas pela API
- Entrada de cidade inexistente
- Validação de campos vazios
- Fluxo completo de busca e exibição
- Tratamento de erros (rede, timeout, limite de requisições)
- Compatibilidade com alterações na resposta da API
---
## 🔒 Segurança e Privacidade

- Todas as requisições são feitas via **HTTPS**, garantindo comunicação segura.  
- Nenhum dado pessoal é coletado, armazenado ou compartilhado.  
- Os dados meteorológicos exibidos são obtidos exclusivamente da **API pública Open-Meteo**.  
- Caso seja usada geolocalização, o usuário será informado e poderá conceder ou negar permissão.  
---

### ⚖️ Licença e Conformidade

Este projeto é distribuído sob a **Licença MIT** — veja o arquivo [LICENSE](./LICENSE) para mais detalhes.  
A aplicação utiliza bibliotecas e serviços de terceiros conforme descrito em [NOTICE.md](./NOTICE.md).  
Todas as dependências e APIs utilizadas respeitam suas respectivas licenças (MIT, CC BY 4.0, SIL OFL).  

---
## 🧩  Créditos e Atribuições

- **Open-Meteo API** — Dados meteorológicos sob licença **CC BY 4.0**  
- **Google Fonts (Poppins)** — Licença **SIL Open Font License 1.1**  
- **Weather Icons** — Licença **SIL OFL 1.1 / MIT**  
- **Cloudflare CDN** — Entrega de conteúdo estático  
- **Jest** — Ferramenta de testes sob licença **MIT**

---
## 🧭 Exemplo de Uso

```bash
Digite: São Carlos
↓
Retorno:
🌡️ Temperatura: 25°C
☀️ Clima: Céu limpo
💧 Umidade: 75%
🌬️ Vento: 12 km/h
🌧️ Precipitação: 1 mm
📅 Data: 12/11/2025

```

---
## 📄 Licença
MIT License © Thalita

🌐 Autora:

Thalita Lima- Desenvolvedora Front-end em formação

Portfólio [https://thalima23.github.io/PORTIFOLIO/] 
