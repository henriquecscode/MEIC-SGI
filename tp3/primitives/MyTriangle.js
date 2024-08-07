import { CGFobject } from '../../lib/CGF.js';
import { normalize } from './normalize.js';
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - X coordinate of the vertix number 1
 * @param x2 - X coordinate of the vertix number 2
 * @param x3 - X coordinate of the vertix number 3
 * @param y1 - y coordinate of the vertix number 1
 * @param y2 - y coordinate of the vertix number 2
 * @param y3 - y coordinate of the vertix number 3
 * @param z1 - z coordinate of the vertix number 1
 * @param z2 - z coordinate of the vertix number 2
 * @param z3 - z coordinate of the vertix number 3
 */
export class MyTriangle extends CGFobject {
	constructor(scene, id, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;


		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3,	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		var vectorAx = this.x2 - this.x1
		var vectorAy = this.y2 - this.y1
		var vectorAz  =this.z2 - this.z1

		var vectorBx = this.x3 - this.x1
		var vectorBy = this.y3 - this.y1
		var vectorBz  =this.z3 - this.z1

		var crossProductX = vectorAy * vectorBz - vectorBy * vectorAz
		var crossProductY = vectorBx * vectorAz - vectorAx * vectorBz
		var crossProductZ = vectorAx * vectorBy - vectorBx * vectorAy
		
		var norm1 = normalize(crossProductX, crossProductY, crossProductZ)

		this.normals = [
			norm1[0], norm1[1], norm1[2],
			norm1[0], norm1[1], norm1[2],
			norm1[0], norm1[1], norm1[2]
		];


		this.initStaticTexCoords();
		this.updateTexCoords(1,1);
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();

	}

	initStaticTexCoords() {
		let p1 = vec3.fromValues(this.x1, this.y1, this.z1);
		let p2 = vec3.fromValues(this.x2, this.y2, this.z2);
		let p3 = vec3.fromValues(this.x3, this.y3, this.z3);

		let a = vec3.distance(p1, p2);
		let c = vec3.distance(p1, p3);
		let b = vec3.distance(p2, p3);

		let cos_a = (a * a - b * b + c * c) / (2 * a * c)
		let sin_a = Math.sqrt(1 - cos_a * cos_a)

		// Comporting with webGL coordinates, starting on the top left
		this.staticTexCoords = [
			0, 1,
			a , 1,
			c * cos_a, 1 - c * sin_a
		]
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the Triangle
	 * @param {Array} coords - Array of texture coordinates
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

