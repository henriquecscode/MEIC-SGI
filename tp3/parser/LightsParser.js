import { toRads } from "../utils/utilities.js";

export function lightsParser(lightsNode) {
    var children = lightsNode.children;

    this.lights = [];
    var numLights = 0;

    var grandChildren = [];
    var nodeNames = [];

    // Any number of lights.
    for (var i = 0; i < children.length; i++) {

        // Storing light information
        var global = [];
        var attributeNames = [];
        var attributeTypes = [];

        //Check type of light
        if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
            this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
            continue;
        }
        else {
            attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
            attributeTypes.push(...["position", "color", "color", "color", "attenuation"]);
        }

        // Get id of the current light.
        var lightId = this.reader.getString(children[i], 'id');
        if (lightId == null)
            return "no ID defined for light";

        // Checks for repeated IDs.
        if (this.lights[lightId] != null)
            return "ID must be unique for each light (conflict: ID = " + lightId + ")";

        // Light enable/disable
        var enableLight = true;
        var aux = this.reader.getBoolean(children[i], 'enabled');
        if (!(aux != null && !isNaN(aux) && (aux == true || aux == false))){
            this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
            aux = true;
        }

        enableLight = aux;

        //Add enabled boolean and type name to light info
        global.push(enableLight);
        global.push(children[i].nodeName);

        grandChildren = children[i].children;
        // Specifications for the current light.

        nodeNames = [];
        for (var j = 0; j < grandChildren.length; j++) {
            nodeNames.push(grandChildren[j].nodeName);
        }

        for (var j = 0; j < attributeNames.length; j++) {
            var attributeIndex = nodeNames.indexOf(attributeNames[j]);

            if (attributeIndex != -1) {
                if (attributeTypes[j] == "position")
                    var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID " + lightId);
                else if (attributeTypes[j] == "color")
                    var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID " + lightId, true);
                else
                    var aux = parseAttenuation.call(this, grandChildren[attributeIndex], "attenuation for ID " + lightId);

                if (!Array.isArray(aux))
                    return aux;

                global.push(aux);
            }
            else
                return "light " + attributeNames[j] + " undefined for ID = " + lightId;
        }

        // Gets the additional attributes of the spot light
        if (children[i].nodeName == "spot") {
            var angle = this.reader.getFloat(children[i], 'angle');
            if (!(angle != null && !isNaN(angle)))
                return "unable to parse angle of the light for ID = " + lightId;

            var exponent = this.reader.getFloat(children[i], 'exponent');
            if (!(exponent != null && !isNaN(exponent)))
                return "unable to parse exponent of the light for ID = " + lightId;

            var targetIndex = nodeNames.indexOf("target");

            // Retrieves the light target.
            var targetLight = [];
            if (targetIndex != -1) {
                var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                if (!Array.isArray(aux))
                    return aux;

                targetLight = aux;
            }
            else
                return "light target undefined for ID = " + lightId;

            global.push(...[angle, exponent, targetLight])
        }

        this.lights[lightId] = global;
        numLights++;
    }

    if (numLights == 0)
        return "at least one light must be defined";
    else if (numLights > 8)
        this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

    this.log("Parsed lights");
    return null;
}

function parseAttenuation(node, messageError) {
    var attenuations = [];

    // constant
    var c = this.reader.getFloat(node, 'constant');
    if (!(c != null && !isNaN(c) && (c == 1 || c == 0)))
        return "unable to parse constant component of the " + messageError + ". Must be either 0 or 1";

    // linear
    var l = this.reader.getFloat(node, 'linear');
    if (!(l != null && !isNaN(l) && (l == 1 || l == 0)))
        return "unable to parse linear component of the " + messageError + ". Must be either 0 or 1";

    // quadratic
    var q = this.reader.getFloat(node, 'quadratic');
    if (!(q != null && !isNaN(q) && (q == 1 || q == 0)))
        return "unable to parse quadratic component of the " + messageError + ". Must be either 0 or 1";

    if (c + l + q > 1) {
        return "only one of the attenuations must be 1 for the " + messageError;
    }
    attenuations.push(...[c, l, q]);

    return attenuations;

}