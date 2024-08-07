import { CGFnurbsObject, CGFnurbsSurface } from "../../lib/CGF.js";

/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Name of the primitive
 * @param degree_u - Degree of coordinate u
 * @param part_u - Number of parts in coordinate u
 * @param degree_v - Degree of coordinate v
 * @param part_v - Number of parts in coordinate v
 * @param points - Control points for patch
 */
export class Patch extends CGFnurbsObject {

    constructor(scene, id, degree_u, parts_u, degree_v, parts_v, points){
        let weight = 1;
        for(let i = 0; i < points.length; i++){
            for(let j = 0; j < points[0].length; j++){
                points[i][j].push(weight);
            }
        }
        let obj = new CGFnurbsSurface(degree_u, degree_v, points);
        super(scene, parts_u, parts_v, obj)
        this.id = id;
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 */
	updateTexCoords(length_s, length_t) {}

}