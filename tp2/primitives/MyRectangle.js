import { CGFobject } from '../../lib/CGF.js';
import '../../lib/CGF.js'
/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - X coordinate of the vertix number 1
 * @param x2 - X coordinate of the vertix number 2
 * @param y1 - y coordinate of the vertix number 1
 * @param y2 - y coordinate of the vertix number 2
 */
export class MyRectangle extends CGFobject {
	constructor(scene, id, x1, x2, y1, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		/*
		Texture coords (s,t)
		+----------> s
		|
		|
		|
		v
		t
		*/

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]
		this.initStaticTexCoords();
		this.updateTexCoords(1, 1);
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();

	}

	initStaticTexCoords() {
		let p1 = vec3.fromValues(this.x1, this.y1, 0);
		let p2 = vec3.fromValues(this.x2, this.y1, 0);
		let p3 = vec3.fromValues(this.x1, this.y2, 0);
		let u2, v2;
		let dist_p1_p2 = vec3.distance(p1, p2);
		let dist_p1_p3 = vec3.distance(p1, p3);
		u2 = dist_p1_p2;
		v2 = dist_p1_p3;

		this.staticTexCoords = [
			0, v2,
			u2, v2,
			0, 0,
			u2, 0
		]
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 */
	updateTexCoords(length_s, length_t) {
		this.texCoords = this.staticTexCoords.map((val, index) => {
			if (index % 2 == 0) {
				return val / length_s;
			}
			else {
				return val / length_t;
			}
		})
		this.updateTexCoordsGLBuffers();
	}

}

