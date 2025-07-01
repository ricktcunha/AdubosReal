# ⏰ Cronômetro Circular - Relógio

Este projeto implementa um cronômetro circular animado que funciona como um relógio, usando HTML, CSS e JavaScript.

## 🎯 Características Implementadas

### ✅ Visual Circular com Borda Preenchida

- **SVG Circle**: Utiliza elementos `<circle>` do SVG para criar a borda circular
- **Borda Colorida**: Círculo de progresso verde (#4CAF50) sobre fundo cinza (#e0e0e0)
- **Controle Visual**: Usa `stroke-dasharray` e `stroke-dashoffset` para animação

### ✅ Animação no Sentido Horário (Como Relógio)

- **Início às 12h**: Rotação de -90° (`transform="rotate(-90 50 50)"`)
- **Movimento**: 12h → 3h → 6h → 9h → 12h (sentido horário)
- **Preenchimento Reverso**: Começa cheio e vai esvaziando gradualmente

### ✅ Preenchimento Progressivo Reverso

- **Estado Inicial**: Círculo completamente preenchido (`stroke-dashoffset="0"`)
- **Animação**: A borda é "consumida" conforme o tempo passa
- **Cálculo**: `strokeDashoffset = circumference * (1 - progress)`

### ✅ SVG com stroke-dasharray e stroke-dashoffset

```html
<circle
  class="timer-progress-circle"
  cx="50"
  cy="50"
  r="45"
  fill="none"
  stroke="#4CAF50"
  stroke-width="8"
  stroke-linecap="round"
  stroke-dasharray="282.743"
  stroke-dashoffset="0"
  transform="rotate(-90 50 50)"
/>
```

### ✅ Duração Configurável

```javascript
// Configurar duração
let timerDuration = 15; // segundos

// Atualizar animação
const progress = remaining / timerDuration;
const strokeDashoffset = circumference * (1 - progress);
```

### ✅ Responsividade e Centralização

- **Centralizado**: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)`
- **Responsivo**: Tamanhos adaptáveis para diferentes telas
- **Flexível**: Funciona em qualquer container

### ✅ Contagem Regressiva no Centro

- **Número Centralizado**: Posicionado no centro do círculo
- **Atualização em Tempo Real**: Sincronizado com a animação visual
- **Efeitos Visuais**: Pulse animation quando o número muda

## 📁 Arquivos do Projeto

### `index.html` (Timer Integrado)

- Timer integrado ao quiz existente
- Substitui o timer anterior por versão SVG
- Mantém funcionalidade do quiz

### `timer-demo.html` (Demonstração Independente)

- Demonstração standalone do cronômetro
- Controles interativos (Iniciar, Pausar, Reset)
- Configuração de duração
- Explicação visual de como funciona

### `style.css` (Estilos)

```css
/* Cronômetro Circular com SVG */
.timer {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.timer-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.timer-progress-circle {
  transition: stroke-dashoffset 0.1s linear;
  filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
}
```

### `script.js` (Lógica JavaScript)

```javascript
// Função de animação
function animateTimer() {
  const elapsed = (Date.now() - startTime) / 1000;
  const remaining = Math.max(0, timerDuration - elapsed);

  // Atualiza número
  const currentTime = Math.ceil(remaining);
  timerNumber.textContent = currentTime;

  // Atualiza animação circular como um relógio
  const circumference = 282.743;
  const progress = remaining / timerDuration;
  const strokeDashoffset = circumference * (1 - progress);
  timerProgressCircle.style.strokeDashoffset = strokeDashoffset;
}
```

## 🚀 Como Usar

### 1. Timer Integrado (Quiz)

1. Abra `index.html` no navegador
2. Navegue até a tela do quiz
3. O timer inicia automaticamente com cada pergunta
4. Duração fixa de 15 segundos

### 2. Demonstração Independente

1. Abra `timer-demo.html` no navegador
2. Configure a duração desejada no campo de entrada
3. Use os botões para controlar o timer:
   - **Iniciar**: Inicia o cronômetro
   - **Pausar**: Pausa/continua a animação
   - **Reset**: Reinicia o timer

## 🔧 Personalização

### Alterar Cores

```css
.timer-progress-circle {
  stroke: #4caf50; /* Cor do progresso */
}

.timer-background {
  stroke: #e0e0e0; /* Cor do fundo */
}
```

### Alterar Tamanho

```css
.timer {
  width: 120px; /* Largura */
  height: 120px; /* Altura */
}
```

### Alterar Duração

```javascript
let timerDuration = 30; // 30 segundos
```

### Alterar Espessura da Borda

```html
<circle stroke-width="10" />
<!-- Mais espesso -->
<circle stroke-width="4" />
<!-- Mais fino -->
```

## 📱 Responsividade

O timer se adapta automaticamente a diferentes tamanhos de tela:

- **Desktop**: 80px × 80px
- **Tablet**: 70px × 70px
- **Mobile**: 60px × 60px

## 🎨 Efeitos Visuais

- **Sombra**: `filter: drop-shadow()` no círculo de progresso
- **Pulse**: Animação de escala no número quando muda
- **Transições**: Animações suaves entre estados

## 🔍 Detalhes Técnicos

### Cálculo da Circunferência

```javascript
const circumference = 2 * Math.PI * radius; // 2πr
// Para r=45: circumference = 282.743
```

### Rotação para Início às 12h

```html
transform="rotate(-90 50 50)"
```

- Rotação de -90° no centro (50, 50)
- Posiciona o início da animação às 12h

### Animação Suave

```javascript
// Usa setInterval para controle de FPS
setInterval(animateTimer, 50); // 20 FPS
```

## ✅ Checklist de Requisitos

- [x] Visual circular com borda preenchida
- [x] Animação no sentido horário (como relógio)
- [x] Preenchimento progressivo reverso
- [x] SVG com stroke-dasharray e stroke-dashoffset
- [x] Rotação de -90° para início às 12h
- [x] Duração configurável via JavaScript
- [x] Responsividade e centralização
- [x] Contagem regressiva no centro

## 🎯 Resultado Final

O cronômetro implementado atende a todos os requisitos especificados, oferecendo:

- **Visual Elegante**: Design minimalista e moderno
- **Animação Fluida**: Transições suaves e responsivas
- **Funcionalidade Completa**: Controles e configurações
- **Código Limpo**: Estrutura organizada e comentada
- **Compatibilidade**: Funciona em todos os navegadores modernos
- **Comportamento de Relógio**: Esvazia no sentido horário como solicitado

O timer está pronto para uso em qualquer projeto web que necessite de um cronômetro circular animado!
