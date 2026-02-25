// Initialize chess.js
const game = new Chess();

const boardEl = document.getElementById('board');
const historyEl = document.getElementById('history');
const fenEl = document.getElementById('fen');
const resetBtn = document.getElementById('resetBtn');

// Unicode pieces
const pieces = {
  'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
  'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
};

let selectedSquare = null;

function drawBoard() {
  boardEl.innerHTML = '';
  const boardArray = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const squareDiv = document.createElement('div');
      squareDiv.classList.add('square');
      squareDiv.classList.add((r + c) % 2 === 0 ? 'white' : 'black');
      squareDiv.dataset.rank = r;
      squareDiv.dataset.file = c;

      const piece = boardArray[r][c];
      if (piece) {
        const symbol = piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
        squareDiv.textContent = pieces[symbol];
      }

      squareDiv.addEventListener('click', () => selectSquare(r, c));
      boardEl.appendChild(squareDiv);
    }
  }
  updateInfo();
}

function selectSquare(r, c) {
  const file = String.fromCharCode(97 + c);
  const rank = 8 - r;
  const squareName = file + rank;

  if (selectedSquare) {
    // Try move
    const move = game.move({ from: selectedSquare, to: squareName, promotion: 'q' });
    if (move) {
      selectedSquare = null;
      drawBoard();
      setTimeout(makeAIMove, 300);
      return;
    }
    selectedSquare = null;
    drawBoard();
    return;
  }

  const piece = game.get(squareName);
  if (piece && piece.color === game.turn()) {
    selectedSquare = squareName;
    highlightSquare(r, c);
  }
}

function highlightSquare(r, c) {
  drawBoard();
  const index = r * 8 + c;
  boardEl.children[index].classList.add('selected');
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
  drawBoard();
}

resetBtn.addEventListener('click', () => {
  game.reset();
  drawBoard();
});

drawBoard();
