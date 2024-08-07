export class ComponentSprite extends Sprite {

    constructor(id, sceneGraph, text, transformation = mat4.create()) {
        super(id, sceneGraph, text);
        this.transformation = transformation;
    }

    setPositionDisplay() {
        this.sceneGraph.scene.multMatrix(this.transformation);
        super.setPositionDisplay();
    }
}