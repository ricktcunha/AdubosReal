// Objeto de Estado - Primeira declaração conforme especificado
let gameState = {
    currentScreen: '#welcome-screen',
    score: 0,
    currentQuestionIndex: 0,
    startTime: null,
    endTime: null,
    playerName: '',
    playerWhatsapp: '',
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
let currentTimerProgress;
let rouletteFinalAngle;
let selectedPrize;

// Função de inicialização - chamada na carga da página
function init() {
    // Popula o array de perguntas (já está populado acima)
    
    // Mostra a tela de boas-vindas
    showScreen('#welcome-screen');
    
    // Associa os event listeners
    setupEventListeners();
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

// Função para iniciar o jogo
function startGame() {
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
    
    // Esconde a explicação
    document.getElementById('explanation').style.display = 'none';
    
    // Reseta e inicia o cronômetro
    resetTimer();
    startTimer();
}

// Função para resetar o cronômetro
function resetTimer() {
    const timerProgress = document.getElementById('timer-progress');
    timerProgress.style.width = '100%';
    timerProgress.style.transition = 'none';
    
    // Força um reflow para aplicar a mudança
    timerProgress.offsetHeight;
    
    timerProgress.style.transition = 'width 15s linear';
}

// Função para iniciar o cronômetro
function startTimer() {
    // Cancela timer anterior se existir
    if (timerTimeout) {
        clearTimeout(timerTimeout);
    }
    
    // Inicia o timer de 15 segundos
    timerTimeout = setTimeout(() => {
        handleAnswer(null); // Tempo esgotado
    }, 15000);
    
    // Inicia a animação da barra
    const timerProgress = document.getElementById('timer-progress');
    timerProgress.style.width = '0%';
}

// Função para processar a resposta do usuário
function handleAnswer(selectedOption) {
    // Cancela o timer
    if (timerTimeout) {
        clearTimeout(timerTimeout);
        timerTimeout = null;
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
    
    // Mostra a explicação
    const explanation = document.getElementById('explanation');
    const explanationText = document.getElementById('explanation-text');
    explanationText.textContent = question.explanation;
    explanation.style.display = 'block';
    
    // Aguarda 3 segundos e vai para a próxima pergunta
    setTimeout(() => {
        gameState.currentQuestionIndex++;
        
        if (gameState.currentQuestionIndex < 5) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 3000);
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
    const playerWhatsapp = document.getElementById('player-whatsapp').value.trim();
    
    // Validação do nome
    if (playerName.length < 3) {
        document.getElementById('player-name').classList.add('error');
        return;
    }
    
    // Remove erro se existir
    document.getElementById('player-name').classList.remove('error');
    
    // Salva os dados
    gameState.playerName = playerName;
    gameState.playerWhatsapp = playerWhatsapp;
    
    // Atualiza o ranking
    updateRankingStorage();
    
    // Vai para a roleta
    showScreen('#roulette-screen');
    prepareRoulette();
}

// Função para preparar a roleta
function prepareRoulette() {
    // Define as fatias da roleta baseado no score
    const rouletteSlices = document.querySelectorAll('.roulette-slice');
    const prizes = [
        { name: 'Kit Básico', description: 'Amostra de adubo + brinde' },
        { name: 'Kit Intermediário', description: 'Amostra + boné + camiseta' },
        { name: 'Kit Avançado', description: 'Kit completo + consultoria' },
        { name: 'Kit Premium', description: 'Kit premium + visita técnica' },
        { name: 'Kit Especial', description: 'Kit especial + desconto exclusivo' }
    ];
    
    // Calcula o prêmio baseado no score
    let prizeIndex;
    if (gameState.score <= 1) {
        prizeIndex = 0; // Kit Básico
    } else if (gameState.score === 2) {
        prizeIndex = 1; // Kit Intermediário
    } else if (gameState.score === 3) {
        prizeIndex = 2; // Kit Avançado
    } else if (gameState.score === 4) {
        prizeIndex = 3; // Kit Premium
    } else {
        prizeIndex = 4; // Kit Especial
    }
    
    selectedPrize = prizes[prizeIndex];
    
    // Calcula o ângulo final (cada fatia tem 72 graus)
    const sliceAngle = 72;
    const targetAngle = prizeIndex * sliceAngle;
    
    // Adiciona voltas extras para efeito dramático
    rouletteFinalAngle = targetAngle + (360 * 5); // 5 voltas + ângulo final
}

// Função para girar a roleta
function spinRoulette() {
    const roulette = document.getElementById('roulette');
    const spinBtn = document.getElementById('spin-btn');
    
    // Desabilita o botão
    spinBtn.disabled = true;
    
    // Toca o som
    playSound('spin-sound');
    
    // Aplica a rotação
    roulette.style.transform = `rotate(${rouletteFinalAngle}deg)`;
    
    // Adiciona listener para o fim da animação
    roulette.addEventListener('transitionend', function onTransitionEnd() {
        roulette.removeEventListener('transitionend', onTransitionEnd);
        showPrize();
    }, { once: true });
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
    gameState.playerWhatsapp = '';
    
    // Limpa os campos do formulário
    document.getElementById('player-name').value = '';
    document.getElementById('player-whatsapp').value = '';
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

// Função para configurar event listeners
function setupEventListeners() {
    // Botão de começar o desafio
    document.getElementById('start-challenge-btn').onclick = () => {
        showScreen('#home-screen');
    };
    
    // Botão de participar
    document.getElementById('participate-btn').onclick = startGame;
    
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
        document.getElementById('summary-time').textContent = 
            Math.round((gameState.endTime - gameState.startTime) / 1000);
        document.getElementById('summary-prize').textContent = selectedPrize.name;
    };
    
    // Botão de reiniciar
    document.getElementById('restart-btn').onclick = resetGame;
}

// Inicializa a aplicação quando a página carrega
document.addEventListener('DOMContentLoaded', init); 