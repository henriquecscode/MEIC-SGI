import { triangleParser } from './primitivesParser/TriangleParser.js';
import { rectangleParser } from './primitivesParser/RectangleParser.js';
import { cylinderParser } from './primitivesParser/CylinderParser.js';
import { sphereParser } from './primitivesParser/SphereParser.js';
import { torusParser } from './primitivesParser/TorusParser.js';
import { patchParser } from './primitivesParser/PatchParser.js';


export function primitiveParser(primitivesNode) {
    var children = primitivesNode.children;

    this.primitives = [];

    var grandChildren = [];

    // Any number of primitives.
    for (var i = 0; i < children.length; i++) {

        if (children[i].nodeName != "primitive") {
            this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
            continue;
        }

        // Get id of the current primitive.
        var primitiveId = this.reader.getString(children[i], 'id');
        if (primitiveId == null)
            return "no ID defined for texture";

        // Checks for repeated IDs.
        if (this.primitives[primitiveId] != null)
            return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

        grandChildren = children[i].children;

        // Validate the primitive type
        if (grandChildren.length != 1 ||
            (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'patch')) {
            return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
        }

        // Specifications for the current primitive.
        var primitiveType = grandChildren[0].nodeName;

        // Retrieves the primitive coordinates.
        if (primitiveType == 'rectangle') {
            var value = rectangleParser.call(this, grandChildren, primitiveId);
            if (value != null) return value
        } else if (primitiveType == 'triangle') {
            var value = triangleParser.call(this, grandChildren, primitiveId);
            if (value != null) return value
        } else if (primitiveType == 'cylinder') {
            var value = cylinderParser.call(this, grandChildren, primitiveId);
            if (value != null) return value
        } else if (primitiveType == 'sphere') {
            var value = sphereParser.call(this, grandChildren, primitiveId);
            if (value != null) return value
        } else if (primitiveType == 'torus') {
            var value = torusParser.call(this, grandChildren, primitiveId);
            if (value != null) return value
        } else if (primitiveType == 'patch') {
            var value = patchParser.call(this, grandChildren, primitiveId);
        }
        else {
            console.warn("To do: Parse other primitives.");
        }
        if(typeof(value) == "string"){
            return value;
        }
    }
    this.log("Parsed primitives");
    return null;
}