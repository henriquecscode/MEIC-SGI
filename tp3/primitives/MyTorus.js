import { CGFobject } from '../../lib/CGF.js';
import { normalize } from './normalize.js';
/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - inner radius of torus 
 * @param outter - outter radius of torus
 * @param slices - number of slices of torus 
 * @param loops - number of loops of torus
 */
export class MyTorus extends CGFobject {
	constructor(scene, id,  inner, outer, slices, loops) {
		super(scene);

        this.inner = inner
        this.outer = outer
        this.slices = slices
        this.loops = loops 

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];

		//Counter-clockwise reference of vertices
		this.indices = [];

		//Facing Z positive
		this.normals = [];
        this.texCoords=[];

        var innerRadiusStep = 2* Math.PI / this.slices;
        var outerRadiusStep = 2* Math.PI / this.loops;
		
        var current_angInner = 0;
        var current_angOuter = 0;

        var total_vertices = this.loops * this.slices

        for (var i=0; i <= this.loops; i++){
            current_angInner = 0
            for(var j = 0; j <= this.slices; j++){
                
                var x = (this.outer + this.inner * Math.cos(current_angInner)) * Math.cos(current_angOuter)
                var y = (this.outer + this.inner * Math.cos(current_angInner)) * Math.sin(current_angOuter)
                var z = this.inner * Math.sin(current_angInner);
                
                this.vertices.push(x, y, z);
                
                var t = i*(1.0/this.loops)
                var s =  j*(1.0/this.slices)
                this.texCoords.push(s, t)
                // calculate center
                var cent_x = this.outer * Math.cos(current_angOuter)
                var cent_y = this.outer * Math.sin(current_angOuter)
                var cent_z = 0

                var normals = normalize(x - cent_x, y - cent_y, z - cent_z)
                this.normals.push(normals[0], normals[1], normals[2])

                if(i != this.loops && j!=this.slices){
                    this.indices.push(j+1 + ((i+1)*(this.slices +1)), j+1 + (i*(this.slices +1)), j + (i*(this.slices +1)))
                    this.indices.push(j + ((i+1)*(this.slices +1)), j+1 + ((i+1)*(this.slices +1)), j + (i*(this.slices +1)))
                }
                
                current_angInner += innerRadiusStep
            }
            current_angOuter += outerRadiusStep;
        }

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the Torus
	 * @param {Array} coords - Array of texture coordinates
	 */
     updateTexCoords(length_s, length_t) {
	}
}

