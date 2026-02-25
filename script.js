const boardEl = document.getElementById('board');
const historyEl = document.getElementById('history');
const fenEl = document.getElementById('fen');
const resetBtn = document.getElementById('resetBtn');

const game = new Chess();

const pieceSymbols = {
  'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
  'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
};

function createBoard() {
  boardEl.innerHTML = '';
  const boardSquares = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.classList.add((r + c) % 2 === 0 ? 'white' : 'black');
      square.dataset.rank = r;
      square.dataset.file = c;

      const piece = boardSquares[r][c];
      if (piece) square.textContent = pieceSymbols[piece.color === 'w' ? piece.type.toUpperCase() : piece.type];

      square.addEventListener('click', handleClick);
      boardEl.appendChild(square);
    }
  }
}

let selectedSquare = null;

function handleClick(e) {
  const r = parseInt(e.currentTarget.dataset.rank);
  const c = parseInt(e.currentTarget.dataset.file);
  const squareName = String.fromCharCode(97 + c) + (8 - r);

  if (selectedSquare) {
    // Try move
    const move = game.move({ from: selectedSquare, to: squareName, promotion: 'q' });
    if (move) {
      selectedSquare = null;
      createBoard();
      updateInfo();
      setTimeout(makeAIMove, 300);
      return;
    } else {
      selectedSquare = null;
      createBoard();
      return;
    }
  }

  // Select square
  const piece = game.get(squareName);
  if (piece && piece.color === game.turn()) {
    selectedSquare = squareName;
    e.currentTarget.style.backgroundColor = 'yellow';
  }
}

function updateInfo() {
  fenEl.textContent = game.fen();
  historyEl.innerHTML = '';
  game.history().forEach(m => {
    const li = document.createElement('li');
    li.textContent = m;
    historyEl.appendChild(li);
  });
}

function makeAIMove() {
  if (game.game_over()) return;

  const moves = game.moves();
  let move;
  do {
    move = moves[Math.floor(Math.random() * moves.length)];
  } while (Math.random() < 0.3 && moves.length > 1); // simulate 800 ELO mistakes

  game.move(move);
  createBoard();
  updateInfo();
}

// Reset button
resetBtn.addEventListener('click', () => {
  game.reset();
  createBoard();
  updateInfo();
});

createBoard();
updateInfo();
