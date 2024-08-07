import { Sprite } from "./Sprite.js";

export class StaticSprite extends Sprite {

    constructor(id, sceneGraph, text, scalex = 1, scaley = 1, posx = 0, posy = 0, material = null) {
        super(id, sceneGraph, text, scalex, scaley, material);
        this.posx = posx;
        this.posy = posy;

        window.addEventListener('resize', () => {
            this.updateStaticPosition();
        })
    }

    setPositionDisplay() {
        this.sceneGraph.scene.gl.disable(this.sceneGraph.scene.gl.DEPTH_TEST);
        this.sceneGraph.scene.loadIdentity();
        this.sceneGraph.scene.translate(this.posx, this.posy, -15);
        super.setPositionDisplay();
    }

    updateStaticPosition() {
        let canvas = this.sceneGraph.scene.gl.canvas;
        let width = canvas.width;
        let height = canvas.height;
        // console.log('STATIC SPRITE', width, height);

    }
}