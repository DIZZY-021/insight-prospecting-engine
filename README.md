# Insight — Prospecting Engine

Sistema web para pesquisa e prospecção de empresas, desenvolvido para identificar negócios com oportunidades de presença e melhoria digital.

O sistema permite pesquisar empresas por localização, categoria e outros critérios, analisar a sua presença digital e identificar oportunidades de prospecção.

# Objetivo

O Insight foi desenvolvido para facilitar a identificação de empresas que podem ter necessidades relacionadas à presença digital.

A aplicação reúne informações sobre negócios e apresenta indicadores que ajudam a identificar oportunidades, como:

- Empresas sem website;
- Empresas com baixa presença digital;
- Presença em redes sociais;
- Avaliações e reputação;
- Nível de oportunidade digital;
- Informações de contacto e localização.

# Tecnologias utilizadas

# Frontend

- React
- Vite
- JavaScript
- CSS
- Lucide React

# Backend

- Node.js
- Express
- JavaScript

# Base de dados

- SQLite
- better-sqlite3

# Como funciona a prospecção

O processo de prospecção segue algumas etapas:

1. O utilizador define os critérios de pesquisa.
2. O sistema procura empresas que correspondem aos critérios.
3. Os dados encontrados são processados pelo backend.
4. O sistema analisa a presença digital das empresas.
5. É calculado um nível de oportunidade.
6. Os resultados são apresentados em cartões organizados.
7. O utilizador pode consultar os detalhes de cada empresa.
8. Os resultados também podem ser exportados.

# Níveis de oportunidade

O sistema classifica as empresas em diferentes níveis de oportunidade:

- **Muito Alta**
- **Alta**
- **Média**
- **Baixa**

A classificação é baseada nos dados digitais disponíveis sobre cada empresa.

# APIs e fontes de dados

O projeto utiliza fontes externas gratuitas para obter informações sobre empresas e localização.

# OpenStreetMap / Overpass API

Utilizada para pesquisar dados de estabelecimentos e negócios disponíveis no OpenStreetMap.

A aplicação utiliza esses dados como uma das principais fontes para encontrar empresas.

# Enriquecimento web

Quando disponível, o sistema tenta complementar os dados encontrados através de informações públicas na web.

Os dados obtidos dependem da disponibilidade das fontes e não representam necessariamente todas as informações existentes sobre uma empresa.

# Limitações das fontes gratuitas

As fontes gratuitas utilizadas apresentam algumas limitações:

- Nem todas as empresas estão cadastradas;
- Algumas informações podem estar incompletas;
- Os dados podem estar desatualizados;
- Algumas empresas podem não possuir website ou redes sociais registadas;
- Serviços gratuitos podem possuir limites de utilização;
- A disponibilidade dos dados depende das fontes externas.

Por isso, os resultados devem ser utilizados como apoio à prospecção e não como uma base comercial definitiva.

# Decisões técnicas

# React + Vite

Escolhidos para desenvolver uma interface rápida e organizada, permitindo separar a aplicação em componentes reutilizáveis.

# Node.js + Express

Utilizados para criar a API responsável pelo processamento das pesquisas e comunicação com os serviços externos.

# SQLite

Escolhido por ser uma solução simples e leve para armazenar os dados localmente, sem necessidade de configurar um servidor de base de dados separado.

# better-sqlite3

Utilizado para realizar a comunicação entre o backend e a base de dados SQLite.

# Separação por responsabilidades

O backend foi organizado em:

- `routes` — definição das rotas da API;
- `services` — lógica relacionada aos serviços e fontes externas;
- `database` — inicialização e acesso à base de dados.

# Estrutura do projeto

```text
Insight/
│
├── public/
│
├── server/
│   ├── database/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js