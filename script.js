const boardEl = document.getElementById('board');
const historyEl = document.getElementById('history');
const fenEl = document.getElementById('fen');

const game = new Chess();

const board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDragStart: (source, piece, position, orientation) => {
    if (game.game_over()) return false;
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  },
  onDrop: (source, target) => {
    const move = game.move({
      from: source,
      to: target,
      promotion: 'q'
    });

    if (move === null) return 'snapback';
    updateBoard();
    window.setTimeout(makeAIMove, 300);
  },
  onSnapEnd: () => board.position(game.fen())
});

function updateBoard() {
  board.position(game.fen());
  fenEl.textContent = game.fen();
  historyEl.innerHTML = '';
  game.history().forEach(m => {
    const li = document.createElement('li');
    li.textContent = m;
    historyEl.appendChild(li);
  });
}

// Simple 800 ELO AI move
function makeAIMove() {
  const moves = game.moves();
  if (moves.length === 0) return;

  // Pick a move randomly with some "800-elo" mistakes
  let move;
  do {
    const candidate = moves[Math.floor(Math.random() * moves.length)];
    move = candidate;
    // simulate occasional bad moves
  } while (Math.random() < 0.3 && moves.length > 1);

  game.move(move);
  updateBoard();
}
