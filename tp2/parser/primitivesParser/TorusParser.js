import { MyTorus } from "../../primitives/MyTorus.js";
export function torusParser(grandChildren, primitiveId){

    // <torus inner="1" outer="2" slices="4" loops="4" />
    //inner
    var inner = this.reader.getFloat(grandChildren[0], 'inner')
    if (!(inner != null && !isNaN(inner)))
        return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;
 
    //outer
    var outer = this.reader.getFloat(grandChildren[0], 'outer')
    if (!(outer != null && !isNaN(outer)))
        return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

    //slices
    var slices = this.reader.getInteger(grandChildren[0], 'slices')
    if (!(slices != null && !isNaN(slices)))
        return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;
    
    //loops
    var loops = this.reader.getInteger(grandChildren[0], 'loops')
    if (!(loops != null && !isNaN(loops)))
        return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;
     
    // Adds a Torus factory to the data structure
    this.primitives[primitiveId] = () => {
        return new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);
    };
}