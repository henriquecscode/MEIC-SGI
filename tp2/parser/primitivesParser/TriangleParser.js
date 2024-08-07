import { MyTriangle } from '../../primitives/MyTriangle.js';
export function triangleParser(grandChildren, primitiveId) {
    var x1 = this.reader.getFloat(grandChildren[0], 'x1');
    if (!(x1 != null && !isNaN(x1)))
        return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

    // y1
    var y1 = this.reader.getFloat(grandChildren[0], 'y1');
    if (!(y1 != null && !isNaN(y1)))
        return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

    // z1
    var z1 = this.reader.getFloat(grandChildren[0], 'z1');
    if (!(z1 != null && !isNaN(z1)))
        return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

    // x2
    var x2 = this.reader.getFloat(grandChildren[0], 'x2');
    if (!(x2 != null && !isNaN(x2)))
        return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

    // y2
    var y2 = this.reader.getFloat(grandChildren[0], 'y2');
    if (!(y2 != null && !isNaN(y2)))
        return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

    // z2
    var z2 = this.reader.getFloat(grandChildren[0], 'z2');
    if (!(z2 != null && !isNaN(z2)))
        return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

    // x3
    var x3 = this.reader.getFloat(grandChildren[0], 'x3');
    if (!(x3 != null && !isNaN(x3)))
        return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;
    var y3 = this.reader.getFloat(grandChildren[0], 'y3');
    if (!(y3 != null && !isNaN(y3)))
        return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

    var z3 = this.reader.getFloat(grandChildren[0], 'z3');
    if (!(z3 != null && !isNaN(z3)))
        return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;


// Adds a Triangle factory to the data structure
    this.primitives[primitiveId] = () => {
        return new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);
    };

}