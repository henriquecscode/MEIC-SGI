import { Patch } from '../../primitives/patch.js';
export function patchParser(grandChildren, primitiveId) {
    // x1
    let patch = grandChildren[0];
    var degree_u = this.reader.getInteger(patch, 'degree_u');
    if (!(degree_u != null && !isNaN(degree_u)))
        return "unable to parse degree_u of the primitive attributes for ID = " + primitiveId;

    var parts_u = this.reader.getInteger(patch, 'parts_u');
    if (!(parts_u != null && !isNaN(parts_u)))
        return "unable to parse parts_u of the primitive attributes for ID = " + primitiveId;


    var degree_v = this.reader.getInteger(patch, 'degree_v');
    if (!(degree_v != null && !isNaN(degree_v)))
        return "unable to parse degree_v of the primitive attributes for ID = " + primitiveId;


    var parts_v = this.reader.getInteger(patch, 'parts_v');
    if (!(parts_v != null && !isNaN(parts_v)))
        return "unable to parse parts_v of the primitive attributes for ID = " + primitiveId;

    let no_control_points = (degree_u + 1) * (degree_v + 1)
    let control_points_elements = patch.children

    if (no_control_points != control_points_elements.length) {
        return "Not " + no_control_points + " control points for primitive of ID = " + primitiveId
    }

    let control_points = [], unordered_control_points = [];
    for (let i = 0; i < (degree_u + 1); i++) {
        control_points.push([]);
    }
    for (let i = 0; i < no_control_points; i++) {
        let control_point = control_points_elements[i];
        if (control_point.nodeName != "controlpoint") {
            return " unknown tag < " + control_point.nodeName + " > for primitive " + primitiveId;
        }
        let point = this.parseCoordinates3D(control_point, "control point " + i + " for primitive " + primitiveId);
        unordered_control_points.push(point);
    }
    for (let i = 0; i < (degree_u + 1); i++) {
        for (let j = 0; j < (degree_v + 1); j++) {
            control_points[i].push(unordered_control_points[i * (degree_v + 1) + j]);
        }
    }

    // Adds a Patch factory to the data structure
    this.primitives[primitiveId] = () => {
        return new Patch(this.scene, primitiveId, degree_u, parts_u, degree_v, parts_v, control_points);
    };

}