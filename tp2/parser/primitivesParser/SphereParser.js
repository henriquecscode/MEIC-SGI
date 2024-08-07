import { MySphere } from "../../primitives/MySphere.js"
export function sphereParser(grandChildren, primitiveId){

    //radius
    var radius = this.reader.getFloat(grandChildren[0], 'radius')
    if (!(radius != null && !isNaN(radius)))
        return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;
 
    //slices
    var slices = this.reader.getInteger(grandChildren[0], 'slices')
    if (!(slices != null && !isNaN(slices)))
        return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;
    
    //stacks
    var stacks = this.reader.getInteger(grandChildren[0], 'stacks')
    if (!(stacks != null && !isNaN(stacks)))
        return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;
     
    // Adds a Sphere factory to the data structure
    this.primitives[primitiveId] = ()=>{
        return new MySphere(this.scene, primitiveId, slices, stacks, radius);
    };
}