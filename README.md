# Projeto Clima 🌤️

**Sistema de Previsão do Tempo**  
Aplicação web para consulta de dados meteorológicos em tempo real. Utiliza as APIs **Open-Meteo** (Geocoding e Weather) para buscar informações climáticas de cidades ao redor do mundo.

---

## 📌 Funcionalidades

- Buscar clima atual de qualquer cidade.
- Exibir:
  - Temperatura em °C
  - Descrição do clima
  - Ícone correspondente ao clima
  - Data atual formatada
- Tema visual dinâmico (dia/noite) baseado no horário local.
- Navegação entre tela de busca e resultado com botão de voltar.
- Tratamento de erros e mensagens amigáveis:
  - Cidade não encontrada
  - Limite de requisições da API
  - Erros de conexão
  - Timeout de requisição

---

## 🛠 Tecnologias Utilizadas

- **HTML5** e **CSS3**
- **JavaScript (ES6+)**
- **APIs externas**: Open-Meteo Geocoding e Weather
- **Jest** para testes unitários
- **Weather Icons** para exibição dos ícones do clima

---

## 💻 Estrutura do Projeto

projeto_clima/
│
├─ assets/ # Imagens, ícones e arquivos estáticos
├─ js/
│ └─ api.js # Lógica principal da aplicação
├─ tests/
│ └─ api.test.js # Testes unitários com Jest
├─ index.html # Página principal
├─ style.css # Estilo da aplicação
└─ README.md # Este arquivo

## 🚀 Instalação e Execução

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/projeto_clima.git

2. Acesse a pasta do projeto:
cd projeto_clima
Abra o arquivo index.html no navegador de sua preferência.

