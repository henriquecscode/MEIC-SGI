import '../../lib/CGF.js'
import { toRads } from "../utils/utilities.js"

export function transformationsParser(transformationsNode) {
    var children = transformationsNode.children;

    this.transformations = [];

    var grandChildren = [];

    // Any number of transformations.
    for (var i = 0; i < children.length; i++) {

        if (children[i].nodeName != "transformation") {
            this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
            continue;
        }

        // Get id of the current transformation.
        var transformationID = this.reader.getString(children[i], 'id');
        if (transformationID == null)
            return "no ID defined for transformation";

        // Checks for repeated IDs.
        if (this.transformations[transformationID] != null)
            return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

        grandChildren = children[i].children;
        // Specifications for the current transformation.

        var transformations = grandChildren;
        // Iterate the transformations from right to left, to ensure multiplication order
        var compositeTransformation = Array.from(transformations).reduceRight(
            (totalTransformation, transformation) => {
                var transformationMatrix = transformationParser.call(this, transformation, transformationID);
                return totalTransformation = mat4.mul(totalTransformation, transformationMatrix, totalTransformation);
            }, mat4.create()
        );
        this.transformations[transformationID] = compositeTransformation;
    }

    this.log("Parsed transformations");
    return null;
}

function transformationParser(node, componentID) {
    var transfMatrix = mat4.create();
    switch (node.nodeName) {
        case 'translate':
            transfMatrix = translationMatrix.call(this, transfMatrix, node, componentID);
            break;
        case 'scale':
            transfMatrix = scaleMatrix.call(this, transfMatrix, node, componentID);
            break;
        case 'rotate':
            transfMatrix = rotationMatrix.call(this, transfMatrix, node, componentID);
            break;
        default:
            this.onXMLMinorError('Invalid transformation for id ' + transformationID);
    }
    return transfMatrix;
}


export function translationMatrix(destinationMatrix, node, transformationId) {
    var coordinates = this.parseCoordinates3D(node, "translate transformation for ID " + transformationId);
    if (!Array.isArray(coordinates))
        return coordinates;

    destinationMatrix = mat4.translate(destinationMatrix, destinationMatrix, coordinates);
    return destinationMatrix;
}
export function scaleMatrix(destinationMatrix, node, transformationId) {
    var axis = this.parseCoordinates3D(node, "scale transformation for ID " + transformationId);
    if (!Array.isArray(axis)) {
        this.onXMLMinorError("Invalid scale transformation for component " + transformationId);
        return mat4.create();
    }
    destinationMatrix = mat4.scale(destinationMatrix, destinationMatrix, vec3.fromValues(...axis));
    return destinationMatrix;
}

export function rotationMatrix(destinationMatrix, node, transformationId) {
    var rotation = this.parseRotation(node, "rotation transformation for ID" + transformationId);
    var angle = toRads(rotation.angle);
    var axis;
    switch (rotation.axis) {
        case "x":
            axis = vec3.fromValues(1, 0, 0);
            // destinationMatrix = mat4.fromXRotation(destinationMatrix, angle)
            break;
        case "y":
            axis = vec3.fromValues(0, 1, 0);
            // destinationMatrix = mat4.fromYRotation(destinationMatrix, angle);
            break;
        case "z":
            axis = vec3.fromValues(0, 0, 1);
            // destinationMatrix = mat4.fromZRotation(destinationMatrix, angle);
            break;
    }
    destinationMatrix = mat4.rotate(destinationMatrix, mat4.create(), angle, axis);
    return destinationMatrix;
}
