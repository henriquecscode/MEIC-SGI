import '../../lib/CGF.js';
import { StaticComponent } from './StaticComponent.js';

//A class that allows a primitive to behave as a component, so that more components can be added more easily
export class PrimitiveEncapsulator extends StaticComponent {
    constructor(id, parent, primitive, transformation = mat4.create(), doPick = false) {
        super(id, parent.sceneGraph, transformation, parent.materials, parent.texture, parent.animation, parent.highlight, doPick);
        super.addPrimitives([primitive]);
    }

}