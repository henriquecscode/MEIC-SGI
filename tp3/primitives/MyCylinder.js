import { CGFobject } from '../../lib/CGF.js';
import { normalize } from './normalize.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param base - Radius of the base of the cylinder
 * @param top - Radius of the top of the cylinder
 * @param height - Height of the cylinder
 * @param slices - number of slices 
 * @param stacks - number of stacks 
 */
export class MyCylinder extends CGFobject {
	constructor(scene, id, base, top, height, slices, stacks) {
		super(scene);
        this.base = base; 
        this.top = top; 
        this.height = height; 
        this.slices = slices; 
		this.stacks = stacks;

		this.initBuffers();
	}
	
    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var current_ang = 0;
        var ang_step = 2 * Math.PI / this.slices;
        
        var radius_step = (this.top - this.base) / this.stacks;
        var current_radius = this.base;


        var znorm = (this.base - this.top) / this.height

        var current_height = 0;
        var height_step = this.height / this.stacks;
        
        
        for(var i = 0; i <= this.stacks ; i++){
            current_ang = 0;
            for(var j = 0; j <= this.slices; j++){
                var x = current_radius *  Math.cos(current_ang);
                var y = current_radius * Math.sin(current_ang);
                var z = current_height;
                this.vertices.push(x, y, z);
                var t = i*(1.0/this.stacks)
                var s =  j*(1.0/this.slices)
                this.texCoords.push(s, t)
                var norm = normalize(Math.cos(current_ang), Math.sin(current_ang), znorm)
                this.normals.push(norm[0], norm[1], norm[2]);
                current_ang += ang_step

                if(i != this.stacks && j!=this.slices){
                    this.indices.push(j + (i*(this.slices +1)), j+1 + (i*(this.slices +1)), j+1 + ((i+1)*(this.slices +1)))
                    this.indices.push(j + (i*(this.slices +1)), j+1 + ((i+1)*(this.slices +1)), j + ((i+1)*(this.slices +1))) 
                }
            }
            current_height += height_step
            current_radius += radius_step
        }
        
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    
    }


	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the Cylinder
	 */
     updateTexCoords(length_s, length_t) {
	}
}

