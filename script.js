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
}
