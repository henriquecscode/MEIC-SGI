import { CellComponent } from "./CellComponent.js";

export class CheckersCellComponent extends CellComponent {
    constructor(id, sceneGraph, game, board, position, size, transformation, materials, textures, animation, highlight) {
        super(id, sceneGraph, game, board, position, size, transformation, materials, textures, animation, highlight);
    }
}