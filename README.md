# Adubos Real - Desafio da Safra

Um aplicativo de quiz interativo desenvolvido para estandes em feiras agrícolas, focado em produtores de café.

## 🎯 Objetivo

Atrair, engajar e capturar leads de produtores de café através de um quiz educativo sobre cultivo de café, com sistema de ranking e roleta de prêmios.

## 📁 Estrutura do Projeto

```
Teste Café/
├── index.html          # Estrutura HTML principal
├── style.css           # Estilização e animações
├── script.js           # Lógica do jogo
├── assets/             # Recursos (imagens, sons, logo)
│   ├── logo.png        # Logo da Adubos Real
│   ├── correct.mp3     # Som de resposta correta
│   ├── wrong.mp3       # Som de resposta errada
│   └── spin.mp3        # Som da roleta
└── README.md           # Este arquivo
```

## 🚀 Como Usar

### 1. Configuração Inicial

1. **Logo**: Adicione o logo da empresa em `assets/logo.png`
2. **Sons**: Adicione os arquivos de áudio em `assets/`:
   - `correct.mp3` - Som para resposta correta
   - `wrong.mp3` - Som para resposta errada
   - `spin.mp3` - Som da roleta

### 2. Execução

1. Abra o arquivo `index.html` em um navegador web
2. A aplicação iniciará automaticamente na tela de boas-vindas
3. Siga o fluxo: Boas-vindas → Ranking → Quiz → Resultado → Roleta → Prêmio → Reset

## 🎮 Funcionalidades

### Fluxo do Jogo

1. **Tela de Boas-Vindas**: Logo e botão para começar
2. **Tela Inicial**: Ranking dos melhores jogadores + botão para participar
3. **Quiz**: 5 perguntas sobre café com cronômetro de 15s cada
4. **Resultado**: Pontuação final + formulário para dados do jogador
5. **Roleta**: Sorteio de prêmios baseado na pontuação
6. **Prêmio**: Confirmação do prêmio sorteado
7. **Tela Final**: Resumo + botão para reiniciar

### Sistema de Pontuação

- **0-1 acertos**: Kit Básico
- **2 acertos**: Kit Intermediário
- **3 acertos**: Kit Avançado
- **4 acertos**: Kit Premium
- **5 acertos**: Kit Especial

### Ranking

- Armazena os 10 melhores jogadores no localStorage
- Ordenação por pontuação e tempo
- Persiste entre sessões

## 🎨 Personalização

### Perguntas

Edite o array `questions` no arquivo `script.js` para personalizar as perguntas:

```javascript
questions: [
  {
    question: "Sua pergunta aqui?",
    options: ["Opção A", "Opção B", "Opção C", "Opção D"],
    correctAnswer: 1, // Índice da resposta correta (0-3)
    explanation: "Explicação da resposta correta",
  },
];
```

### Prêmios

Modifique o array `prizes` na função `prepareRoulette()` para personalizar os prêmios:

```javascript
const prizes = [{ name: "Nome do Prêmio", description: "Descrição do prêmio" }];
```

### Cores e Estilo

Edite o arquivo `style.css` para personalizar:

- Cores do tema
- Animações
- Layout responsivo
- Estilo dos botões e elementos

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:

- Desktops
- Tablets
- Smartphones
- Totens de feira

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com animações
- **JavaScript ES6+**: Lógica do jogo
- **LocalStorage**: Persistência de dados
- **CSS Grid/Flexbox**: Layout responsivo

## 🎯 Características Técnicas

### Performance

- Carregamento rápido
- Animações suaves
- Sem dependências externas

### Usabilidade

- Interface intuitiva
- Feedback visual imediato
- Fluxo contínuo sem interrupções

### Robustez

- Tratamento de erros
- Validação de formulários
- Reset automático para próximo jogador

## 🚀 Deploy

### Para Totem/Tablet

1. Compacte todos os arquivos em um ZIP
2. Extraia em um servidor web local
3. Configure para abrir automaticamente em tela cheia
4. Teste o funcionamento offline

### Para Web

1. Faça upload dos arquivos para um servidor web
2. Acesse via URL
3. Funciona em qualquer navegador moderno

## 📞 Suporte

Para dúvidas ou personalizações adicionais, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido para Adubos Real - Desafio da Safra** 🌱
