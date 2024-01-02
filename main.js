document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snakeCanvas');
    const context = canvas.getContext('2d');
    const startBtn = document.querySelector('#start');
    const stopBtn = document.querySelector('#stop');
    const scoreArea = document.querySelector('#score');
    const gameHelpBtn = document.querySelector('.help-btn');
    const gameInstructionsOverlay = document.querySelector('.instruction-overlay');
    const instructionsCloseBtn = document.querySelector('#close-btn');
    const modalGameScore = document.querySelector('#result');
    const overlay = document.querySelector('.modal-overlay');
    const modalCloseBtn = document.querySelector('.modal-btn');

    // Global variables
    const gridSize = 20;
      let snake = [];
      let direction = 'right';
      let food = generateFood();
      let gameInProgress = false;
      let score = 0;
      let gameSpeed;

    function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw snake
      context.fillStyle = 'black';
      snake.forEach(segment => {
        context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
      });

      // Draw food
      context.fillStyle = 'green';
      context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

      scoreArea.textContent = `Score: ${score}`;
    }

    function update() {
        if (!gameInProgress) {
            return;
        }

      // Direction of snake movement
      const head = Object.assign({}, snake[0]); // Create snake head copy
      switch (direction) {
        case 'up':
          head.y -= 1;
          break;
        case 'down':
          head.y += 1;
          break;
        case 'left':
          head.x -= 1;
          break;
        case 'right':
          head.x += 1;
          break;
      }

      // Check for collision with walls or self
      if (
        head.x < 0 || head.x >= canvas.width / gridSize ||
        head.y < 0 || head.y >= canvas.height / gridSize ||
        collisionWithSelf(head)
      ) {
        // alert('Game Over!');
        showModal();
        resetGame();
        return;
      }

      // Check for collision with food
      if (head.x === food.x && head.y === food.y) {
        snake.unshift(food); // Add food to snake head
        score += 1; // Increase game score
        modalGameScore.textContent = score; // Update score in modal
        food = generateFood();
      } else {
        snake.pop(); // Remove the last segment of the snake, i.e. snake tail
      }

      snake.unshift(head); // Add new snake head

      draw();
    }

    function collisionWithSelf(head) {
      return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    }

    function generateFood() {
      const x = Math.floor(Math.random() * (canvas.width / gridSize));
      const y = Math.floor(Math.random() * (canvas.height / gridSize));
      return { x, y };
    }

    function resetGame() {
      snake = [];
      direction = 'right';
      gameInProgress = false;
      startBtn.disabled = false;
      score = 0;
      draw();
    //   window.location.reload();
    }

    function handleKeyPress(event) {
        if (!gameInProgress) {
            return;
        }

      switch (event.key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
      }
    }

    stopBtn.classList.add('hide');

    function startGame() {
        if (gameInProgress) {
          return;
        }
  
        snake = [{ x: 10, y: 10 }];
        direction = 'right';
        food = generateFood();
        gameInProgress = true;
        score = 0;
  
        // Game speed
        gameSpeed = setInterval(update, 400);
        startBtn.classList.add('hide');
        stopBtn.classList.remove('hide');
    }

    const stopGame = () => {
        gameInProgress = false;
        clearInterval(gameSpeed); // Reset game speed
        resetGame();
        showModal();

        startBtn.classList.remove('hide');
        stopBtn.classList.add('hide');
    }

    const restart = () => {
        window.location.reload();
    }

    // Game instructions visibility
    const showInstructions = () => {
        gameInstructionsOverlay.classList.contains('visible') ? gameInstructionsOverlay.classList.remove('visible') : gameInstructionsOverlay.classList.add('visible');
    }

    // Modal visibility
    const showModal = () => overlay.classList.toggle('visible');

    document.addEventListener('keydown', handleKeyPress);
    startBtn.addEventListener('click', startGame);
    stopBtn.addEventListener('click', stopGame);
    gameHelpBtn.addEventListener('click', showInstructions);
    instructionsCloseBtn.addEventListener('click', showInstructions);
    modalCloseBtn.addEventListener('click', restart);
  });