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
	constructor(scene, id, x1, x2, y1, y2, complexity) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.complexity = complexity;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.indices = []; 
		this.normals = [];
		this.staticTexCoords = [];

		const complexityPercent = 1/this.complexity

		const deltaX = Math.abs(this.x1-this.x2) / this.complexity;
		const deltaY = Math.abs(this.y1-this.y2) / this.complexity;
		for(var i = 0; i <= this.complexity; i++){
			for(var j = 0; j <= this.complexity; j++){
				this.vertices.push(this.x1 + j*deltaX, this.y1 + i*deltaY, 0)

				//initStaticTexCoords
				this.staticTexCoords.push(j*complexityPercent, 1-i*complexityPercent)

				this.normals.push(0, 0, 1)
				if(i!= this.complexity && j!= this.complexity){
					this.indices.push(i * (this.complexity + 1) + j, i * (this.complexity + 1) + j + 1, (i + 1) * (this.complexity + 1) + j)
					this.indices.push((i + 1) * (this.complexity + 1) + j,  i * (this.complexity + 1) + j + 1, (i + 1) * (this.complexity + 1) + j + 1 )
				}
			}
		}

		this.updateTexCoords(1, 1);
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();

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

