class OpponentAIE {
    constructor() {
        OpponentAIE.foundBoatCell = false;
        OpponentAIE.firstCell = [-1, -1];
        OpponentAIE.lastCell = [-1, -1];
        OpponentAIE.directionCode = -1;
        OpponentAIE.testedDirections = [false, false, false, false];
    }

    static checkForBoat(w, h, dir = -1) {
        if (OpponentAIE.checkIfValidCell(w, h) && Player.grid[w][h] === 1) {
            OpponentAIE.foundBoatCell = true;
            if (OpponentAIE.firstCell[0] === -1) {
                OpponentAIE.firstCell = [w, h];
            }
            OpponentAIE.lastCell = [w, h];
            OpponentAIE.directionCode = dir;
            return true;
        }
        return false;
    }

    static checkForSunkenBoat(w, h) {
        if (Player.grid[w][h] === 4) {
            OpponentAIE.foundBoatCell = false;
            OpponentAIE.firstCell = [-1, -1];
            OpponentAIE.lastCell = [-1, -1];
            OpponentAIE.directionCode = -1;
            OpponentAIE.testedDirections = [false, false, false, false];
        }
    }

    static newRandomCell() {
        var randomCell = Game.randomCell();
        while (Player.grid[randomCell[0]][randomCell[1]] !== 0 && Player.grid[randomCell[0]][randomCell[1]] !== 1) {
            randomCell = Game.randomCell();
        }
        return randomCell;
    }

    static checkIfValidCell(w, h) {
        return !(w < 0 || h < 0 || w >= Game.gridSize || h >= Game.gridSize);
    }

    static giveCell() {
        if (OpponentAIE.lastCell[0] !== -1) {
            OpponentAIE.checkForSunkenBoat(OpponentAIE.lastCell[0], OpponentAIE.lastCell[1]);
        }
        if (!OpponentAIE.foundBoatCell) {
            var cell = OpponentAIE.newRandomCell();
            var boat = new Boat('player', 1, 'H', cell[0], cell[1], false);
            while (!boat.fitsInGrid(false)) {
                cell = OpponentAIE.newRandomCell();
                boat = new Boat('player', 1, 'H', cell[0], cell[1], false);
            }
            OpponentAIE.checkForBoat(cell[0], cell[1]);
        } else {
            var cell = OpponentAIE.newRandomCell();
            if (!OpponentAIE.checkIfValidCell(cell[0], cell[1]) || Player.grid[cell[0]][cell[1]] === 2) {
                cell = OpponentAIE.newRandomCell();
            }
        }
        return cell;
    }
}
