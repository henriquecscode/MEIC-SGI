import { CheckerComponent } from "./CheckerComponent.js";
export class PlayerCheckerComponent extends CheckerComponent {
    constructor(id, sceneGraph, game, board, player, position, size, transformation, materials, textures) {
        super(id, sceneGraph, game, board, position, size, transformation, materials, textures)
        this.originalTransformation = mat4.clone(transformation);
        this.player = player;
    }

    boardCollision(checker) {
        // super.boardCollision(checker);

        let board = checker.player.board;
        let i, j;
        for (let i = 0; i < board.cellsNumber.x; i++) {
            for (let j = 0; j < board.cellsNumber.y; j++) {
                if (board.checkers[[i, j]]) {
                    continue;
                }
                this.board.checkers[[checker.i, checker.j]].moveToBoard(board, i, j);
                return;
            }
        }
    }

    makeQueen() {
        let t = mat4.create();
        t = mat4.scale(t, t, [1, 1, 2])
        this.generalTransformationMatrix = mat4.multiply(t, this.originalTransformation, t);
        this.calcMoveChecker(this.i, this.j);
    }

    makeChecker() {
        this.generalTransformationMatrix = mat4.clone(this.originalTransformation);
        this.calcMoveChecker(this.i, this.j);
    }


}
