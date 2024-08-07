import '../../lib/CGF.js';
import { MyQuad } from "../primitives/MyQuad.js";
import { StaticComponent } from "./StaticComponent.js";
import { PrimitivePart } from "./PrimitivePart.js";
import { Sprite } from '../sprites/Sprite.js';


var angle = Math.PI / 2;

var topTransformation = mat4.create();
topTransformation = mat4.translate(topTransformation, topTransformation, [0, 0.5, 0]);
topTransformation = mat4.rotate(topTransformation, topTransformation, -angle, [1, 0, 0]);


var bottomTransformation = mat4.create();
bottomTransformation = mat4.translate(bottomTransformation, bottomTransformation, [0, -0.5, 0]);
bottomTransformation = mat4.rotate(bottomTransformation, bottomTransformation, angle, [1, 0, 0]);

var leftTransformation = mat4.create();
leftTransformation = mat4.translate(leftTransformation, leftTransformation, [-0.5, 0, 0]);
leftTransformation = mat4.rotate(leftTransformation, leftTransformation, -angle, [0, 1, 0]);

var rightTransformation = mat4.create();
rightTransformation = mat4.translate(rightTransformation, rightTransformation, [0.5, 0, 0]);
rightTransformation = mat4.rotate(rightTransformation, rightTransformation, angle, [0, 1, 0]);

var frontTransformation = mat4.create();
frontTransformation = mat4.translate(frontTransformation, frontTransformation, [0, 0, 0.5]);

var backTransformation = mat4.create();
backTransformation = mat4.translate(backTransformation, backTransformation, [0, 0, -0.5]);
backTransformation = mat4.rotate(backTransformation, backTransformation, 2 * angle, [0, 1, 0]);

export class CubeComponent extends StaticComponent {
    constructor(id, sceneGraph, transformation, materials = undefined, texture = undefined, animation = undefined, highlight = undefined, doPick = undefined) {
        super(id, sceneGraph, transformation, materials, texture, animation, highlight, doPick);
        this.initializeSides();
    }

    initializeSides() {
        let scene = this.sceneGraph.scene;
        let topComp = new PrimitivePart(this.id + '-top', this.sceneGraph, new MyQuad(scene), topTransformation);
        let bottomComp = new PrimitivePart(this.id + '-bottom', this.sceneGraph, new MyQuad(scene), bottomTransformation);
        let leftComp = new PrimitivePart(this.id + '-left', this.sceneGraph, new MyQuad(scene), leftTransformation);
        let rightComp = new PrimitivePart(this.id + '-right', this.sceneGraph, new MyQuad(scene), rightTransformation);
        let frontComp = new PrimitivePart(this.id + '-front', this.sceneGraph, new MyQuad(scene), frontTransformation);
        let backComp = new PrimitivePart(this.id + '-back', this.sceneGraph, new MyQuad(scene), backTransformation);
        let sides = [topComp, bottomComp, leftComp, rightComp, frontComp, backComp];
        this.surface = topComp;
        this.surfaceTransformation = topTransformation;
        super.addComponents(sides);
    }

}