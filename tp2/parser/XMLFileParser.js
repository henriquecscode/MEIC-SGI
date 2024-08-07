// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var ANIMATIONS_INDEX = 8;
var COMPONENTS_INDEX = 9;

export function XMLFileParser(rootElement) {
    if (rootElement.nodeName != "sxs")
        return "root tag <sxs> missing";

    var nodes = rootElement.children;

    // Reads the names of the nodes to an auxiliary buffer.
    var nodeNames = [];

    for (var i = 0; i < nodes.length; i++) {
        nodeNames.push(nodes[i].nodeName);
    }

    var error;

    // Processes each node, verifying errors.

    // <scene>
    var index;
    if ((index = nodeNames.indexOf("scene")) == -1)
        return "tag <scene> missing";
    else {
        if (index != SCENE_INDEX)
            this.onXMLMinorError("tag <scene> out of order " + index);

        //Parse scene block
        if ((error = this.parseScene(nodes[index])) != null)
            return error;
    }

    // <views>
    if ((index = nodeNames.indexOf("views")) == -1)
        return "tag <views> missing";
    else {
        if (index != VIEWS_INDEX)
            this.onXMLMinorError("tag <views> out of order");

        //Parse views block
        if ((error = this.parseView(nodes[index])) != null)
            return error;
    }

    // <ambient>
    if ((index = nodeNames.indexOf("ambient")) == -1)
        return "tag <ambient> missing";
    else {
        if (index != AMBIENT_INDEX)
            this.onXMLMinorError("tag <ambient> out of order");

        //Parse ambient block
        if ((error = this.parseAmbient(nodes[index])) != null)
            return error;
    }

    // <lights>
    if ((index = nodeNames.indexOf("lights")) == -1)
        return "tag <lights> missing";
    else {
        if (index != LIGHTS_INDEX)
            this.onXMLMinorError("tag <lights> out of order");

        //Parse lights block
        if ((error = this.parseLights(nodes[index])) != null)
            return error;
    }
    // <textures>
    if ((index = nodeNames.indexOf("textures")) == -1)
        return "tag <textures> missing";
    else {
        if (index != TEXTURES_INDEX)
            this.onXMLMinorError("tag <textures> out of order");

        //Parse textures block
        if ((error = this.parseTextures(nodes[index])) != null)
            return error;
    }

    // <materials>
    if ((index = nodeNames.indexOf("materials")) == -1)
        return "tag <materials> missing";
    else {
        if (index != MATERIALS_INDEX)
            this.onXMLMinorError("tag <materials> out of order");

        //Parse materials block
        if ((error = this.parseMaterials(nodes[index])) != null)
            return error;
    }

    // <transformations>
    if ((index = nodeNames.indexOf("transformations")) == -1)
        return "tag <transformations> missing";
    else {
        if (index != TRANSFORMATIONS_INDEX)
            this.onXMLMinorError("tag <transformations> out of order");

        //Parse transformations block
        if ((error = this.parseTransformations(nodes[index])) != null)
            return error;
    }

    // <primitives>
    if ((index = nodeNames.indexOf("primitives")) == -1)
        return "tag <primitives> missing";
    else {
        if (index != PRIMITIVES_INDEX)
            this.onXMLMinorError("tag <primitives> out of order");

        //Parse primitives block
        if ((error = this.parsePrimitives(nodes[index])) != null)
            return error;
    }

    // <animations>
    if ((index = nodeNames.indexOf("animations")) == -1)
        return "tag <animations> missing";
    else {
        if (index != ANIMATIONS_INDEX)
            this.onXMLMinorError("tag <animations> out of order");

        //Parse animations block
        if ((error = this.parseAnimations(nodes[index])) != null) {
            return error;
        }
    }

    // <components>
    if ((index = nodeNames.indexOf("components")) == -1)
        return "tag <components> missing";
    else {
        if (index != COMPONENTS_INDEX)
            this.onXMLMinorError("tag <components> out of order");

        //Parse components block
        if ((error = this.parseComponents(nodes[index])) != null)
            return error;
    }

    this.log("all parsed");
}