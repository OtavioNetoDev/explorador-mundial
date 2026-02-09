// Base de dados de perguntas
const INITIAL_QUESTIONS = {
    'América do Norte': [
        {
            location: 'Pearl Harbor, Havaí',
            coords: { x: 15, y: 45 },
            country: 'Estados Unidos',
            question: 'Qual evento histórico marcou Pearl Harbor em 7 de dezembro de 1941?',
            options: [
                'Ataque japonês que levou os EUA à Segunda Guerra Mundial',
                'Tratado de paz do Pacífico',
                'Descoberta das ilhas havaianas',
                'Independência do Havaí'
            ],
            correct: 0,
            fact: 'O ataque surpresa japonês a Pearl Harbor resultou em mais de 2.400 mortes americanas e levou os Estados Unidos a entrar na Segunda Guerra Mundial.'
        },
        {
            location: 'Nova York, EUA',
            coords: { x: 25, y: 35 },
            country: 'Estados Unidos',
            question: 'Qual monumento icônico foi um presente da França aos EUA em 1886?',
            options: [
                'Empire State Building',
                'Estátua da Liberdade',
                'Ponte do Brooklyn',
                'Lincoln Memorial'
            ],
            correct: 1,
            fact: 'A Estátua da Liberdade foi presente da França para celebrar a amizade entre os dois países e a independência americana.'
        },
        {
            location: 'Washington D.C., EUA',
            coords: { x: 26, y: 37 },
            country: 'Estados Unidos',
            question: 'Em que cidade está localizada a Casa Branca?',
            options: [
                'Nova York',
                'Los Angeles',
                'Washington D.C.',
                'Chicago'
            ],
            correct: 2,
            fact: 'Washington D.C. é a capital dos Estados Unidos e sede do governo federal desde 1800.'
        },
        {
            location: 'Cidade do México, México',
            coords: { x: 22, y: 48 },
            country: 'México',
            question: 'Qual civilização antiga construiu a pirâmide de Teotihuacan no México?',
            options: [
                'Astecas',
                'Maias',
                'Teotihuacanos',
                'Olmecas'
            ],
            correct: 2,
            fact: 'Teotihuacan foi uma das maiores cidades da América pré-colombiana, com a famosa Pirâmide do Sol construída por volta de 200 d.C.'
        },
        {
            location: 'Havana, Cuba',
            coords: { x: 27, y: 46 },
            country: 'Cuba',
            question: 'Em que ano ocorreu a Revolução Cubana liderada por Fidel Castro?',
            options: [
                '1945',
                '1959',
                '1965',
                '1970'
            ],
            correct: 1,
            fact: 'A Revolução Cubana de 1959 derrubou o ditador Fulgencio Batista e estabeleceu um governo socialista liderado por Fidel Castro.'
        }
    ],
    'América do Sul': [
        {
            location: 'Machu Picchu, Peru',
            coords: { x: 28, y: 70 },
            country: 'Peru',
            question: 'Qual civilização construiu a cidade de Machu Picchu?',
            options: [
                'Astecas',
                'Maias',
                'Incas',
                'Olmecas'
            ],
            correct: 2,
            fact: 'Machu Picchu foi construída pelos Incas no século XV e é considerada uma das Sete Maravilhas do Mundo Moderno.'
        },
        {
            location: 'Rio de Janeiro, Brasil',
            coords: { x: 38, y: 72 },
            country: 'Brasil',
            question: 'Em que ano o Brasil se tornou independente de Portugal?',
            options: [
                '1500',
                '1822',
                '1889',
                '1900'
            ],
            correct: 1,
            fact: 'Dom Pedro I proclamou a independência do Brasil em 7 de setembro de 1822 às margens do rio Ipiranga.'
        },
        {
            location: 'Buenos Aires, Argentina',
            coords: { x: 32, y: 82 },
            country: 'Argentina',
            question: 'Qual é a capital da Argentina?',
            options: [
                'São Paulo',
                'Buenos Aires',
                'Montevidéu',
                'Santiago'
            ],
            correct: 1,
            fact: 'Buenos Aires é a capital da Argentina desde 1880 e é conhecida como a "Paris da América do Sul".'
        },
        {
            location: 'Ilhas Galápagos, Equador',
            coords: { x: 23, y: 62 },
            country: 'Equador',
            question: 'Qual cientista desenvolveu a teoria da evolução estudando as Ilhas Galápagos?',
            options: [
                'Isaac Newton',
                'Albert Einstein',
                'Charles Darwin',
                'Galileu Galilei'
            ],
            correct: 2,
            fact: 'Charles Darwin visitou as Galápagos em 1835 e suas observações sobre as espécies locais foram fundamentais para sua teoria da evolução.'
        }
    ],
    'Europa': [
        {
            location: 'Paris, França',
            coords: { x: 50, y: 30 },
            country: 'França',
            question: 'Que evento histórico começou em Paris em 14 de julho de 1789?',
            options: [
                'Primeira Guerra Mundial',
                'Revolução Francesa',
                'Renascimento',
                'Iluminismo'
            ],
            correct: 1,
            fact: 'A Queda da Bastilha marcou o início da Revolução Francesa, transformando a França e inspirando revoluções pelo mundo.'
        },
        {
            location: 'Berlim, Alemanha',
            coords: { x: 52, y: 28 },
            country: 'Alemanha',
            question: 'Em que ano caiu o Muro de Berlim?',
            options: [
                '1961',
                '1989',
                '1945',
                '1991'
            ],
            correct: 1,
            fact: 'A queda do Muro de Berlim em 9 de novembro de 1989 simbolizou o fim da Guerra Fria e a reunificação da Alemanha.'
        },
        {
            location: 'Londres, Inglaterra',
            coords: { x: 49, y: 27 },
            country: 'Reino Unido',
            question: 'Qual é o famoso relógio localizado em Londres?',
            options: [
                'Big Ben',
                'Torre Eiffel',
                'Coliseu',
                'Partenon'
            ],
            correct: 0,
            fact: 'Big Ben é na verdade o nome do sino dentro da torre do relógio do Palácio de Westminster, mas o nome se tornou sinônimo de toda a torre.'
        },
        {
            location: 'Roma, Itália',
            coords: { x: 52, y: 34 },
            country: 'Itália',
            question: 'Qual famoso anfiteatro romano foi construído no século I d.C.?',
            options: [
                'Partenon',
                'Acrópole',
                'Coliseu',
                'Circus Maximus'
            ],
            correct: 2,
            fact: 'O Coliseu Romano podia abrigar entre 50.000 e 80.000 espectadores e era usado para lutas de gladiadores e eventos públicos.'
        },
        {
            location: 'Atenas, Grécia',
            coords: { x: 55, y: 36 },
            country: 'Grécia',
            question: 'Qual templo grego dedicado à deusa Atena está localizado na Acrópole?',
            options: [
                'Partenon',
                'Coliseu',
                'Panteão',
                'Templo de Zeus'
            ],
            correct: 0,
            fact: 'O Partenon foi construído entre 447 e 432 a.C. e é um dos símbolos mais importantes da Grécia Antiga e da democracia.'
        },
        {
            location: 'Moscou, Rússia',
            coords: { x: 60, y: 22 },
            country: 'Rússia',
            question: 'Qual é a famosa praça no centro de Moscou, ao lado do Kremlin?',
            options: [
                'Praça Vermelha',
                'Times Square',
                'Trafalgar Square',
                'Praça Tiananmen'
            ],
            correct: 0,
            fact: 'A Praça Vermelha tem sido o cenário de muitos eventos históricos importantes e abriga o Mausoléu de Lênin e a Catedral de São Basílio.'
        }
    ],
    'África': [
        {
            location: 'Cairo, Egito',
            coords: { x: 54, y: 48 },
            country: 'Egito',
            question: 'Qual estrutura antiga encontra-se em Gizé, perto do Cairo?',
            options: [
                'Coliseu',
                'Muralha da China',
                'Pirâmides e a Esfinge',
                'Stonehenge'
            ],
            correct: 2,
            fact: 'As Pirâmides de Gizé são as únicas das Sete Maravilhas do Mundo Antigo que ainda existem, construídas há mais de 4.500 anos.'
        },
        {
            location: 'Cidade do Cabo, África do Sul',
            coords: { x: 54, y: 82 },
            country: 'África do Sul',
            question: 'Qual líder anti-apartheid foi presidente da África do Sul de 1994 a 1999?',
            options: [
                'Desmond Tutu',
                'Nelson Mandela',
                'F.W. de Klerk',
                'Thabo Mbeki'
            ],
            correct: 1,
            fact: 'Nelson Mandela passou 27 anos preso por lutar contra o apartheid e se tornou o primeiro presidente negro da África do Sul em 1994.'
        },
        {
            location: 'Marrakech, Marrocos',
            coords: { x: 48, y: 46 },
            country: 'Marrocos',
            question: 'Em que continente está localizado o Marrocos?',
            options: [
                'Ásia',
                'Europa',
                'África',
                'América do Sul'
            ],
            correct: 2,
            fact: 'O Marrocos está no norte da África e é separado da Europa pelo Estreito de Gibraltar, que tem apenas 14 km de largura.'
        }
    ],
    'Ásia': [
        {
            location: 'Hiroshima, Japão',
            coords: { x: 80, y: 42 },
            country: 'Japão',
            question: 'Que evento trágico ocorreu em Hiroshima em 6 de agosto de 1945?',
            options: [
                'Grande terremoto',
                'Tsunami devastador',
                'Primeira bomba atômica em guerra',
                'Erupção vulcânica'
            ],
            correct: 2,
            fact: 'Hiroshima foi a primeira cidade a sofrer um ataque nuclear na história, seguida por Nagasaki três dias depois, levando ao fim da Segunda Guerra Mundial.'
        },
        {
            location: 'Grande Muralha, China',
            coords: { x: 72, y: 35 },
            country: 'China',
            question: 'Aproximadamente qual o comprimento da Grande Muralha da China?',
            options: [
                '2.000 km',
                '6.000 km',
                '21.000 km',
                '50.000 km'
            ],
            correct: 2,
            fact: 'A Grande Muralha tem mais de 21.000 km de extensão total, construída ao longo de séculos para proteger a China de invasões.'
        },
        {
            location: 'Pequim, China',
            coords: { x: 73, y: 33 },
            country: 'China',
            question: 'Qual é a capital da China?',
            options: [
                'Xangai',
                'Hong Kong',
                'Pequim',
                'Guangzhou'
            ],
            correct: 2,
            fact: 'Pequim é a capital da China há mais de 800 anos e abriga a histórica Cidade Proibida, residência de 24 imperadores.'
        },
        {
            location: 'Taj Mahal, Índia',
            coords: { x: 68, y: 47 },
            country: 'Índia',
            question: 'O Taj Mahal foi construído como um monumento para quem?',
            options: [
                'Um imperador',
                'Um deus hindu',
                'A esposa do imperador',
                'Um templo budista'
            ],
            correct: 2,
            fact: 'O Taj Mahal foi construído pelo imperador Shah Jahan em memória de sua esposa Mumtaz Mahal, que morreu em 1631.'
        },
        {
            location: 'Angkor Wat, Camboja',
            coords: { x: 75, y: 52 },
            country: 'Camboja',
            question: 'Angkor Wat é o maior monumento religioso do mundo. Qual religião ele representa?',
            options: [
                'Budismo',
                'Hinduísmo (depois Budismo)',
                'Islamismo',
                'Cristianismo'
            ],
            correct: 1,
            fact: 'Angkor Wat foi originalmente construído como um templo hindu no século XII, mas gradualmente se transformou em um templo budista.'
        },
        {
            location: 'Jerusalém, Israel',
            coords: { x: 57, y: 47 },
            country: 'Israel',
            question: 'Jerusalém é considerada cidade sagrada para quantas religiões?',
            options: [
                'Uma',
                'Duas',
                'Três',
                'Quatro'
            ],
            correct: 2,
            fact: 'Jerusalém é sagrada para o Judaísmo, Cristianismo e Islamismo, tornando-a uma das cidades mais importantes da história religiosa.'
        }
    ],
    'Oceania': [
        {
            location: 'Sydney, Austrália',
            coords: { x: 85, y: 80 },
            country: 'Austrália',
            question: 'Qual povo habitava a Austrália há mais de 65.000 anos?',
            options: [
                'Maoris',
                'Aborígenes',
                'Polinésios',
                'Melanésios'
            ],
            correct: 1,
            fact: 'Os aborígenes australianos possuem uma das culturas contínuas mais antigas do mundo, habitando o continente há pelo menos 65.000 anos.'
        },
        {
            location: 'Auckland, Nova Zelândia',
            coords: { x: 92, y: 84 },
            country: 'Nova Zelândia',
            question: 'Qual é o povo nativo da Nova Zelândia?',
            options: [
                'Aborígenes',
                'Maoris',
                'Samoanos',
                'Taitianos'
            ],
            correct: 1,
            fact: 'Os Maoris chegaram à Nova Zelândia por volta do ano 1300 d.C. vindos da Polinésia e desenvolveram uma cultura rica e única.'
        },
        {
            location: 'Ilha de Páscoa, Chile',
            coords: { x: 20, y: 78 },
            country: 'Chile (Oceania)',
            question: 'Que famosas estátuas gigantes são encontradas na Ilha de Páscoa?',
            options: [
                'Moais',
                'Pirâmides',
                'Esfinges',
                'Totens'
            ],
            correct: 0,
            fact: 'Os Moais são estátuas monolíticas criadas pelo povo Rapa Nui entre 1400 e 1650 d.C. Existem quase 1.000 estátuas na ilha.'
        }
    ]
};

// Cores dos jogadores
const PLAYER_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#E63946', '#457B9D', '#F4A261', '#2A9D8F', '#E76F51',
    '#8338EC', '#FF006E', '#FB5607', '#FFBE0B', '#3A86FF'
];

// Estado do jogo
let gameState = {
    screen: 'menu', // menu, playing, question, teacher
    numPlayers: 2,
    players: [],
    currentPlayer: 0,
    questions: JSON.parse(JSON.stringify(INITIAL_QUESTIONS)),
    currentQuestion: null,
    selectedAnswer: null,
    showFact: false
};

// Inicializar app
function init() {
    render();
}

// Renderizar tela atual
function render() {
    const app = document.getElementById('app');
    
    switch(gameState.screen) {
        case 'menu':
            app.innerHTML = renderMenu();
            break;
        case 'playing':
            app.innerHTML = renderGame();
            break;
        case 'question':
            app.innerHTML = renderQuestion();
            break;
        case 'teacher':
            app.innerHTML = renderTeacher();
            break;
    }
}

// Renderizar menu
function renderMenu() {
    return `
        <div class="menu-container">
            <div class="menu-card animate-fadeIn">
                <div class="menu-header">
                    <div class="globe-icon">🌍</div>
                    <h1>Explorador Mundial</h1>
                    <p>Aventura Educativa de Geografia e História</p>
                </div>
                
                <div class="menu-content">
                    <div class="config-section">
                        <h2>
                            <span>👥</span>
                            Configurar Jogo
                        </h2>
                        <label>Número de Jogadores (1-20)</label>
                        <input 
                            type="number" 
                            id="numPlayers" 
                            min="1" 
                            max="20" 
                            value="${gameState.numPlayers}"
                            onchange="gameState.numPlayers = Math.min(20, Math.max(1, parseInt(this.value) || 1))"
                        >
                    </div>

                    <button class="btn-primary" onclick="startGame()">
                        <span>▶</span>
                        Iniciar Aventura
                    </button>

                    <button class="btn-secondary" onclick="openTeacher()">
                        <span>⚙</span>
                        Modo Professor
                    </button>

                    <div class="info-box">
                        <h3>
                            <span>📖</span>
                            Como Jogar
                        </h3>
                        <ul>
                            <li>🌍 Viaje pelo mundo respondendo perguntas</li>
                            <li>📍 Cada jogador começa em um local aleatório</li>
                            <li>❓ Responda sobre geografia e história</li>
                            <li>⭐ Ganhe 100 pontos por resposta correta</li>
                            <li>🏆 Aprenda fatos incríveis sobre cada lugar</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Renderizar tela de jogo
function renderGame() {
    return `
        <div class="game-container">
            <div class="game-wrapper">
                ${renderScoreboard()}
                ${renderCurrentTurn()}
                ${renderMap()}
            </div>
        </div>
    `;
}

// Renderizar placar
function renderScoreboard() {
    return `
        <div class="scoreboard">
            <div class="scoreboard-header">
                <h2 class="scoreboard-title">
                    <span>🏆</span>
                    Placar
                </h2>
                <button class="btn-exit" onclick="exitGame()">Sair</button>
            </div>
            <div class="players-grid">
                ${gameState.players.map((player, idx) => `
                    <div class="player-card ${idx === gameState.currentPlayer ? 'active' : ''}" 
                         style="background-color: ${player.color}20; border-color: ${idx === gameState.currentPlayer ? '#fbbf24' : player.color}">
                        <div class="player-header">
                            <div class="player-dot" style="background-color: ${player.color}"></div>
                            <div class="player-name">${player.name}</div>
                        </div>
                        <div class="player-score" style="color: ${player.color}">${player.score}</div>
                        <div class="player-stats">${player.correctAnswers}/${player.totalQuestions} corretas</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Renderizar turno atual
function renderCurrentTurn() {
    const player = gameState.players[gameState.currentPlayer];
    return `
        <div class="current-turn">
            <div class="turn-content">
                <div class="turn-player-info">
                    <div class="turn-player-avatar" style="background-color: ${player.color}">
                        ${player.id}
                    </div>
                    <div class="turn-player-details">
                        <div class="turn-label">É a vez de</div>
                        <div class="turn-player-name">${player.name}</div>
                        <div class="turn-location">📍 ${player.location} (${player.country})</div>
                    </div>
                </div>
                <button class="btn-travel" onclick="movePlayer()">
                    <span>📍</span>
                    Viajar
                </button>
            </div>
        </div>
    `;
}

// Renderizar mapa
function renderMap() {
    const player = gameState.players[gameState.currentPlayer];
    
    // Criar linhas de caminho para o jogador atual se houver histórico
    let pathLines = '';
    if (player.previousPosition) {
        pathLines = `
            <svg class="map-path-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5;">
                <line 
                    x1="${player.previousPosition.x}%" 
                    y1="${player.previousPosition.y}%" 
                    x2="${player.position.x}%" 
                    y2="${player.position.y}%" 
                    stroke="${player.color}" 
                    stroke-width="3" 
                    stroke-dasharray="5,5"
                    opacity="0.7"
                />
                <circle 
                    cx="${player.previousPosition.x}%" 
                    cy="${player.previousPosition.y}%" 
                    r="4" 
                    fill="${player.color}" 
                    opacity="0.5"
                />
            </svg>
        `;
    }
    
    return `
        <div class="map-container">
            <div class="map-wrapper">
                <img src="worldmap.png" alt="Mapa Múndi" class="map-image">
                ${pathLines}
                ${gameState.players.map((p, idx) => `
                    <div class="player-marker ${idx === gameState.currentPlayer ? 'active animate-bounce' : ''}" 
                         style="left: ${p.position.x}%; top: ${p.position.y}%">
                        <div class="marker-circle" style="background-color: ${p.color}">
                            ${p.id}
                        </div>
                        ${idx === gameState.currentPlayer ? `
                            <div class="marker-label" style="border-color: ${p.color}">
                                ${p.name}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Renderizar tela de pergunta
function renderQuestion() {
    const player = gameState.players[gameState.currentPlayer];
    const q = gameState.currentQuestion;
    const isCorrect = gameState.selectedAnswer === q.correct;
    
    return `
        <div class="question-container">
            <div class="question-wrapper animate-fadeIn">
                <div class="question-player-info">
                    <div class="question-player-left">
                        <div class="question-avatar" style="background-color: ${player.color}">
                            ${player.id}
                        </div>
                        <div>
                            <div class="question-player-name">${player.name}</div>
                            <div class="question-player-score">Pontuação: ${player.score}</div>
                        </div>
                    </div>
                    <div class="question-location">
                        <div class="location-label">Você está em</div>
                        <div class="location-name">📍 ${q.location}</div>
                        <div class="location-country">${q.country}</div>
                    </div>
                </div>

                <div class="question-content">
                    <div class="question-badge">❓ Pergunta de Geografia e História</div>
                    <h3 class="question-text">${q.question}</h3>

                    <div class="options-grid">
                        ${q.options.map((option, idx) => `
                            <button 
                                class="option-button ${gameState.selectedAnswer === idx ? 'selected' : ''} ${
                                    gameState.showFact ? (
                                        idx === q.correct ? 'correct' : 
                                        idx === gameState.selectedAnswer ? 'incorrect' : ''
                                    ) : ''
                                }"
                                onclick="selectAnswer(${idx})"
                                ${gameState.showFact ? 'disabled' : ''}
                            >
                                <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                                ${option}
                                ${gameState.showFact && idx === q.correct ? '<span class="option-icon">✓</span>' : ''}
                                ${gameState.showFact && idx === gameState.selectedAnswer && idx !== q.correct ? '<span class="option-icon">✗</span>' : ''}
                            </button>
                        `).join('')}
                    </div>

                    ${!gameState.showFact && gameState.selectedAnswer !== null ? `
                        <button class="btn-confirm" onclick="checkAnswer()">
                            Confirmar Resposta
                        </button>
                    ` : ''}

                    ${gameState.showFact ? `
                        <div class="result-box ${isCorrect ? 'correct' : 'incorrect'}">
                            <div class="result-header">
                                <span class="result-icon">${isCorrect ? '🏆' : '⭐'}</span>
                                <span class="result-title">
                                    ${isCorrect ? 'Correto! +100 pontos!' : 'Ops! Continue tentando!'}
                                </span>
                            </div>
                            <div class="fact-box">
                                <div class="fact-label">
                                    <span>📚</span>
                                    Você Sabia?
                                </div>
                                <p class="fact-text">${q.fact}</p>
                            </div>
                        </div>

                        <button class="btn-next" onclick="nextPlayer()">
                            Próximo Jogador →
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// Renderizar modo professor
function renderTeacher() {
    const regions = Object.keys(gameState.questions);
    const stats = {};
    regions.forEach(region => {
        stats[region] = gameState.questions[region].length;
    });

    return `
        <div class="teacher-container">
            <div class="teacher-wrapper">
                <div class="teacher-card animate-fadeIn">
                    <div class="teacher-header">
                        <h2 class="teacher-title">
                            <span>✏️</span>
                            Modo Professor - Adicionar Perguntas
                        </h2>
                    </div>

                    <div class="teacher-content">
                        <form id="teacherForm" onsubmit="addQuestion(event)">
                            <div class="form-group">
                                <label class="form-label">Região do Mundo</label>
                                <select class="form-select" id="region">
                                    ${regions.map(region => `<option value="${region}">${region}</option>`).join('')}
                                </select>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Local/Cidade</label>
                                    <input type="text" class="form-input" id="location" placeholder="Ex: Paris, França" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">País</label>
                                    <input type="text" class="form-input" id="country" placeholder="Ex: França" required>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Posição X (0-100)</label>
                                    <input type="number" class="form-input" id="coordX" min="0" max="100" value="50" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Posição Y (0-100)</label>
                                    <input type="number" class="form-input" id="coordY" min="0" max="100" value="50" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Pergunta</label>
                                <textarea class="form-textarea" id="question" rows="3" placeholder="Digite a pergunta sobre este local..." required></textarea>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Opções de Resposta</label>
                                ${[0, 1, 2, 3].map(idx => `
                                    <div class="option-row">
                                        <input type="radio" name="correct" value="${idx}" class="option-radio" ${idx === 0 ? 'checked' : ''} required>
                                        <input type="text" class="form-input option-input" id="option${idx}" placeholder="Opção ${idx + 1}" required>
                                    </div>
                                `).join('')}
                                <p class="option-hint">✓ Marque a opção correta</p>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Fato Histórico/Curiosidade</label>
                                <textarea class="form-textarea" id="fact" rows="3" placeholder="Adicione um fato interessante sobre este local..." required></textarea>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn-add">
                                    <span>➕</span>
                                    Adicionar Pergunta
                                </button>
                                <button type="button" class="btn-back" onclick="closeTeacher()">
                                    Voltar
                                </button>
                            </div>
                        </form>

                        <div class="stats-box">
                            <h3 class="stats-title">📊 Estatísticas do Banco de Dados</h3>
                            <div class="stats-grid">
                                ${regions.map(region => `
                                    <div class="stat-item">
                                        <div class="stat-value">${stats[region]}</div>
                                        <div class="stat-label">${region}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Iniciar jogo
function startGame() {
    const allQuestions = Object.values(gameState.questions).flat();
    gameState.players = [];
    
    for (let i = 0; i < gameState.numPlayers; i++) {
        const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        gameState.players.push({
            id: i + 1,
            name: `Jogador ${i + 1}`,
            color: PLAYER_COLORS[i % PLAYER_COLORS.length],
            position: { ...randomQuestion.coords },
            score: 0,
            correctAnswers: 0,
            totalQuestions: 0,
            location: randomQuestion.location,
            country: randomQuestion.country
        });
    }
    
    gameState.currentPlayer = 0;
    gameState.screen = 'playing';
    render();
}

// Mover jogador
function movePlayer() {
    const allQuestions = Object.values(gameState.questions).flat();
    const player = gameState.players[gameState.currentPlayer];
    
    // Salvar posição anterior para mostrar a rota
    player.previousPosition = { ...player.position };
    
    // Encontrar perguntas próximas (dentro de um raio de distância)
    const nearbyQuestions = allQuestions.filter(q => {
        const distance = Math.sqrt(
            Math.pow(q.coords.x - player.position.x, 2) + 
            Math.pow(q.coords.y - player.position.y, 2)
        );
        return distance <= 30 && distance > 0; // Raio de 30 unidades, mas não a mesma posição
    });
    
    // Se não houver perguntas próximas, permitir qualquer pergunta
    const availableQuestions = nearbyQuestions.length > 0 ? nearbyQuestions : allQuestions;
    
    // Selecionar uma pergunta aleatória das disponíveis
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    player.position = { ...randomQuestion.coords };
    player.location = randomQuestion.location;
    player.country = randomQuestion.country;
    
    gameState.currentQuestion = randomQuestion;
    gameState.selectedAnswer = null;
    gameState.showFact = false;
    gameState.screen = 'question';
    render();
}

// Selecionar resposta
function selectAnswer(index) {
    if (!gameState.showFact) {
        gameState.selectedAnswer = index;
        render();
    }
}

// Verificar resposta
function checkAnswer() {
    const isCorrect = gameState.selectedAnswer === gameState.currentQuestion.correct;
    const player = gameState.players[gameState.currentPlayer];
    
    player.score += isCorrect ? 100 : 0;
    player.correctAnswers += isCorrect ? 1 : 0;
    player.totalQuestions += 1;
    
    gameState.showFact = true;
    render();
}

// Próximo jogador
function nextPlayer() {
    gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.numPlayers;
    gameState.screen = 'playing';
    gameState.currentQuestion = null;
    gameState.selectedAnswer = null;
    gameState.showFact = false;
    render();
}

// Sair do jogo
function exitGame() {
    if (confirm('Deseja realmente sair do jogo?')) {
        gameState.screen = 'menu';
        gameState.players = [];
        gameState.currentPlayer = 0;
        render();
    }
}

// Abrir modo professor
function openTeacher() {
    gameState.screen = 'teacher';
    render();
}

// Fechar modo professor
function closeTeacher() {
    gameState.screen = 'menu';
    render();
}

// Adicionar pergunta
function addQuestion(event) {
    event.preventDefault();
    
    const region = document.getElementById('region').value;
    const location = document.getElementById('location').value;
    const country = document.getElementById('country').value;
    const coordX = parseInt(document.getElementById('coordX').value);
    const coordY = parseInt(document.getElementById('coordY').value);
    const question = document.getElementById('question').value;
    const options = [
        document.getElementById('option0').value,
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value
    ];
    const correct = parseInt(document.querySelector('input[name="correct"]:checked').value);
    const fact = document.getElementById('fact').value;
    
    const newQuestion = {
        location,
        coords: { x: coordX, y: coordY },
        country,
        question,
        options,
        correct,
        fact
    };
    
    if (!gameState.questions[region]) {
        gameState.questions[region] = [];
    }
    
    gameState.questions[region].push(newQuestion);
    
    alert('Pergunta adicionada com sucesso!');
    document.getElementById('teacherForm').reset();
    render();
}

// Iniciar quando a página carregar
window.addEventListener('DOMContentLoaded', init);
