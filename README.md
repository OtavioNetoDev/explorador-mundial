# 🧭 EXPLORADOR MUNDIAL

> Explore o mundo, responda perguntas e aprenda Geografia e História! Um simulador cartográfico educativo desenvolvido em HTML, CSS e JavaScript puro — com mapa real, quiz de múltipla escolha, painel do professor e sistema de backup.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Jogar](#-como-jogar)
- [Painel do Professor](#-painel-do-professor)
- [Backup e Restauração](#-backup-e-restauração)
- [Banco de Perguntas Interno](#-banco-de-perguntas-interno)
- [Tecnologias](#-tecnologias)
- [Como Executar](#-como-executar)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 🎮 Sobre o Projeto

**Explorador Mundial** é um simulador de exploração cartográfica educativo voltado a professores e alunos de **Geografia e História**. Um marcador é posicionado no mapa-múndi real e os jogadores precisam identificar a localização geográfica e responder uma pergunta histórica sobre a região — tudo em formato de quiz com 4 alternativas.

O professor pode criar suas próprias perguntas diretamente no navegador, vincular cada pergunta a um ponto específico do mapa e salvar tudo localmente, sem precisar de internet, servidor ou conta em nenhum serviço.

---

## ✨ Funcionalidades

- 🗺️ **Mapa-múndi real** com fronteiras de países, coordenadas, Equador, Meridianos, Trópicos e Círculos Polares
- 📍 **Marcador animado** posicionado com precisão matemática sobre o mapa
- ⏱️ **Countdown de 5 segundos** — o jogador observa o mapa antes de responder
- 🧩 **Quiz de múltipla escolha** com 4 alternativas para cada pergunta
- 🌐 **Quiz Geográfico** — identifica Latitude, Longitude e região
- 🏛️ **Quiz Histórico** — pergunta sobre evento histórico da região
- 🏆 **Placar em tempo real** com chips de pontuação para até 20 jogadores
- 🔄 **Rodadas configuráveis** de 1 a 20
- 💾 **Painel do Professor** completo com criação e gerenciamento de pontos
- 🖱️ **Clique no mapa** para definir coordenadas no painel do professor
- 🔍 **Hover inteligente** — passa o mouse e vê país/região + coordenadas em tempo real
- 📂 **Backup e restauração** de perguntas com arquivo local
- 🗃️ **localStorage** — perguntas salvas persistem entre sessões
- 🌍 **34 regiões geográficas** com bancos de perguntas estritamente temáticos
- 📱 **Layout responsivo** para desktop e mobile
- 🚫 **100% offline** — sem internet, sem API, sem dependências externas

---

## 📁 Estrutura do Projeto

```
📁 geo-historia/
├── index.html      # Estrutura das 5 telas da aplicação
├── style.css       # Estilização completa (11 seções organizadas)
├── game.js         # Lógica do jogo, banco de perguntas e painel do professor
├── mapa.png        # Mapa-múndi com fronteiras, coordenadas e linhas de referência
└── README.md       # Documentação do projeto
```

---

## 🎮 Como Jogar

### Configuração Inicial
1. Abra o `index.html` no navegador
2. Defina o **número de jogadores** (1 a 20) e de **rodadas** (1 a 20)
3. Digite os nomes dos jogadores
4. Clique em **Iniciar Jogo**

### Durante o Jogo

**Fase 1 — Observe o Mapa**
- Um marcador vermelho animado aparece no mapa-múndi
- Um contador regressivo de **5 segundos** é exibido na base do mapa
- Use esse tempo para identificar a localização geográfica

**Fase 2 — Quiz Geográfico** *(+50 pontos)*
- Responda no painel lateral: qual é a Latitude e Longitude do marcador?
- Ou, se o professor criou perguntas personalizadas: responda a pergunta configurada para aquele ponto

**Fase 3 — Quiz Histórico** *(+50 pontos)*
- Responda uma pergunta sobre um evento histórico da região marcada
- O painel mostra o resultado e uma curiosidade após a resposta

**Pontuação**
| Acerto | Pontos |
|--------|--------|
| Quiz Geográfico correto | +50 pts |
| Quiz Histórico correto | +50 pts |
| **Turno perfeito** | **100 pts** |

### Fim de Jogo
- Após todas as rodadas, exibe o ranking final com medalhas 🥇🥈🥉
- Opções de voltar ao menu ou jogar novamente

---

## ⚙️ Painel do Professor

Acesse pelo botão **⚙ Painel do Professor** no menu principal.

### Criar um Ponto de Jogo

**Opção 1 — Clique no mapa**
1. Passe o mouse pelo mapa — veja em tempo real o país/região e as coordenadas
2. Clique no local desejado — o marcador amarelo aparece
3. As coordenadas e uma sugestão de pergunta geográfica são preenchidas automaticamente

**Opção 2 — Coordenadas manuais**
1. Clique em "Digitar coordenadas manualmente"
2. Informe Latitude (-90 a 90) e Longitude (-180 a 180)
3. Clique em **Aplicar**

### Preencher as Perguntas

**Pergunta Geográfica**
- Escreva o enunciado
- Preencha as 4 opções (A, B, C, D)
- Marque o **✅** na linha da opção correta

**Pergunta Histórica**
- Escreva o enunciado
- Preencha as 4 opções (A, B, C, D)
- Marque o **✅** na linha da opção correta

> **Dica:** A opção correta pode ser qualquer uma das quatro — A, B, C ou D. O sistema embaralha as alternativas automaticamente no jogo.

### Gerenciar Pontos Salvos
- Os pontos aparecem como **pins azuis** no mapa e em lista abaixo
- Passe o mouse sobre um pin para ver o nome
- Clique em qualquer pin ou linha da lista para **editar** o ponto
- Clique em **✖** para deletar um ponto
- Use **🗑 Limpar tudo** para remover todos os pontos de uma vez

### Uso no Jogo
- Se houver pontos do professor salvos, o jogo usa **esses pontos** em vez dos automáticos
- Os pontos são distribuídos ciclicamente entre os jogadores e rodadas
- Se não houver pontos salvos, o jogo usa o banco interno de 100+ perguntas

---

## 💾 Backup e Restauração

As perguntas ficam salvas no navegador (**localStorage**). Para não perder ao trocar de computador ou limpar o navegador, faça backup.

### Fazer Backup
1. No Painel do Professor, clique em **💾 Fazer backup**
2. Leia a explicação (sem termos técnicos)
3. Clique em **⬇ Baixar arquivo de backup agora**
4. O arquivo `geo-historia-backup.json` é salvo em **Downloads**

### Restaurar Backup
1. No Painel do Professor, clique em **📂 Restaurar**
2. Selecione o arquivo `.json` baixado anteriormente
3. Os pontos são restaurados automaticamente

### Compartilhar com Outros Professores
- Envie o arquivo `.json` por **e-mail ou WhatsApp**
- O colega clica em **📂 Restaurar** e importa as perguntas
- Os pontos se **somam** aos já existentes (não substituem)

---

## 🌍 Banco de Perguntas Interno

Quando não há pontos do professor cadastrados, o jogo usa seu banco interno com **100+ perguntas** distribuídas em **34 regiões geográficas estritamente temáticas** — sem cruzamentos (perguntas sobre Grécia só aparecem quando o marcador está na Grécia).

| Região | Exemplos de temas |
|--------|------------------|
| 🇧🇷 Brasil | Independência, biomas, capital, ciclos econômicos |
| 🇦🇷 Argentina | Buenos Aires, Malvinas, Aconcágua |
| 🇵🇪 Peru / Bolívia | Machu Picchu, Lago Titicaca, Atacama |
| 🇺🇸 EUA | Independência, Pearl Harbor, Lincoln |
| 🇲🇽 México | Astecas, Tenochtitlán, Rio Grande |
| 🇵🇹 Portugal | Vasco da Gama, terremoto de Lisboa |
| 🇪🇸 Espanha | Colombo, Conquistadores |
| 🇫🇷 França | Revolução Francesa, Napoleão |
| 🇩🇪 Alemanha | Muro de Berlim, Primeira Guerra Mundial |
| 🇬🇷 Grécia | Sócrates, Jogos Olímpicos, democracia ateniense |
| 🌍 África | Nilo, pirâmides, apartheid, Kilimanjaro |
| 🕌 Oriente Médio | Mesopotâmia, Jerusalém, Império Otomano |
| 🇮🇳 Índia | Gandhi, independência, Vale do Indo |
| 🇨🇳 China | Pequim, Muralha, Mao Tsé-Tung |
| 🇯🇵 Japão | Hiroshima, Tóquio, Segunda Guerra |
| 🇦🇺 Austrália | Canberra, aborígenes, Grande Barreira |
| 🌊 Oceanos | Grandes Navegações, Magalhães, Pacífico |
| *(+ 17 outras regiões)* | ... |

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| **HTML5** | Estrutura semântica das 5 telas |
| **CSS3** | Grid Layout, variáveis CSS, animações, design escuro |
| **JavaScript ES6+** | Lógica do jogo, banco de perguntas, localStorage |
| **Google Fonts** | Inter + Barlow Condensed |
| **localStorage** | Persistência dos pontos do professor |

Sem frameworks, sem dependências externas, sem servidor — **100% vanilla**.

---

## 🚀 Como Executar

### 💻 Localmente (recomendado)

```bash
# Clone o repositório
git clone https://github.com/OtavioNetoDev/explorador-mundial.git

cd explorador-mundial

# Abra o index.html no navegador (duplo clique no arquivo)
```

> ⚠️ Mantenha os 4 arquivos (`index.html`, `style.css`, `game.js`, `mapa.png`) sempre na **mesma pasta**.

### 🌐 Servidor local (opcional)

```bash
# Com Python
python -m http.server 8000

# Com Node.js
npx serve .

# Com VS Code — extensão "Live Server" → clique em "Go Live"
```

Acesse `http://localhost:8000` no navegador.

### ☁️ Deploy estático

Por ser 100% estático, funciona em qualquer hospedagem de arquivos:

| Serviço | Como usar |
|---------|-----------|
| **GitHub Pages** | `Settings → Pages → Branch: main` |
| **Vercel** | Importe o repositório, deploy automático |
| **Netlify** | Arraste a pasta do projeto |
| **Render** | Novo site estático → conecte o repositório |

---

## 📄 Licença

```
MIT License

Copyright (c) 2026 Otávio Neto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Autor

<div align="center">

**Otávio Neto**

[![GitHub](https://img.shields.io/badge/GitHub-OtavioNetoDev-181717?style=for-the-badge&logo=github)](https://github.com/OtavioNetoDev)
[![Instagram](https://img.shields.io/badge/Instagram-@euotavioneto__-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/euotavioneto_)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Otávio_Neto-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/otavionetodev/)

</div>

---

<div align="center">
  <p>🧭 Feito com dedicação por <strong>Otávio Neto</strong></p>
  <p><em>© 2026 Geo-História · Licença MIT · Uso educativo livre</em></p>
</div>
