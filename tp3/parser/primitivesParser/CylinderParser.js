import { MyCylinder } from "../../primitives/MyCylinder.js";
export function cylinderParser(grandChildren, primitiveId) {

    // base
    var base = this.reader.getFloat(grandChildren[0], 'base');
    if (!(base != null && !isNaN(base)))
        return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

    // top
    var top = this.reader.getFloat(grandChildren[0], 'top');
    if (!(top != null && !isNaN(top)))
        return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

    // height
    var height = this.reader.getFloat(grandChildren[0], 'height');
    if (!(height != null && !isNaN(height)))
        return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

    // slices
    var slices = this.reader.getInteger(grandChildren[0], 'slices');
    if (!(slices != null && !isNaN(slices)))
        return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

    // stacks
    var stacks = this.reader.getInteger(grandChildren[0], 'stacks');
    if (!(stacks != null && !isNaN(stacks)))
        return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

    // Adds a Cylinder factory to the data structure
    this.primitives[primitiveId] = () => {
        return new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);
    };

}