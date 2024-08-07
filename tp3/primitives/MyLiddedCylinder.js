import { CGFobject } from '../../lib/CGF.js';
import { normalize } from './normalize.js';
import { MyCylinder } from './MyCylinder.js';
import { MyCircle } from './MyCircle.js';
/**
 * MyLiddedCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param base - Radius of the base of the cylinder
 * @param top - Radius of the top of the cylinder
 * @param height - Height of the cylinder
 * @param slices - number of slices 
 * @param stacks - number of stacks 
 */
export class MyLiddedCylinder {
	constructor(scene, id, base, top, height, slices, stacks) {
		this.id = id;
		this.cylinder = new MyCylinder(scene, id + '-cylinder', base, top, height, slices, stacks);
		this.lid1 = new MyCircle(scene, id + '-lid1', 0, base, slices, -1);
		this.lid2 = new MyCircle(scene, id + '-lid2', height, top, slices, 1);
	}

	display() {
		this.cylinder.display();
		this.lid1.display();
		this.lid2.display();
	}

	/**
 * @method updateTexCoords
 * Updates the list of texture coordinates of the Cylinder
 */
	updateTexCoords(length_s, length_t) {
		this.cylinder.updateTexCoords(length_s, length_t);
		this.lid1.updateTexCoords(length_s, length_t);
		this.lid2.updateTexCoords(length_s, length_t);
	}
}

