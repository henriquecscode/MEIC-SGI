import { CGFobject } from '../../lib/CGF.js';
import { normalize } from './normalize.js';
/**
 * MyCircld
 * @constructor
 * @param scene - Reference to MyScene object
 * @param base - Radius of the base of the cylinder
 * @param top - Radius of the top of the cylinder
 * @param height - Height of the cylinder
 * @param slices - number of slices 
 * @param stacks - number of stacks 
 */
export class MyCircle extends CGFobject {
    constructor(scene, id, height, radius, slices, direction) {
        super(scene);
        this.height = height;
        this.radius = radius;
        this.slices = slices;
        this.direction = direction / Math.abs(direction);

        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var current_ang = 0;
        var ang_step = 2 * Math.PI / this.slices;
        var current_radius = this.base;

        // Center
        this.vertices.push(0, 0, this.height);
        this.normals.push(0, 0, this.direction);


        // Points
        for (var i = 0; i <= this.slices; i++) {
            var cos = Math.cos(current_ang);
            var sin = Math.sin(current_ang);
            var x = this.radius * cos;
            var y = this.radius * sin;
            var z = this.height;
            this.vertices.push(x, y, z);
            this.texCoords.push(0.5 + cos, 0.5 + sin)
            this.normals.push(0, 0, this.direction);
            current_ang += this.direction * ang_step // Multiplicate by direction to invert the circle

            if (i != this.slices) {
                this.indices.push(0, i, i+1)
            }
            else{
                this.indices.push(0, i, 1)
            }
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

