// Estado global do jogo
const gameState = {
    currentScreen: 'welcome',
    playerName: '',
    score: 0,
    timeSpent: 0,
    currentQuestion: 0,
    questions: [
        {
            question: "Qual é o pH ideal do solo para o cultivo do café?",
            options: ["4.5 - 5.5", "6.0 - 7.0", "7.5 - 8.5", "3.0 - 4.0"],
            correct: 0,
            explanation: "O pH ideal para o café está entre 4.5 e 5.5, pois o café é uma planta acidófila."
        },
        {
            question: "Qual é a época ideal para adubação do café?",
            options: ["Durante a colheita", "No início das chuvas", "No período seco", "Qualquer época do ano"],
            correct: 1,
            explanation: "A adubação deve ser feita no início das chuvas para melhor aproveitamento dos nutrientes."
        },
        {
            question: "Qual nutriente é mais importante para a formação dos grãos do café?",
            options: ["Nitrogênio", "Fósforo", "Potássio", "Cálcio"],
            correct: 2,
            explanation: "O potássio é essencial para a formação e qualidade dos grãos do café."
        },
        {
            question: "Quantos anos leva para um pé de café começar a produzir?",
            options: ["1 ano", "2-3 anos", "5-6 anos", "8-10 anos"],
            correct: 1,
            explanation: "O café começa a produzir entre 2 e 3 anos após o plantio."
        },
        {
            question: "Qual é a principal praga do cafeeiro?",
            options: ["Bicho-mineiro", "Cigarra", "Lagarta", "Pulgão"],
            correct: 0,
            explanation: "O bicho-mineiro é a principal praga que ataca as folhas do cafeeiro."
        }
    ],
    timer: null,
    timeLeft: 15,
    isSpinning: false,
    startTime: null
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadRanking();
    showScreen('welcome');
    
    // Adicionar confetti
    createConfetti();
});

// Função para mostrar telas com transições melhoradas
function showScreen(screenName) {
    // Esconder todas as telas com transição suave
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(screen => {
        if (screen.classList.contains('active')) {
            screen.style.opacity = '0';
            screen.style.transform = 'translateY(30px) scale(0.95)';
            setTimeout(() => {
                screen.classList.remove('active');
            }, 300);
        }
    });

    // Mostrar nova tela com delay para transição
    setTimeout(() => {
        const targetScreen = document.getElementById(screenName + '-screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
            gameState.currentScreen = screenName;
            
            // Adicionar animação de entrada para o container
            const container = targetScreen.querySelector('.welcome-container, .home-container, .institutional-container, .quiz-container, .result-container, .roulette-container, .prize-container, .share-container');
            if (container) {
                container.style.animation = 'containerSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            }
            
            // Configurações específicas por tela
            switch(screenName) {
                case 'home':
                    updateRanking();
                    break;
                case 'quiz':
                    startQuiz();
                    break;
                case 'result':
                    showResult();
                    break;
                case 'roulette':
                    setupRoulette();
                    break;
                case 'prize':
                    showPrize();
                    break;
            }
        }
    }, 350);
}

// Função para criar confetti
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'][Math.floor(Math.random() * 5)];
        confettiContainer.appendChild(confetti);
    }
}

// Função para iniciar o quiz
function startQuiz() {
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.startTime = Date.now();
    gameState.timeLeft = 15;
    
    showQuestion();
    startTimer();
}

// Função para mostrar questão
function showQuestion() {
    const question = gameState.questions[gameState.currentQuestion];
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressInfo = document.getElementById('progress-info');
    
    questionText.textContent = question.question;
    progressInfo.textContent = `Questão ${gameState.currentQuestion + 1} de ${gameState.questions.length}`;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerHTML = `
            <div class="option-letter">${String.fromCharCode(65 + index)}</div>
            <div class="option-text">${option}</div>
        `;
        button.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(button);
    });
    
    // Reset timer para nova questão
    gameState.timeLeft = 15;
    resetTimer();
}

// Função para selecionar opção
function selectOption(selectedIndex) {
    const question = gameState.questions[gameState.currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    
    // Desabilitar todos os botões
    buttons.forEach(btn => btn.disabled = true);
    
    // Marcar resposta correta e incorreta com animação
    buttons.forEach((btn, index) => {
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            btn.classList.add('wrong');
        }
    });
    
    // Calcular pontuação
    if (selectedIndex === question.correct) {
        gameState.score += Math.max(1, gameState.timeLeft);
    }
    
    // Mostrar explicação com animação suave
    setTimeout(() => {
        const explanation = document.createElement('div');
        explanation.className = 'explanation';
        explanation.textContent = question.explanation;
        explanation.style.animation = 'slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        document.querySelector('.quiz-container').appendChild(explanation);
    }, 800);
    
    // Próxima questão após delay maior para melhor experiência
    setTimeout(() => {
        gameState.currentQuestion++;
        if (gameState.currentQuestion < gameState.questions.length) {
            showQuestion();
        } else {
            endQuiz();
        }
    }, 5000); // Aumentado para 5 segundos para melhor leitura
}

// Função para iniciar timer
function startTimer() {
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            // Auto-responder com primeira opção se tempo acabar
            selectOption(0);
        }
    }, 1000);
}

// Função para resetar timer
function resetTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    gameState.timeLeft = 15;
    updateTimerDisplay();
    startTimer();
}

// Função para atualizar display do timer
function updateTimerDisplay() {
    const timerText = document.getElementById('timer-text');
    const progressRing = document.querySelector('.timer-progress-ring');
    const roulette = document.querySelector('.roulette');
    
    if (timerText) {
        timerText.textContent = gameState.timeLeft;
    }
    
    if (progressRing) {
        const progress = gameState.timeLeft / 15;
        const clipPath = `circle(${progress * 50}% at center)`;
        progressRing.style.clipPath = clipPath;
    }
    
    // Sincronizar borda da roleta com o timer
    if (roulette) {
        const progress = gameState.timeLeft / 15;
        const borderWidth = 2 + (progress * 6); // De 2px a 8px
        roulette.style.borderWidth = `${borderWidth}px`;
    }
}

// Função para finalizar quiz
function endQuiz() {
    clearInterval(gameState.timer);
    gameState.timeSpent = Math.floor((Date.now() - gameState.startTime) / 1000);
    showScreen('result');
}

// Função para mostrar resultado
function showResult() {
    const finalScore = document.getElementById('final-score');
    const timeDisplay = document.getElementById('time-display');
    
    if (finalScore) {
        finalScore.textContent = gameState.score;
    }
    
    if (timeDisplay) {
        const minutes = Math.floor(gameState.timeSpent / 60);
        const seconds = gameState.timeSpent % 60;
        timeDisplay.textContent = `Tempo: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Função para configurar roleta
function setupRoulette() {
    const roulette = document.querySelector('.roulette');
    const spinButton = document.getElementById('spin-button');
    
    if (roulette && spinButton) {
        roulette.style.transform = 'rotate(0deg)';
        gameState.isSpinning = false;
        spinButton.disabled = false;
        spinButton.textContent = 'Girar Roleta';
    }
}

// Função para girar roleta
function spinRoulette() {
    if (gameState.isSpinning) return;
    
    const roulette = document.querySelector('.roulette');
    const spinButton = document.getElementById('spin-button');
    
    if (!roulette || !spinButton) return;
    
    gameState.isSpinning = true;
    spinButton.disabled = true;
    spinButton.textContent = 'Girando...';
    spinButton.style.opacity = '0.7';
    
    // Determinar prêmio baseado na pontuação
    let prizeIndex;
    if (gameState.score >= 80) {
        prizeIndex = 0; // Kit 1
    } else if (gameState.score >= 60) {
        prizeIndex = 1; // Kit 2
    } else if (gameState.score >= 40) {
        prizeIndex = 2; // Kit 3
    } else if (gameState.score >= 20) {
        prizeIndex = 3; // Kit 4
    } else {
        prizeIndex = 4; // Kit 5
    }
    
    // Calcular rotação para parar no prêmio correto
    const baseRotation = 360 * 5; // 5 voltas completas
    const prizeAngle = 72 * prizeIndex; // Cada fatia tem 72 graus
    const finalRotation = baseRotation + (360 - prizeAngle);
    
    // Aplicar animação com easing mais suave
    roulette.style.transition = 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    roulette.style.transform = `rotate(${finalRotation}deg)`;
    
    // Salvar prêmio ganho
    gameState.wonPrize = prizeIndex;
    
    // Habilitar botão após animação com feedback visual
    setTimeout(() => {
        gameState.isSpinning = false;
        spinButton.disabled = false;
        spinButton.textContent = 'Ver Prêmio';
        spinButton.style.opacity = '1';
        spinButton.style.animation = 'pulse 0.5s ease';
        spinButton.onclick = () => showScreen('prize');
    }, 4000);
    
    // Fallback para caso a animação trave
    setTimeout(() => {
        if (gameState.isSpinning) {
            gameState.isSpinning = false;
            spinButton.disabled = false;
            spinButton.textContent = 'Ver Prêmio';
            spinButton.style.opacity = '1';
            spinButton.onclick = () => showScreen('prize');
        }
    }, 5000);
}

// Função para mostrar prêmio
function showPrize() {
    const prizeNames = ['Kit 1', 'Kit 2', 'Kit 3', 'Kit 4', 'Kit 5'];
    const prizeDescriptions = [
        'Kit Premium com produtos exclusivos',
        'Kit Especial com fertilizantes avançados',
        'Kit Básico com produtos essenciais',
        'Kit Iniciante com produtos básicos',
        'Kit Amostra com produtos de teste'
    ];
    
    const prizeName = document.getElementById('prize-name');
    const prizeDescription = document.getElementById('prize-description');
    
    if (prizeName && prizeDescription) {
        prizeName.textContent = prizeNames[gameState.wonPrize];
        prizeDescription.textContent = prizeDescriptions[gameState.wonPrize];
    }
}

// Função para salvar jogador
function savePlayer() {
    const nameInput = document.getElementById('player-name');
    const name = nameInput.value.trim();
    
    if (name.length < 2) {
        nameInput.classList.add('error');
        setTimeout(() => nameInput.classList.remove('error'), 600);
        return;
    }
    
    gameState.playerName = name;
    saveToRanking(name, gameState.score, gameState.timeSpent);
    showScreen('share');
}

// Função para adicionar letra ao nome
function addLetter(letter) {
    const nameInput = document.getElementById('player-name');
    if (letter === 'backspace') {
        nameInput.value = nameInput.value.slice(0, -1);
    } else if (letter === 'space') {
        nameInput.value += ' ';
    } else if (nameInput.value.length < 20) {
        nameInput.value += letter;
    }
}

// Função para salvar no ranking
function saveToRanking(name, score, time) {
    let ranking = JSON.parse(localStorage.getItem('quizRanking') || '[]');
    
    ranking.push({
        name: name,
        score: score,
        time: time,
        date: new Date().toISOString()
    });
    
    // Ordenar por pontuação (maior primeiro) e depois por tempo (menor primeiro)
    ranking.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.time - b.time;
    });
    
    // Manter apenas os 10 melhores
    ranking = ranking.slice(0, 10);
    
    localStorage.setItem('quizRanking', JSON.stringify(ranking));
}

// Função para carregar ranking
function loadRanking() {
    const ranking = JSON.parse(localStorage.getItem('quizRanking') || '[]');
    return ranking;
}

// Função para atualizar display do ranking
function updateRanking() {
    const rankingList = document.getElementById('ranking-list');
    const ranking = loadRanking();
    
    if (rankingList) {
        rankingList.innerHTML = '';
        
        ranking.forEach((player, index) => {
            const item = document.createElement('div');
            item.className = 'ranking-item';
            item.innerHTML = `
                <span class="ranking-position">${index + 1}º</span>
                <span class="ranking-name">${player.name}</span>
                <span class="ranking-score">${player.score} pts</span>
            `;
            rankingList.appendChild(item);
        });
    }
}

// Função para reiniciar jogo
function resetGame() {
    gameState.currentScreen = 'welcome';
    gameState.playerName = '';
    gameState.score = 0;
    gameState.timeSpent = 0;
    gameState.currentQuestion = 0;
    gameState.timeLeft = 15;
    gameState.isSpinning = false;
    gameState.startTime = null;
    gameState.wonPrize = null;
    
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    
    showScreen('welcome');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Botões de navegação
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => showScreen('home'));
    }
    
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', () => showScreen('institutional'));
    }
    
    const institutionalBtn = document.getElementById('institutional-btn');
    if (institutionalBtn) {
        institutionalBtn.addEventListener('click', () => showScreen('quiz'));
    }
    
    const resultBtn = document.getElementById('result-btn');
    if (resultBtn) {
        resultBtn.addEventListener('click', () => showScreen('roulette'));
    }
    
    const spinBtn = document.getElementById('spin-button');
    if (spinBtn) {
        spinBtn.addEventListener('click', spinRoulette);
    }
    
    const prizeBtn = document.getElementById('prize-btn');
    if (prizeBtn) {
        prizeBtn.addEventListener('click', () => showScreen('share'));
    }
    
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', savePlayer);
    }
    
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }
    
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => showScreen('home'));
    }
    
    // Teclado virtual
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.addEventListener('click', () => {
            const letter = key.textContent;
            addLetter(letter);
        });
    });
    
    // Input de nome
    const nameInput = document.getElementById('player-name');
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            nameInput.classList.remove('error');
        });
    }
}); 