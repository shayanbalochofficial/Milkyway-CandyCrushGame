// kahaan ho tum chale aao, mohabbat ka taqaza hai ♡

document.addEventListener("DOMContentLoaded", () => {
  candyCrushGame();
});

function candyCrushGame() {
  // DOM Elements
  const grid = document.querySelector(".grid");
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const modeSelection = document.getElementById("modeSelection");
  const endlessButton = document.getElementById("endlessMode");
  const timedButton = document.getElementById("timedMode");
  const changeModeButton = document.getElementById("changeMode");

  // Game State Variables
  const width = 8;
  const squares = [];
  let score = 0;
  let currentMode = null;
  let timeLeft = 0;
  let gameInterval = null;
  let timerInterval = null;

  // Local candy images (1.png to 6.png inside assets folder)
  const candyColors = [
    "url('assets/red-candy.png')",
    "url('assets/blue-candy.png')",
    "url('assets/green-candy.png')",
    "url('assets/yellow-candy.png')",
    "url('assets/orange-candy.png')",
    "url('assets/purple-candy.png')",
  ];

  // Create the Game Board
  function createBoard() {
    grid.innerHTML = ""; // Clear existing grid
    squares.length = 0; // Clear squares array

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);

      // Pick a random local candy image
      const randomColor = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundImage = candyColors[randomColor];

      grid.appendChild(square);
      squares.push(square);
    }

    // Add drag event listeners (once, after board creation)
    squares.forEach((square) => {
      square.addEventListener("dragstart", dragStart);
      square.addEventListener("dragend", dragEnd);
      square.addEventListener("dragover", dragOver);
      square.addEventListener("dragenter", dragEnter);
      square.addEventListener("dragleave", dragLeave);
      square.addEventListener("drop", dragDrop);
    });
  }

  // Drag and Drop Variables
  let colorBeingDragged,
    colorBeingReplaced,
    squareIdBeingDragged,
    squareIdBeingReplaced;

  function dragStart() {
    colorBeingDragged = this.style.backgroundImage;
    squareIdBeingDragged = parseInt(this.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }
  function dragEnter(e) {
    e.preventDefault();
  }
  function dragLeave() {
    /* optional visual effects can go here */
  }

  function dragDrop() {
    colorBeingReplaced = this.style.backgroundImage;
    squareIdBeingReplaced = parseInt(this.id);

    this.style.backgroundImage = colorBeingDragged;
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
  }

  function dragEnd() {
    const validMoves = [
      squareIdBeingDragged - 1,
      squareIdBeingDragged - width,
      squareIdBeingDragged + 1,
      squareIdBeingDragged + width,
    ];

    const validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
      squareIdBeingReplaced = null; // Keep the valid swap
    } else {
      // Revert invalid or cancelled swap
      squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    }
  }

  // Move candies down to fill empty spaces
  function moveIntoSquareBelow() {
    // Top row - generate new candies
    for (let i = 0; i < width; i++) {
      if (squares[i].style.backgroundImage === "") {
        const randomColor = Math.floor(Math.random() * candyColors.length);
        squares[i].style.backgroundImage = candyColors[randomColor];
      }
    }

    // Move existing candies down
    for (let i = 0; i < width * (width - 1); i++) {
      if (squares[i + width].style.backgroundImage === "") {
        squares[i + width].style.backgroundImage =
          squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = "";
      }
    }
  }

  // Match checking functions (unchanged logic, just using local images)
  function checkRowForFour() {
    for (let i = 0; i < 60; i++) {
      if (i % width > width - 4) continue;
      const row = [i, i + 1, i + 2, i + 3];
      const color = squares[i].style.backgroundImage;
      if (
        color &&
        row.every((idx) => squares[idx].style.backgroundImage === color)
      ) {
        score += 40;
        scoreDisplay.innerHTML = score;
        row.forEach((idx) => (squares[idx].style.backgroundImage = ""));
      }
    }
  }

  function checkColumnForFour() {
    for (let i = 0; i < 40; i++) {
      const col = [i, i + width, i + 2 * width, i + 3 * width];
      const color = squares[i].style.backgroundImage;
      if (
        color &&
        col.every((idx) => squares[idx].style.backgroundImage === color)
      ) {
        score += 40;
        scoreDisplay.innerHTML = score;
        col.forEach((idx) => (squares[idx].style.backgroundImage = ""));
      }
    }
  }

  function checkRowForThree() {
    for (let i = 0; i < 62; i++) {
      if (i % width > width - 3) continue;
      const row = [i, i + 1, i + 2];
      const color = squares[i].style.backgroundImage;
      if (
        color &&
        row.every((idx) => squares[idx].style.backgroundImage === color)
      ) {
        score += 30;
        scoreDisplay.innerHTML = score;
        row.forEach((idx) => (squares[idx].style.backgroundImage = ""));
      }
    }
  }

  function checkColumnForThree() {
    for (let i = 0; i < 48; i++) {
      const col = [i, i + width, i + 2 * width];
      const color = squares[i].style.backgroundImage;
      if (
        color &&
        col.every((idx) => squares[idx].style.backgroundImage === color)
      ) {
        score += 30;
        scoreDisplay.innerHTML = score;
        col.forEach((idx) => (squares[idx].style.backgroundImage = ""));
      }
    }
  }

  // Game loop
  function gameLoop() {
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
    moveIntoSquareBelow();
  }

  // Start game (endless or timed)
  function startGame(mode) {
    currentMode = mode;
    modeSelection.style.display = "none";
    grid.style.display = "flex";
    scoreDisplay.parentElement.style.display = "flex";

    createBoard();
    score = 0;
    scoreDisplay.innerHTML = score;

    gameInterval = setInterval(gameLoop, 100);

    if (mode === "timed") {
      timeLeft = 120;
      updateTimerDisplay();
      timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          endGame();
        }
      }, 1000);
    } else {
      timerDisplay.innerHTML = "";
    }
  }

  function updateTimerDisplay() {
    if (currentMode === "timed") {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = (timeLeft % 60).toString().padStart(2, "0");
      timerDisplay.innerHTML = `Time Left: ${minutes}:${seconds}`;
    }
  }

  function endGame() {
    clearInterval(gameInterval);
    squares.forEach((sq) => sq.setAttribute("draggable", false));
    alert(`Time's Up! Final Score: ${score}`);
  }

  function changeMode() {
    clearInterval(gameInterval);
    if (timerInterval) clearInterval(timerInterval);
    grid.style.display = "none";
    scoreDisplay.parentElement.style.display = "none";
    modeSelection.style.display = "flex";
  }

  // Event Listeners
  endlessButton.addEventListener("click", () => startGame("endless"));
  timedButton.addEventListener("click", () => startGame("timed"));
  changeModeButton.addEventListener("click", changeMode);
}
