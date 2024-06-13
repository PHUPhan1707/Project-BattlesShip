class Game {
	constructor() {
		Game.hasStarted = true;
		Game.turn = Game.whoStarts();
		Game.gridSize = 10;
		Game.numBoatTypes = 5;
		Game.numBoatsPerType = [0, 0, 1, 2, 1, 1];
		Game.numBoats = Game.getNumBoats();
	}

	static getNumBoats() {
		return Game.numBoatsPerType.reduce((a, b) => a+b);
	}

	static cellCodeToString(w, h) {
		return String.fromCharCode(parseInt(w)+65) + (parseInt(h)+1);
	}

	static stateCodeToString(code) {
		switch(code) {
			case 0:
				return 'Nothing';
			case 1:
				return 'Boat';
			case 2:
				return 'Water';
			case 3:
				return 'Touched';
			case 4:
				return 'Sunken';
			default:
				throw 'Cell code must be 0, 1, 2, 3 or 4';
		}
	}
	static getBoatName(size) {
		switch (size) {
			case 1:
				return 'Patrol Boat';
			case 2:
				return 'Destroyer';
			case 3:
				return 'Submarine';
			case 4:
				return 'Cruiser';
			case 5:
				return 'Battleship';
			case 6:
				return 'Aircraft Carrier';
			default:
				return 'Unknown';
		}
	}
	static randomCell() {
		return [parseInt(Math.floor(Math.random() * Game.gridSize)), parseInt(Math.floor(Math.random() * Game.gridSize))];
	}

	static whoStarts() {
		return Math.random() < 0.5 ? 'player' : 'opponent';
	}

	static switchTurn() {
		Game.turn = Game.turn === 'player' ? 'opponent' : 'player';
	}

	static shootCell(shooter, w, h) {
		var cellValue = shooter === 'player' ? Opponent.grid[w][h] : Player.grid[w][h];
		if (cellValue < 2) {
			cellValue += 2;
		}
		if (shooter === 'player') {
			Opponent.grid[w][h] = cellValue;
		} else {
			Player.grid[w][h] = cellValue;
		}
		if (cellValue === 3) {
			var boatShot = new Boat(shooter === 'player' ? 'opponent' : 'player', 0, 'H', w, h, true);
			if (boatShot.isSunken()) {
				boatShot.sink();
				if (shooter === 'player') {
					Opponent.numBoatsAlive--;
				} else {
					Player.numBoatsAlive--;
				}
			}
		}
	}

	static setGridRandomly(gridType) {
		if (gridType !== 'player' && gridType !== 'opponent') {
			throw 'Grid must be player or opponent.';
		}
		if (gridType === 'player') {
			var grid = Player.grid;
			var boats = Player.boats;
		} else {
			var grid = Opponent.grid;
			var boats = Opponent.boats;
		}
		var stage = Game.numBoatTypes, numCellsBoat = 0, numBoatsType, i = 0, j = 0, randomCell, direction, boatID = 0;

		while (stage !== 0) {
			numBoatsType = 0;
			while (numBoatsType < Game.numBoatsPerType[stage]) {
				numCellsBoat = 0;
				i = 0;
				j = 0;
				randomCell = Game.randomCell();
				direction = Math.random() < 0.5 ? 'H' : 'V';
				var boat = new Boat(gridType, stage, direction, randomCell[0], randomCell[1], false);
				if (boat.fitsInGrid()) {
					while (numCellsBoat < stage) {
						grid[randomCell[0]+parseInt(i)][randomCell[1]+parseInt(j)] = 1;
						boats[stage-1][numBoatsType][numCellsBoat][0] = randomCell[0]+parseInt(i);
						boats[stage-1][numBoatsType][numCellsBoat][1] = randomCell[1]+parseInt(j);
						boats[stage-1][numBoatsType][-1] = direction;
						if (direction === 'H') {
							i++;
						} else {
							j++;
						}
						numCellsBoat++;
					}
					boatID++;
					numBoatsType++;
				}
			}
			stage--;
		}
		if (gridType === 'player') {
			Player.grid = grid.slice();
			Player.boats = boats.slice();
		} else {
			Opponent.grid = grid.slice();
			Opponent.boats = boats.slice();
		}
	}

	static endGame(winner) {
		MessageBox.addMsg('<b>' + winner.charAt(0).toUpperCase() + winner.slice(1) + ' won!</b>', true);
		Game.hasStarted = false;
		Graphics.unBlockCells(true);
		Graphics.unBlockRestartBtn(document.getElementById('restart_btn'), false);
	}

	static restartGame(playerGrid, opponentGrid) {
		Graphics.checkElement(playerGrid);
		Graphics.checkElement(opponentGrid);
		Game.initGame();
		Game.initGame2();
		Graphics.updateGrid('opponent', opponentGrid);
		Graphics.updateGrid('player', playerGrid);
		Graphics.unBlockCells(false);
		Graphics.unBlockRestartBtn(document.getElementById('restart_btn'), true);
		MessageBox.clear();
		Game.hasStarted = true;
	}

	static initGame() {
		var player = new Player;
		var opponent = new Opponent;
		var opponentAI = new OpponentAI;
 
	}
	static initGame2() {
		var player = new Player;
		var opponent = new Opponent;
		var opponentAIE = new OpponentAIE;

	}

	static startGame() {
		Player.placeBoats();
		Opponent.placeBoats();
	}
}