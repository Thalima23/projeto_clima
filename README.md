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

```bash
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
````

## 🚀 Instalação e Execução

1. Clone o repositório:

```bash
git clone https://github.com/Thalima23/projeto_clima
````

2. Acesse a pasta do projeto:
```bash
cd projeto_clima
````
3. Abra o arquivo index.html no navegador de sua preferência.

## ⚙️ Uso

1. Digite o nome de uma cidade no campo de input.
2. Clique em Buscar ou pressione Enter.
3. Visualize os dados climáticos na tela de resultado.
4. Clique em Voltar para realizar uma nova pesquisa.
5. O tema do fundo muda automaticamente entre claro (dia) e escuro (noite) conforme o horário local.
## ⚙️ Testes
O projeto utiliza Jest para testes unitários.
Para rodar os testes:
```bash
npm install
npm test
```
# Testes cobrem:
- Retorno de coordenadas válidas
- Entrada de cidade inexistente
- Validação de entrada vazia
- Fluxo completo de busca e exibição do clima
- Compatibilidade com alterações de formato da resposta da API
- Limite de requisições e timeout

## 📄 Licença
MIT License © Thalita

🌐 Autora:

Thalita Lima- Desenvolvedora Front-end em formação

Portfólio [https://thalima23.github.io/PORTIFOLIO/] 


