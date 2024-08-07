import { InheritedTexture } from "../textures/InheritedTexture.js";
import { Texture } from "../textures/Texture.js";
import { CGFscene } from '../../lib/CGF.js';
import { CGFaxis, CGFcamera, CGFshader } from '../../lib/CGF.js';
import { Material } from "../materials/Material.js";
import { CheckersCellComponent } from "./CheckersCellComponent.js";
import { NonCheckersCellComponent } from "./NonCheckersCellComponent.js";
import { CheckerComponent } from "./CheckerComponent.js";
import { MainBoardComponent } from "./MainBoardComponent.js";
import { SecondaryBoardComponent } from "./SecondaryBoardComponent.js";
import { CGFtexture } from "../../lib/CGF.js";
import { NoAnimation } from "../animations/NoAnimation.js";
import { NoHighlight } from "../highlighted/NoHighlight.js";
import { NoTexture } from "../textures/NoTexture.js";
import { GameState } from "../game/src/State/GameState.js";
import { Player } from "./Player.js";
import '../../lib/CGF.js'
import { Leaderboard } from "./Leaderboard.js";
import { StaticComponent } from "../components/StaticComponent.js";
import { Spotlight } from "./Spotlight.js";

export class GameComponent extends StaticComponent {

    MAIN = 'main-board'
    FIRST = 'first-board'
    SECOND = 'second-board'
    PADDINGX = 0.05;
    PADDINGY = 0.05;
    BOARD_CELL_OFFSET = 0.01;
    CHECKER_SIZE_TO_CELL = 0.8;
    CHECKER_HEIGHT = 0.03;
    CHECKER_SIZE = {
        radius: 0.5 * this.CHECKER_SIZE_TO_CELL,
        height: this.CHECKER_HEIGHT
    }
    size = {
        x: (1 - 2 * this.PADDINGX) / 8,
        y: (1 - 2 * this.PADDINGY) / 8
    }

    constructor(id, sceneGraph, boardData) {
        super(id, sceneGraph);
        this.boards = {};
        this.createFromData(boardData);

        this.selectedBoard = null;

    }

    createFromData(boardData) {
        this.createTransformations(boardData);
        this.createMaterials(boardData);
        this.createTextures(boardData);
        this.createGame(boardData);
        this.createLeaderboard();
        this.createP1Board();
        this.createP2Board();
        this.createBoard();
        this.createSpotlight();
    }

    createTransformations(boardData) {
        this.boardTransformation = boardData.boardTransformation;
        this.p1BoardTransformation = boardData.p1BoardTransformation;
        this.p2BoardTransformation = boardData.p2BoardTransformation;
    }

    loadAssignMaterials(boardData) {
        let material;
        material = boardData.whiteCellMaterial;
        this.whiteCellMaterial = new Material(this.sceneGraph.scene, material.shininess, material.lightComponents);
        material = boardData.whiteCellMaterialActive;
        this.whiteCellMaterialActive = new Material(this.sceneGraph.scene, material.shininess, material.lightComponents);
        material = boardData.blackCellMaterial;
        this.blackCellMaterial = new Material(this.sceneGraph.scene, material.shininess, material.lightComponents);
        material = boardData.blackCellMaterialActive;
        this.blackCellMaterialActive = new Material(this.sceneGraph.scene, material.shininess, material.lightComponents);
        material = boardData.boardMaterial;
        this.boardMaterial = new Material(this.sceneGraph.scene, material.shininess, material.lightComponents);

        material = boardData.whiteCheckerMaterial;
        this.whiteCheckerMaterial = new Material(this.sceneGraph.scene, material.shininess, material.lightComponents);
        material = boardData.whiteCheckerMaterialActive;
        this.whiteCheckerMaterialActive = new Material(this.sceneGraph.scene, material.shininess, material.lightComponents);
        material = boardData.blackCheckerMaterial;
        this.blackCheckerMaterial = new Material(this.sceneGraph.scene, material.shininess, material.lightComponents);
        material = boardData.blackCheckerMaterialActive;
        this.blackCheckerMaterialActive = new Material(this.sceneGraph.scene, material.shininess, material.lightComponents);

        this.material = this.boardMaterial;
    }

    createMaterials(boardData) {
        this.loadAssignMaterials(boardData);
    }

    loadAssignTextures(boardData) {
        let texture, CFGTexture;
        texture = boardData.whiteCellTexture;
        CFGTexture = new CGFtexture(this.sceneGraph.scene, texture);
        this.whiteCellTexture = new Texture('white-cell-texture', CFGTexture, 1, 1);
        texture = boardData.whiteCellTextureActive;
        CFGTexture = new CGFtexture(this.sceneGraph.scene, texture);
        this.whiteCellTextureActive = new Texture('white-cell-texture', CFGTexture, 1, 1);
        texture = boardData.blackCellTexture;
        CFGTexture = new CGFtexture(this.sceneGraph.scene, texture);
        this.blackCellTexture = new Texture('black-cell-texture', CFGTexture, 1, 1);
        texture = boardData.blackCellTextureActive;
        CFGTexture = new CGFtexture(this.sceneGraph.scene, texture);
        this.blackCellTextureActive = new Texture('black-cell-texture', CFGTexture, 1, 1);
        texture = boardData.boardTexture;
        CFGTexture = new CGFtexture(this.sceneGraph.scene, texture);
        this.boardTexture = new Texture('board-texture', CFGTexture, 1, 1);

        texture = boardData.whiteCheckerTexture;
        CFGTexture = new CGFtexture(this.sceneGraph.scene, texture);
        this.whiteCheckerTexture = new Texture('white-checker-texture', CFGTexture, 1, 1);
        texture = boardData.whiteCheckerTextureActive;
        CFGTexture = new CGFtexture(this.sceneGraph.scene, texture);
        this.whiteCheckerTextureActive = new Texture('white-checker-texture', CFGTexture, 1, 1);
        texture = boardData.blackCheckerTexture;
        CFGTexture = new CGFtexture(this.sceneGraph.scene, texture);
        this.blackCheckerTexture = new Texture('black-checker-texture', CFGTexture, 1, 1);
        texture = boardData.blackCheckerTextureActive;
        CFGTexture = new CGFtexture(this.sceneGraph.scene, texture);
        this.blackCheckerTextureActive = new Texture('black-checker-texture', CFGTexture, 1, 1);
    }

    createTextures(boardData) {
        this.loadAssignTextures(boardData);
    }

    createGame(boardData) {
        this.game = boardData.engine
        this.game.setGameComponent(this);
        //Create the checkers (we shall deal with animations later)
    }


    createBoard() {
        let id = this.MAIN;
        let board = new MainBoardComponent(id, this.sceneGraph, this, this.boardTransformation, this.boardMaterial, this.boardTexture)
        this.boards[id] = board;
        this.components.push(board);
    }

    createP1Board() {
        let id = this.FIRST
        let board = new SecondaryBoardComponent(id, this.sceneGraph, this, this.p1BoardTransformation, this.boardMaterial, this.boardTexture);
        this.boards[id] = board;
        this.components.push(board);
        this.p1 = new Player('b', board);
    }

    createP2Board() {
        let id = this.SECOND;
        let board = new SecondaryBoardComponent(id, this.sceneGraph, this, this.p2BoardTransformation, this.boardMaterial, this.boardTexture);
        this.boards[id] = board;
        this.components.push(board);
        this.p2 = new Player('w', board);
    }

    createLeaderboard() {
        this.leaderboard = new Leaderboard(this.sceneGraph, this);
    }

    createSpotlight() {
        this.spotlight = new Spotlight(this.sceneGraph, this);
    }

    draw(path, thisMaterial, thisTexture) {
        super.draw(path, thisMaterial, thisTexture)
        this.leaderboard.display(path + ' ' + this.id, thisMaterial, thisTexture);
    }

    pickSquare(board, i, j) {
        if (board instanceof MainBoardComponent) {
            this.game.state.pick(i, j, this);
        }
    }

    pickCell(board, i, j) {
        this.pickSquare(board, i, j);
    }

    pickChecker(board, i, j) {
        this.pickSquare(board, i, j);
    }

    getChecker(i, j) {
        return this.game.state.getChecker(i, j);
    }

    movePiece(i1, j1, i2, j2) {
        this.boards[this.MAIN].movePiece(i1, j1, i2, j2)
    }

    displaySelection(i, j) {
        this.boards[this.MAIN].doPickInBoard(i, j)
    }

    makeQueen(i, j){
        this.boards[this.MAIN].checkers[[i, j]].makeQueen()
    }

    resetBoards(){
        for (let board of Object.values(this.boards)) {
            board.resetBoard();
        }

    }
}