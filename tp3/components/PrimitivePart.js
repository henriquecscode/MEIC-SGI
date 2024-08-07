import { StaticComponent } from "./StaticComponent.js";
import { InheritedMaterial } from "../materials/InheritedMaterial.js";
import { InheritedTexture } from "../textures/InheritedTexture.js";
import { NoAnimation } from "../animations/NoAnimation.js";
import { NoHighlight } from "../highlighted/NoHighlight.js";


export class PrimitivePart extends StaticComponent {
    constructor(id, sceneGraph, primitive, transformation = mat4.create()) {
        super(id, sceneGraph, transformation, [new InheritedMaterial()], new InheritedTexture(), new NoAnimation(), new NoHighlight(), false);
        super.addPrimitives([primitive]);
    }
}