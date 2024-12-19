
var score = 0;

document.addEventListener('DOMContentLoaded', function () {
	var startBtn = document.getElementById('start_btn');


	startBtn.addEventListener('click', function () {
		// Hiển thị modal chọn chế độ khi người chơi nhấn nút "Bắt đầu"
		document.getElementById('startOptionsModal').style.display = 'block';
	});

	document.getElementById('easyModeBtn').addEventListener('click', function () {
		document.getElementById('startOptionsModal').style.display = 'none'; // Ẩn modal

		chooseOpponentAI('easy');
	});

	document.getElementById('hardModeBtn').addEventListener('click', function () {
		document.getElementById('startOptionsModal').style.display = 'none'; // Ẩn modal

		chooseOpponentAI('hard'); // Chọn AI khó
	});
	closeCongratsModal.addEventListener('click', function () {
		document.getElementById('congratsModal').style.display = 'none';
	});
	// Các phần code khác ở trong này...
});

function chooseOpponentAI(mode) {
	var playerName = document.getElementById('playerName').value;

	if (mode === 'easy') {
		// Chọn AI dễ
		var battleship = new Game;
		Game.initGame2();
		Game.startGame();

		Game.endGame = function (winner) {
			score = Game.playerScore;
			var message = winner === 'player' ? 'Congratulations, ' + playerName + '! You won with a score of ' + score + ' points!' : 'Sorry, ' + playerName + '. The opponent won. Your score: ' + score + ' points.';
			document.getElementById('congratsMessage').innerText = message;
			document.getElementById('congratsModal').style.display = 'block';
			MessageBox.addMsg('<b>' + winner.charAt(0).toUpperCase() + winner.slice(1) + ' won!</b>', true);
			Game.hasStarted = false;
			Graphics.unBlockCells(true);
			Graphics.unBlockRestartBtn(document.getElementById('restart_btn'), false);
		};

		var gridBtns = document.getElementsByClassName('grid_btn');
		var playerGrid = document.getElementById('player_grid');
		var opponentGrid = document.getElementById('opponent_grid');
		var restartBtn = document.getElementById('restart_btn');
		var messageBoxElement = document.getElementById('message_box');

		window.onerror = function (error) {
			MessageBox.addMsg('<strong>Error:</strong> ' + error, true);
		}

		Graphics.unBlockRestartBtn(restartBtn, true);

		var messageBox = new MessageBox(messageBoxElement);
		Graphics.loadGrids(playerGrid, opponentGrid, Game.gridSize);

		if (Game.turn === 'opponent') {
			MessageBox.addMsg('The opponent starts.');
			Opponent.shootCell2(); // Use OpponentAIE instead of Opponent
			Game.switchTurn();
			Graphics.updateGrid('player', playerGrid);
		} else {
			MessageBox.addMsg('You start!');
		}

		for (var i = 0; i < gridBtns.length; i++) {
			gridBtns[i].addEventListener('click', function () {
				if (Game.hasStarted) {
					if (this.getAttribute('data-type') === 'opponent') {
						if (Game.turn === 'player') {
							Player.shootCell(this.getAttribute('data-w'), this.getAttribute('data-h'));
							Graphics.updateGrid('opponent', opponentGrid);
							if (Opponent.numBoatsAlive === 0) {
								Game.endGame('player');
							} else {
								Game.switchTurn();
								Opponent.shootCell2();
								Graphics.updateGrid('player', playerGrid);
								if (Player.numBoatsAlive === 0) {
									Game.endGame('opponent');
								}
								Game.switchTurn();
							}
						} else {
							throw 'It is not your turn';
						}
					} else {
						throw 'data-type attribute must be equal to opponent';
					}
				} else {
					throw 'Game has already ended';
				}
			});
		}

		restartBtn.addEventListener('click', function () {
			if (!Game.hasStarted) {
				Game.restartGame(playerGrid, opponentGrid);
			} else {
				throw 'Game has not ended';
			}
		});
	} else if (mode === 'hard') {
		// Chọn AI khó
		var battleship = new Game;
		Game.initGame();
		Game.startGame();
		Game.endGame = function (winner) {
			score = Game.playerScore;
			var message = winner === 'player' ? 'Congratulations, ' + playerName + '! You won with a score of ' + score + ' points!' : 'Sorry, ' + playerName + '. The opponent won. Your score: ' + score + ' points.';
			document.getElementById('congratsMessage').innerText = message;
			document.getElementById('congratsModal').style.display = 'block';
			MessageBox.addMsg('<b>' + winner.charAt(0).toUpperCase() + winner.slice(1) + ' won!</b>', true);
			Game.hasStarted = false;
			Graphics.unBlockCells(true);
			Graphics.unBlockRestartBtn(document.getElementById('restart_btn'), false);
		};

		var gridBtns = document.getElementsByClassName('grid_btn');
		var playerGrid = document.getElementById('player_grid');
		var opponentGrid = document.getElementById('opponent_grid');
		var restartBtn = document.getElementById('restart_btn');
		var messageBoxElement = document.getElementById('message_box');

		window.onerror = function (error) {
			MessageBox.addMsg('<strong>Error:</strong> ' + error, true);
		}

		Graphics.unBlockRestartBtn(restartBtn, true);

		var messageBox = new MessageBox(messageBoxElement);
		Graphics.loadGrids(playerGrid, opponentGrid, Game.gridSize);

		if (Game.turn === 'opponent') {
			MessageBox.addMsg('The opponent starts.');
			Opponent.shootCell();
			Game.switchTurn();
			Graphics.updateGrid('player', playerGrid);
		} else {
			MessageBox.addMsg('You start!');
		}

		for (var i = 0; i < gridBtns.length; i++) {
			gridBtns[i].addEventListener('click', function () {
				if (Game.hasStarted) {
					if (this.getAttribute('data-type') === 'opponent') {
						if (Game.turn === 'player') {
							Player.shootCell(this.getAttribute('data-w'), this.getAttribute('data-h'));
							Graphics.updateGrid('opponent', opponentGrid);
							if (Opponent.numBoatsAlive === 0) {
								Game.endGame('player');
							} else {
								Game.switchTurn();
								Opponent.shootCell();
								Graphics.updateGrid('player', playerGrid);
								if (Player.numBoatsAlive === 0) {
									Game.endGame('opponent');
								}
								Game.switchTurn();
							}
						} else {
							throw 'It is not your turn';
						}
					} else {
						throw 'data-type attribute must be equal to opponent';
					}
				} else {
					throw 'Game has already ended';
				}
			});
		}

		restartBtn.addEventListener('click', function () {
			if (!Game.hasStarted) {
				Game.restartGame(playerGrid, opponentGrid);
			} else {
				throw 'Game has not ended';
			}
		});
	} else {
		throw 'Invalid game mode';
	}
}