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

// Lista de prêmios para a roleta
const ROULETTE_PRIZES = [
    { name: "Kit Fertilizante Premium", description: "Kit completo de fertilizantes para 1 hectare de café" },
    { name: "Consultoria Técnica", description: "1 hora de consultoria técnica especializada" },
    { name: "Amostra Gratuita", description: "Amostra de fertilizante para teste" },
    { name: "Desconto 20%", description: "20% de desconto na próxima compra" },
    { name: "Kit Básico", description: "Kit básico de nutrição para café" }
];

// Variáveis globais
let timerTimeout;
let timerInterval;
let currentTimerProgress;
let rouletteFinalAngle;
let selectedPrize;
let isRouletteSpinning = false;
let isAnswerProcessed = false;

// --- NOVO TIMER MINIMALISTA ---
const TIMER_DURATION = 15; // segundos
let timerStart;
let timerRunning = false;

function resetTimer() {
    const circle = document.querySelector('.timer-fg');
    const number = document.getElementById('timer-seconds');
    if (!circle || !number) return;
    
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
    if (!circle || !number) return;
    
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
            // Chama handleAnswer(null) se for o quiz e não estiver já processando
            if (typeof handleAnswer === 'function' && !isAnswerProcessed) {
                handleAnswer(null);
            }
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
    text.setAttribute('font-size', '16');
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
  const prizes = ROULETTE_PRIZES.map(prize => prize.name);
  drawRouletteSVG(prizes);
  
  // Adiciona transição CSS dinamicamente
  const svg = document.getElementById('roulette-svg');
  if (svg) {
    svg.style.transition = 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
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
    if (!rankingList) {
        console.log('Lista de ranking não encontrada');
        return;
    }
    
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
    isAnswerProcessed = false;
    
    // Mostra a tela do quiz
    showScreen('#quiz-screen');
    
    // Carrega a primeira pergunta
    loadQuestion();
}

// Função para carregar uma pergunta
function loadQuestion() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    
    // Reseta o estado de processamento para nova pergunta
    isAnswerProcessed = false;
    
    // Atualiza o contador de perguntas
    const questionCounter = document.getElementById('question-counter');
    if (questionCounter) {
        questionCounter.textContent = `Pergunta ${gameState.currentQuestionIndex + 1} de 5`;
    }
    
    // Carrega a pergunta
    const questionText = document.getElementById('question-text');
    if (questionText) {
        questionText.textContent = question.question;
    }
    
    // Carrega as opções
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, index) => {
        const optionText = btn.querySelector('.option-text');
        if (optionText) {
            optionText.textContent = question.options[index];
        }
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
    
    // Esconde a explicação e botão de próxima pergunta
    const explanation = document.getElementById('explanation');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    
    if (explanation) explanation.style.display = 'none';
    if (nextQuestionBtn) nextQuestionBtn.style.display = 'none';
    
    // Reseta e inicia o cronômetro
    resetTimer();
    startTimer();
}

// Função para processar a resposta do usuário
function handleAnswer(selectedOption) {
    // Evita processamento duplo
    if (isAnswerProcessed) {
        return;
    }
    isAnswerProcessed = true;
    
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
    
    if (explanationText) explanationText.textContent = question.explanation;
    if (explanation) explanation.style.display = 'block';
    if (nextQuestionBtn) nextQuestionBtn.style.display = 'block';
    
    // Função para ir para a próxima pergunta
    const goToNextQuestion = () => {
        gameState.currentQuestionIndex++;
        isAnswerProcessed = false; // Reseta para próxima pergunta
        
        if (gameState.currentQuestionIndex < 5) {
            loadQuestion();
        } else {
            showResult();
        }
    };
    
    // Event listener para o botão de próxima pergunta
    nextQuestionBtn.onclick = goToNextQuestion;
    
    // Aguarda 10 segundos e vai para a próxima pergunta automaticamente
    // Usa timerTimeout para evitar conflitos
    if (timerTimeout) clearTimeout(timerTimeout);
    timerTimeout = setTimeout(() => {
        if (gameState.currentQuestionIndex < 5) {
            goToNextQuestion();
        }
    }, 10000); // Aumentado para 10 segundos para dar mais tempo
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
    const finalScore = document.getElementById('final-score');
    const totalTimeElement = document.getElementById('total-time');
    
    if (finalScore) finalScore.textContent = gameState.score;
    if (totalTimeElement) totalTimeElement.textContent = totalTime;
    
    // Limpa o campo de nome para nova entrada
    const playerNameInput = document.getElementById('player-name');
    if (playerNameInput) {
        playerNameInput.value = '';
        playerNameInput.classList.remove('error');
    }
    
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
    const playerNameInput = document.getElementById('player-name');
    if (!playerNameInput) {
        console.error('Campo de nome não encontrado');
        return;
    }
    
    const playerName = playerNameInput.value.trim();
    
    // Validação do nome
    if (playerName.length < 3) {
        playerNameInput.classList.add('error');
        return;
    }
    
    // Remove erro se existir
    playerNameInput.classList.remove('error');
    
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
    
    const roulette = document.getElementById('roulette-svg');
    const spinBtn = document.getElementById('spin-btn');
    
    if (!roulette || !spinBtn) {
        console.error('Elementos da roleta não encontrados');
        return;
    }
    
    // Marca como girando
    isRouletteSpinning = true;
    
    // Desabilita o botão
    spinBtn.disabled = true;
    spinBtn.textContent = 'Girando...';
    
    // Toca o som
    playSound('spin-sound');
    
    // Calcula o ângulo final (múltiplas voltas + posição do prêmio)
    const spins = 5 + Math.random() * 5; // 5-10 voltas
    const prizeIndex = Math.floor(Math.random() * ROULETTE_PRIZES.length);
    const prizeAngle = (360 / ROULETTE_PRIZES.length) * prizeIndex;
    rouletteFinalAngle = spins * 360 + prizeAngle;
    
    // Seleciona o prêmio
    selectedPrize = ROULETTE_PRIZES[prizeIndex];
    
    // Aplica a rotação
    roulette.style.transform = `rotate(${rouletteFinalAngle}deg)`;
    
    // Adiciona listener para o fim da animação
    const onTransitionEnd = function() {
        roulette.removeEventListener('transitionend', onTransitionEnd);
        
        // Pequeno delay para garantir que a animação terminou
        setTimeout(() => {
            isRouletteSpinning = false;
            spinBtn.disabled = false;
            spinBtn.textContent = 'Girar a Roleta!';
            showPrize();
        }, 500);
    };
    
    roulette.addEventListener('transitionend', onTransitionEnd, { once: true });
    
    // Fallback: se por algum motivo o transitionend não disparar
    setTimeout(() => {
        if (isRouletteSpinning) {
            isRouletteSpinning = false;
            spinBtn.disabled = false;
            spinBtn.textContent = 'Girar a Roleta!';
            showPrize();
        }
    }, 5000); // 5 segundos de timeout
}

// Função para mostrar o prêmio
function showPrize() {
    showScreen('#prize-screen');
    
    // Popula os dados do prêmio
    document.getElementById('player-name-display').textContent = gameState.playerName;
    
    if (selectedPrize) {
        document.getElementById('prize-name').textContent = selectedPrize.name;
        document.getElementById('prize-description').textContent = selectedPrize.description;
    } else {
        document.getElementById('prize-name').textContent = 'Prêmio Especial';
        document.getElementById('prize-description').textContent = 'Parabéns por participar do desafio!';
    }
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
    isAnswerProcessed = false;
    
    // Limpa os campos do formulário
    const playerNameInput = document.getElementById('player-name');
    if (playerNameInput) {
        playerNameInput.value = '';
        playerNameInput.classList.remove('error');
    }
    
    // Remove classes de estado da UI
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
    
    // Esconde elementos temporários
    const explanation = document.getElementById('explanation');
    if (explanation) {
        explanation.style.display = 'none';
    }
    
    // Para a animação de confetes
    const confettiContainer = document.getElementById('confetti-container');
    if (confettiContainer) {
        confettiContainer.innerHTML = '';
    }
    
    // Reseta a roleta
    const roulette = document.getElementById('roulette-svg');
    if (roulette) {
        roulette.style.transform = 'rotate(0deg)';
        roulette.style.transition = 'none';
        // Força um reflow para aplicar a mudança imediatamente
        roulette.offsetHeight;
        roulette.style.transition = 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
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
    } else {
        console.log(`Áudio ${soundId} não encontrado`);
    }
}

// Função para inicializar o teclado virtual
function initVirtualKeyboard() {
    const keys = document.querySelectorAll('.key');
    const input = document.getElementById('player-name');
    
    if (!input) {
        console.log('Campo de nome não encontrado');
        return;
    }
    
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
    const startChallengeBtn = document.getElementById('start-challenge-btn');
    if (startChallengeBtn) {
        startChallengeBtn.onclick = () => {
            showScreen('#home-screen');
        };
    }
    
    // Botão de participar (vai para tela institucional)
    const participateBtn = document.getElementById('participate-btn');
    if (participateBtn) {
        participateBtn.onclick = startGame;
    }
    
    // Botão de iniciar quiz (após tela institucional)
    const startQuizBtn = document.getElementById('start-quiz-btn');
    if (startQuizBtn) {
        startQuizBtn.onclick = startQuiz;
    }
    
    // Botões de opção do quiz
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.onclick = () => {
            const selectedOption = parseInt(btn.dataset.option);
            handleAnswer(selectedOption);
        };
    });
    
    // Botão de salvar e girar roleta
    const saveAndSpinBtn = document.getElementById('save-and-spin-btn');
    if (saveAndSpinBtn) {
        saveAndSpinBtn.onclick = saveAndProceed;
    }
    
    // Botão de girar roleta
    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) {
        spinBtn.onclick = spinRoulette;
    }
    
    // Botão de finalizar
    const finishBtn = document.getElementById('finish-btn');
    if (finishBtn) {
        finishBtn.onclick = () => {
            showScreen('#share-screen');
            // Popula o resumo final
            const summaryScore = document.getElementById('summary-score');
            const summaryTime = document.getElementById('summary-time');
            const summaryPrize = document.getElementById('summary-prize');
            
            if (summaryScore) summaryScore.textContent = gameState.score;
            if (summaryTime) {
                if (gameState.endTime && gameState.startTime) {
                    summaryTime.textContent = Math.round((gameState.endTime - gameState.startTime) / 1000);
                } else {
                    summaryTime.textContent = '0';
                }
            }
            if (summaryPrize) {
                summaryPrize.textContent = selectedPrize ? selectedPrize.name : '-';
            }
        };
    }
    
    // Botão de encerrar quiz (volta para tela inicial)
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.onclick = () => {
            showScreen('#home-screen');
            updateRanking();
        };
    }
}

// Inicializa a aplicação quando a página carrega
document.addEventListener('DOMContentLoaded', init); 