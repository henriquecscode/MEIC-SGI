import { CellComponent } from "./CellComponent.js";
export class NonCheckersCellComponent extends CellComponent {
    constructor(id, sceneGraph, game, board, position, size, transformation, materials, textures, animation, highlight) {
        super(id, sceneGraph, game, board, position, size, transformation, materials, textures, animation, highlight);
    }
}