import { GeneralBoardComponent } from "./GeneralBoardComponent.js";

export class SecondaryBoardComponent extends GeneralBoardComponent {
    constructor(id, sceneGraph, game, transformation, material, texture) {
        let cellsNumber = {
            x: 2,
            y: 6
        }
        super(id, sceneGraph, game, cellsNumber, transformation, material, texture, cellsNumber);
    }

    setPlayer(player) {
        this.player = player;
    }
    
    resetBoard() {
        let eatenCheckers = Object.keys(this.checkers).length;

        let board = this.game.game.state.board.board;
        let checkersInPlay = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j].toLowerCase() == this.player.id) {
                    checkersInPlay++;
                }
            }
        }
        let stateCheckersEaten = 12 - checkersInPlay;
        let toRemove = eatenCheckers - stateCheckersEaten;
        this.removeChecker(toRemove);
    }

    removeChecker(toRemove) {
        for (let j = 7; j >= 0; j--) {
            for (let i = 1; i >= 0; i--) {
                if (toRemove == 0) {
                    return;
                }
                if (this.checkers[[i, j]]) {
                    delete this.checkers[[i, j]];
                    toRemove--;
                }

            }
        }
    }
}