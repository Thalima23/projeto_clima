# Relatório de Auditoria – Segurança, Privacidade e Licenciamento

**Projeto:** projeto_clima  
**Autora:** Thalita  
**Data:** Novembro de 2025  

## 1. Segurança e Privacidade

A auditoria avaliou o código-fonte e dependências do projeto, considerando:
- Armazenamento de chaves e dados sensíveis;  
- Comunicação segura com APIs externas;  
- Coleta e exibição de dados de usuários;  
- Estrutura de dependências no `package.json`.  

### Pontos avaliados

| Categoria | Descrição | Risco | Status |
|------------|------------|--------|--------|
| **Chaves de API** | A aplicação utiliza API pública (Open-Meteo), sem chaves privadas. | Baixo | ✅ Seguro |
| **HTTPS** | Requisições devem ser feitas via HTTPS para proteger tráfego. | Médio | ⚠️ Verificar |
| **Localização do usuário** | Caso implementada, deve solicitar consentimento. | Médio | ⚠️ Adicionar aviso |
| **Armazenamento local** | Nenhum dado sensível deve ser salvo em localStorage. | Baixo | ✅ OK |
| **Dependências** | `jest` e `jsdom` seguros e usados apenas em ambiente de teste. | Baixo | ✅ OK |

### Recomendações
1. Adicionar aviso de privacidade: “Os dados meteorológicos exibidos são obtidos da API pública Open-Meteo. Nenhum dado pessoal é coletado ou armazenado pela aplicação.”  
2. Garantir uso de HTTPS em todas as requisições.  
3. Manter dependências atualizadas e revisar bibliotecas antes de uso.  
4. Evitar armazenamento de dados pessoais em cache local.  

---

## 2. Licenciamento e Conformidade

| Componente | Tipo | Licença | Uso no Projeto |
|-------------|------|----------|----------------|
| **jest** | Dev Dependency | MIT | Testes automatizados |
| **jest-environment-jsdom** | Dev Dependency | MIT | Simulação de DOM |
| **Open-Meteo API** | API externa | CC BY 4.0 | Dados meteorológicos |
| **Google Fonts (Poppins)** | Fonte | SIL Open Font License 1.1 | Interface |
| **Weather Icons** | Ícones | SIL OFL 1.1 + MIT | Interface |
| **Cloudflare CDN** | Infraestrutura | Público | Entrega de assets |

**Conclusão:** Todas as dependências e serviços utilizados são compatíveis com uso educacional e comercial sob a Licença MIT do projeto.
