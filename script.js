// Objeto de Estado - Primeira declaração conforme especificado
let gameState = {
    currentScreen: '#welcome-screen',
    score: 0,
    currentQuestionIndex: 0,
    startTime: null,
    endTime: null,
    playerName: '',
    questions: [
        {
            question: "Qual é o período ideal para a colheita do café arábica no Brasil?",
            options: [
                "Janeiro a Março",
                "Maio a Agosto", 
                "Setembro a Dezembro",
                "Abril a Junho"
            ],
            correctAnswer: 1,
            explanation: "O período ideal para colheita do café arábica no Brasil é de maio a agosto, quando os grãos estão maduros e com melhor qualidade."
        },
        {
            question: "Qual nutriente é mais importante para o desenvolvimento das raízes do cafeeiro?",
            options: [
                "Nitrogênio (N)",
                "Fósforo (P)",
                "Potássio (K)",
                "Cálcio (Ca)"
            ],
            correctAnswer: 1,
            explanation: "O fósforo (P) é essencial para o desenvolvimento das raízes, florescimento e formação dos grãos do café."
        },
        {
            question: "Qual é a temperatura ideal para o cultivo do café arábica?",
            options: [
                "15-20°C",
                "20-25°C",
                "25-30°C",
                "30-35°C"
            ],
            correctAnswer: 1,
            explanation: "A temperatura ideal para o café arábica é entre 20-25°C, proporcionando melhor desenvolvimento e qualidade dos grãos."
        },
        {
            question: "Qual prática é fundamental para manter a produtividade do cafezal?",
            options: [
                "Poda anual",
                "Adubação foliar",
                "Irrigação constante",
                "Controle de pragas"
            ],
            correctAnswer: 0,
            explanation: "A poda anual é fundamental para renovar os ramos produtivos e manter a produtividade do cafezal ao longo dos anos."
        },
        {
            question: "Qual é o pH ideal do solo para o cultivo do café?",
            options: [
                "4.0-5.0",
                "5.5-6.5",
                "6.5-7.5",
                "7.5-8.5"
            ],
            correctAnswer: 1,
            explanation: "O pH ideal do solo para o café é entre 5.5-6.5, proporcionando melhor disponibilidade de nutrientes para a planta."
        }
    ]
};

// Variáveis globais
let timerTimeout;
let timerInterval;
let currentTimerProgress;
let rouletteFinalAngle;
let selectedPrize;
let isRouletteSpinning = false;

// --- NOVO TIMER MINIMALISTA ---
const TIMER_DURATION = 15; // segundos
let timerStart;
let timerRunning = false;

function resetTimer() {
    const circle = document.querySelector('.timer-fg');
    const number = document.getElementById('timer-seconds');
    const circumference = 2 * Math.PI * 45;
    if (timerInterval) clearInterval(timerInterval);
    timerRunning = false;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = 0;
    number.textContent = TIMER_DURATION;
}

function startTimer() {
    const circle = document.querySelector('.timer-fg');
    const number = document.getElementById('timer-seconds');
    const circumference = 2 * Math.PI * 45;
    let lastValue = TIMER_DURATION;
    if (timerInterval) clearInterval(timerInterval);
    timerStart = Date.now();
    timerRunning = true;
    function update() {
        const elapsed = (Date.now() - timerStart) / 1000;
        const remaining = Math.max(0, TIMER_DURATION - elapsed);
        const progress = remaining / TIMER_DURATION;
        circle.style.strokeDashoffset = circumference * (1 - progress);
        const display = Math.ceil(remaining);
        if (display !== lastValue) {
            number.textContent = display;
            lastValue = display;
        }
        if (remaining <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            number.textContent = '0';
            circle.style.strokeDashoffset = circumference;
            // Chama handleAnswer(null) se for o quiz
            if (typeof handleAnswer === 'function') handleAnswer(null);
        }
    }
    timerInterval = setInterval(update, 30);
    update();
}
// --- FIM NOVO TIMER ---

// --- ROLETAS SVG UNIFORME ---
const ROULETTE_COLORS = [
  '#FF6B6B', '#FFA726', '#43A047', '#5C6BC0', '#FFD600', '#29B6F6', '#8D6E63', '#EC407A', '#66BB6A', '#AB47BC'
];

function drawRouletteSVG(prizes, angleOffset = 0) {
  const svg = document.getElementById('roulette-svg');
  if (!svg) return;
  svg.innerHTML = '';
  const cx = 160, cy = 160, r = 140, ir = 60;
  const n = prizes.length;
  const angleStep = 2 * Math.PI / n;
  for (let i = 0; i < n; i++) {
    const startAngle = i * angleStep + angleOffset;
    const endAngle = (i + 1) * angleStep + angleOffset;
    // Path para fatia
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + ir * Math.cos(endAngle);
    const iy1 = cy + ir * Math.sin(endAngle);
    const ix2 = cx + ir * Math.cos(startAngle);
    const iy2 = cy + ir * Math.sin(startAngle);
    const largeArc = angleStep > Math.PI ? 1 : 0;
    const path = [
      `M ${ix2} ${iy2}`,
      `L ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${ir} ${ir} 0 ${largeArc} 0 ${ix2} ${iy2}`,
      'Z'
    ].join(' ');
    const slice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    slice.setAttribute('d', path);
    slice.setAttribute('fill', ROULETTE_COLORS[i % ROULETTE_COLORS.length]);
    svg.appendChild(slice);
    // Texto
    const midAngle = (startAngle + endAngle) / 2;
    const tx = cx + 0.7 * r * Math.cos(midAngle);
    const ty = cy + 0.7 * r * Math.sin(midAngle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', tx);
    text.setAttribute('y', ty);
    text.setAttribute('fill', i % 2 === 0 ? '#fff' : '#222');
    text.setAttribute('font-size', '20');
    text.setAttribute('font-family', 'Montserrat, Arial, sans-serif');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('alignment-baseline', 'middle');
    text.setAttribute('transform', `rotate(${(midAngle * 180 / Math.PI)} ${tx} ${ty})`);
    text.textContent = prizes[i];
    svg.appendChild(text);
  }
}

// Exemplo de integração com o quiz:
function prepareRoulette() {
  // Prêmios do quiz
  const prizes = [
    'Kit 1',
    'Kit 2',
    'Kit 3',
    'Kit 4',
    'Kit 5'
  ];
  drawRouletteSVG(prizes);
}
// --- FIM ROLETAS SVG ---

// Função de inicialização - chamada na carga da página
function init() {
    // Popula o array de perguntas (já está populado acima)
    
    // Mostra a tela de boas-vindas
    showScreen('#welcome-screen');
    
    // Associa os event listeners
    setupEventListeners();
    
    // Inicializa o teclado virtual
    initVirtualKeyboard();
    
    // Remove confete da tela inicial
    const confettiContainer = document.querySelector('.confetti-container');
    if (confettiContainer) {
        confettiContainer.remove();
    }
}

// Função para controlar a visibilidade das telas
function showScreen(screenId) {
    // Esconde todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostra a tela solicitada
    const targetScreen = document.querySelector(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = screenId;
        
        // Atualiza o ranking se for a tela inicial
        if (screenId === '#home-screen') {
            updateRanking();
        }
    }
}

// Função para ir para a tela inicial (botão cancelar)
function goToHome() {
    showScreen('#home-screen');
}

// Função para atualizar o ranking
function updateRanking() {
    const rankingList = document.getElementById('ranking-list');
    const rankings = getRankings();
    
    rankingList.innerHTML = '';
    
    if (rankings.length === 0) {
        rankingList.innerHTML = '<p style="text-align: center; color: #7f8c8d;">Seja o primeiro a participar!</p>';
        return;
    }
    
    rankings.forEach((player, index) => {
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        rankingItem.innerHTML = `
            <span class="ranking-position">${index + 1}º</span>
            <span class="ranking-name">${player.name}</span>
            <span class="ranking-score">${player.score}/5</span>
        `;
        rankingList.appendChild(rankingItem);
    });
}

// Função para obter rankings do localStorage
function getRankings() {
    const rankings = localStorage.getItem('quizRankings');
    return rankings ? JSON.parse(rankings) : [];
}

// Função para salvar rankings no localStorage
function updateRankingStorage() {
    const rankings = getRankings();
    const newPlayer = {
        name: gameState.playerName,
        score: gameState.score,
        time: gameState.endTime - gameState.startTime,
        date: new Date().toISOString()
    };
    
    rankings.push(newPlayer);
    rankings.sort((a, b) => b.score - a.score || a.time - b.time);
    rankings.splice(10); // Mantém apenas os 10 melhores
    
    localStorage.setItem('quizRankings', JSON.stringify(rankings));
}

// Função para iniciar o jogo (vai para tela institucional)
function startGame() {
    showScreen('#institutional-screen');
}

// Função para iniciar o quiz (após tela institucional)
function startQuiz() {
    // Reseta o estado do jogo
    gameState.score = 0;
    gameState.currentQuestionIndex = 0;
    gameState.startTime = new Date();
    
    // Mostra a tela do quiz
    showScreen('#quiz-screen');
    
    // Carrega a primeira pergunta
    loadQuestion();
}

// Função para carregar uma pergunta
function loadQuestion() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    
    // Atualiza o contador de perguntas
    document.getElementById('question-counter').textContent = 
        `Pergunta ${gameState.currentQuestionIndex + 1} de 5`;
    
    // Carrega a pergunta
    document.getElementById('question-text').textContent = question.question;
    
    // Carrega as opções
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, index) => {
        btn.querySelector('.option-text').textContent = question.options[index];
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
    
    // Esconde a explicação e botão de próxima pergunta
    document.getElementById('explanation').style.display = 'none';
    document.getElementById('next-question-btn').style.display = 'none';
    
    // Reseta e inicia o cronômetro
    resetTimer();
    startTimer();
}

// Função para processar a resposta do usuário
function handleAnswer(selectedOption) {
    // Cancela os timers
    if (timerTimeout) {
        clearTimeout(timerTimeout);
        timerTimeout = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Desabilita todos os botões
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => btn.disabled = true);
    
    const question = gameState.questions[gameState.currentQuestionIndex];
    const correctAnswer = question.correctAnswer;
    
    // Verifica se a resposta está correta
    if (selectedOption === correctAnswer) {
        // Resposta correta
        gameState.score++;
        optionButtons[selectedOption].classList.add('correct');
        playSound('correct-sound');
    } else {
        // Resposta errada ou tempo esgotado
        if (selectedOption !== null) {
            optionButtons[selectedOption].classList.add('wrong');
        }
        optionButtons[correctAnswer].classList.add('correct');
        playSound('wrong-sound');
    }
    
    // Mostra a explicação e botão de próxima pergunta
    const explanation = document.getElementById('explanation');
    const explanationText = document.getElementById('explanation-text');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    
    explanationText.textContent = question.explanation;
    explanation.style.display = 'block';
    nextQuestionBtn.style.display = 'block';
    
    // Função para ir para a próxima pergunta
    const goToNextQuestion = () => {
        gameState.currentQuestionIndex++;
        
        if (gameState.currentQuestionIndex < 5) {
            loadQuestion();
        } else {
            showResult();
        }
    };
    
    // Event listener para o botão de próxima pergunta
    nextQuestionBtn.onclick = goToNextQuestion;
    
    // Aguarda 8 segundos e vai para a próxima pergunta automaticamente
    setTimeout(() => {
        if (gameState.currentQuestionIndex < 5) {
            goToNextQuestion();
        }
    }, 8000);
}

// Função para mostrar o resultado
function showResult() {
    // Registra o tempo final
    gameState.endTime = new Date();
    
    // Calcula o tempo total
    const totalTime = Math.round((gameState.endTime - gameState.startTime) / 1000);
    
    // Mostra a tela de resultado
    showScreen('#result-screen');
    
    // Popula os dados
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('total-time').textContent = totalTime;
    
    // Ativa a animação de confetes
    createConfetti();
}

// Função para criar confetes
function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = '';
    
    const colors = ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confettiContainer.appendChild(confetti);
    }
}

// Função para salvar dados e prosseguir
function saveAndProceed() {
    const playerName = document.getElementById('player-name').value.trim();
    
    // Validação do nome
    if (playerName.length < 3) {
        document.getElementById('player-name').classList.add('error');
        return;
    }
    
    // Remove erro se existir
    document.getElementById('player-name').classList.remove('error');
    
    // Salva os dados
    gameState.playerName = playerName;
    
    // Atualiza o ranking
    updateRankingStorage();
    
    // Vai para a roleta
    showScreen('#roulette-screen');
    prepareRoulette();
}

// Função para girar a roleta
function spinRoulette() {
    if (isRouletteSpinning) {
        return; // Evita múltiplos cliques
    }
    
    const roulette = document.getElementById('roulette');
    const spinBtn = document.getElementById('spin-btn');
    
    // Marca como girando
    isRouletteSpinning = true;
    
    // Desabilita o botão
    spinBtn.disabled = true;
    
    // Toca o som
    playSound('spin-sound');
    
    // Aplica a rotação
    roulette.style.transform = `rotate(${rouletteFinalAngle}deg)`;
    
    // Adiciona listener para o fim da animação
    const onTransitionEnd = function() {
        roulette.removeEventListener('transitionend', onTransitionEnd);
        
        // Pequeno delay para garantir que a animação terminou
        setTimeout(() => {
            isRouletteSpinning = false;
            showPrize();
        }, 500);
    };
    
    roulette.addEventListener('transitionend', onTransitionEnd, { once: true });
    
    // Fallback: se por algum motivo o transitionend não disparar
    setTimeout(() => {
        if (isRouletteSpinning) {
            isRouletteSpinning = false;
            showPrize();
        }
    }, 5000); // 5 segundos de timeout
}

// Função para mostrar o prêmio
function showPrize() {
    showScreen('#prize-screen');
    
    // Popula os dados do prêmio
    document.getElementById('player-name-display').textContent = gameState.playerName;
    document.getElementById('prize-name').textContent = selectedPrize.name;
    document.getElementById('prize-description').textContent = selectedPrize.description;
}

// Função para resetar o jogo
function resetGame() {
    // Reseta o estado do jogo
    gameState.currentScreen = '#welcome-screen';
    gameState.score = 0;
    gameState.currentQuestionIndex = 0;
    gameState.startTime = null;
    gameState.endTime = null;
    gameState.playerName = '';
    isRouletteSpinning = false;
    
    // Limpa os campos do formulário
    document.getElementById('player-name').value = '';
    document.getElementById('player-name').classList.remove('error');
    
    // Remove classes de estado da UI
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
    
    // Esconde elementos temporários
    document.getElementById('explanation').style.display = 'none';
    
    // Para a animação de confetes
    document.getElementById('confetti-container').innerHTML = '';
    
    // Reseta a roleta
    const roulette = document.getElementById('roulette');
    roulette.style.transform = 'rotate(0deg)';
    
    // Cancela timers se existirem
    if (timerTimeout) {
        clearTimeout(timerTimeout);
        timerTimeout = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Vai para a tela inicial
    showScreen('#home-screen');
    updateRanking();
}

// Função para tocar sons
function playSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Erro ao tocar som:', e));
    }
}

// Função para inicializar o teclado virtual
function initVirtualKeyboard() {
    const keys = document.querySelectorAll('.key');
    const input = document.getElementById('player-name');
    
    keys.forEach(key => {
        key.addEventListener('click', () => {
            const keyValue = key.dataset.key;
            
            if (keyValue === 'backspace') {
                input.value = input.value.slice(0, -1);
            } else if (keyValue === 'clear') {
                input.value = '';
            } else if (keyValue === ' ') {
                input.value += ' ';
            } else {
                input.value += keyValue;
            }
            
            // Remove erro se existir
            input.classList.remove('error');
        });
    });
}

// Função para configurar event listeners
function setupEventListeners() {
    // Botão de começar o desafio
    document.getElementById('start-challenge-btn').onclick = () => {
        showScreen('#home-screen');
    };
    
    // Botão de participar (vai para tela institucional)
    document.getElementById('participate-btn').onclick = startGame;
    
    // Botão de iniciar quiz (após tela institucional)
    document.getElementById('start-quiz-btn').onclick = startQuiz;
    
    // Botões de opção do quiz
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.onclick = () => {
            const selectedOption = parseInt(btn.dataset.option);
            handleAnswer(selectedOption);
        };
    });
    
    // Botão de salvar e girar roleta
    document.getElementById('save-and-spin-btn').onclick = saveAndProceed;
    
    // Botão de girar roleta
    document.getElementById('spin-btn').onclick = spinRoulette;
    
    // Botão de finalizar
    document.getElementById('finish-btn').onclick = () => {
        showScreen('#share-screen');
        // Popula o resumo final
        document.getElementById('summary-score').textContent = gameState.score;
        if (gameState.endTime && gameState.startTime) {
            document.getElementById('summary-time').textContent = Math.round((gameState.endTime - gameState.startTime) / 1000);
        } else {
            document.getElementById('summary-time').textContent = '0';
        }
        document.getElementById('summary-prize').textContent = selectedPrize ? selectedPrize.name : '-';
    };
    
    // Botão de encerrar quiz (volta para tela inicial)
    document.getElementById('restart-btn').onclick = () => {
        showScreen('#home-screen');
        updateRanking();
    };
}

// Inicializa a aplicação quando a página carrega
document.addEventListener('DOMContentLoaded', init); 