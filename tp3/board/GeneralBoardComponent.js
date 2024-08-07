import { MyRectangle } from "../primitives/MyRectangle.js";
import { Material } from "../materials/Material.js";
import { Texture } from "../textures/Texture.js";
import { NoAnimation } from "../animations/NoAnimation.js";
import { NoHighlight } from "../highlighted/NoHighlight.js";
import { CheckersCellComponent } from "./CheckersCellComponent.js";
import { CheckerComponent } from "./CheckerComponent.js";
import { PlayerCheckerComponent } from "./PlayerCheckerComponent.js";
import { StaticComponent } from "../components/StaticComponent.js";

export class GeneralBoardComponent extends StaticComponent {
    constructor(id, sceneGraph, game, cellsNumber, transformation, material, texture) {
        super(id, sceneGraph, transformation, [material], texture)
        this.game = game;
        this.cellsNumber = cellsNumber;
        this.generalTransformation = transformation;
        this.cells = {};
        this.checkers = {};
        this.createBoard();

        this.selecting = false; //DEBUG
    }

    createBoard() {

        let width = this.cellsNumber.x * this.game.size.x + 2 * this.game.PADDINGX;
        let height = this.cellsNumber.y * this.game.size.y + 2 * this.game.PADDINGY;
        this.widthMult = width;
        this.heightMult = height;
        this.PADDINGX = this.game.PADDINGX / width;
        this.PADDINGY = this.game.PADDINGY / height;
        let boardTransformationMatrix = mat4.create();
        boardTransformationMatrix = mat4.scale(boardTransformationMatrix, boardTransformationMatrix, [width, height, 1]);
        boardTransformationMatrix = mat4.multiply(boardTransformationMatrix, this.generalTransformation, boardTransformationMatrix);
        this.transformation = boardTransformationMatrix;
        // this.primitives = [
        //     new MyRectangle(this.sceneGraph.scene, this.id, 0, width, 0, height, 3)
        // ]
        this.primitives = [
            new MyRectangle(this.sceneGraph.scene, this.id, 0, 1, 0, 1, 3)
        ]
        this.createCells();
    }

    createCells() {
        let position, size, isWhite, materials, textures;
        let sizeX = (1 - 2 * this.PADDINGX) / this.cellsNumber.x;
        let sizeY = (1 - 2 * this.PADDINGY) / this.cellsNumber.y;
        size = { x: sizeX, y: sizeY };
        this.size = size;
        let cellTransformationMatrix = mat4.create();
        cellTransformationMatrix = mat4.translate(cellTransformationMatrix, cellTransformationMatrix, [0, 0, this.game.BOARD_CELL_OFFSET]);
        // cellTransformationMatrix = mat4.multiply(cellTransformationMatrix, this.transformation, cellTransformationMatrix)
        let whiteMaterials = [this.game.whiteCellMaterial, this.game.whiteCellMaterialActive];
        let whiteTextures = [this.game.whiteCellTexture, this.game.whiteCellTextureActive];
        let blackMaterials = [this.game.blackCellMaterial, this.game.blackCellMaterialActive];
        let blackTextures = [this.game.blackCellTexture, this.game.blackCellTextureActive];
        for (let i = 0; i < this.cellsNumber.x; i++) {
            for (let j = 0; j < this.cellsNumber.y; j++) {
                let cellId = this.id + '-cell' + (i + 1) + (j + 1);
                position = { x: this.PADDINGX + i * this.size.x, y: this.PADDINGY + j * this.size.y, i: i, j: j };
                isWhite = this.isWhite(i, j);
                if (isWhite) {
                    materials = whiteMaterials;
                    textures = whiteTextures;
                } else {
                    materials = blackMaterials;
                    textures = blackTextures;
                }
                this.createCell(cellId, position, cellTransformationMatrix, materials, textures);
            }
        }
    }

    createCell(id, position, transfMatrix, materials, textures) {
        let cellComponent;
        cellComponent = new CheckersCellComponent(id, this.sceneGraph, this.game, this, position, this.size, transfMatrix, materials, textures);

        this.cells[[position.i, position.j]] = cellComponent;
    }

    isWhite(i, j) {
        return (i + j) % 2 == 0;
    }



    draw(path, thisMaterial, thisTexture) {
        super.draw(path, thisMaterial, thisTexture);
        this.drawCells();
        this.drawCheckers();
    }

    drawCells() {
        for (let cellId in this.cells) {
            let cell = this.cells[cellId];
            this.registerPick(cell);
            cell.display();
        }

    }

    drawCheckers() {
        for (let checkerId in this.checkers) {
            let checker = this.checkers[checkerId];
            this.registerPick(checker);
            checker.display();
        }
    }

    registerPick(component) {
        this.sceneGraph.scene.registerForPick(this.sceneGraph.getPickingId(), component)
    }

    pick() {
        console.log('PICKING GENERAL', this);
    }

    doPickInBoard(i, j) {
        if (this.checkers[[i, j]]) {
            this.checkers[[i, j]].toggleSelect();
            this.cells[[i, j]].toggleSelect();
        }
    }

    movePiece(i1, j1, i2, j2) {
        let checker = this.checkers[[i1, j1]];
        checker.moveInBoard(i2, j2);
        checker.toggleSelect();
        delete this.checkers[[i1, j1]];
        this.checkers[[i2, j2]] = checker;

        this.cells[[i1, j1]].toggleSelect();
    }

    removeChecker(checker) {
        delete this.checkers[[checker.i, checker.j]];
    }

    addChecker(checker, i, j) {
        this.checkers[[i, j]] = checker;
    }

    resetBoard() {
    }
}