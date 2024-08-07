import { Component } from '../components/Component.js';
import { rotationMatrix, scaleMatrix, translationMatrix } from './TransformationsParser.js';
import { Texture } from '../textures/Texture.js';
import { ComponentTexture } from '../textures/ComponentTexture.js';
import { InheritedTexture } from '../textures/InheritedTexture.js';
import { NoTexture } from '../textures/NoTexture.js';
import { InheritedMaterial } from '../materials/InheritedMaterial.js';
import { NoAnimation } from '../animations/NoAnimation.js';
import { MyAnimation } from '../animations/MyAnimation.js';
import { Highlight } from '../highlighted/Highlight.js'
import { NoHighlight } from '../highlighted/NoHighlight.js'

var componentIDs = [];

export function componentsParser(componentsNode) {

    var children = componentsNode.children;

    this.components = [];
    this.highlights = {};

    var grandChildren = [];
    var grandgrandChildren = [];
    var nodeNames = [];

    // Any number of components.
    for (var i = 0; i < children.length; i++) {
        var component = children[i];
        if (children[i].nodeName != "component") {
            this.onXMLMinorError("unknown tag <" + component.nodeName + ">");
            continue;
        }

        // Get id of the current component.
        var componentID = this.reader.getString(component, 'id');
        if (componentID == null)
            return "no ID defined for componentID";

        // Checks for repeated IDs.
        if (this.components[componentID] != null)
            return "ID must be unique for each component (conflict: ID = " + componentID + ")";

        grandChildren = component.children;

        nodeNames = [];
        for (var j = 0; j < grandChildren.length; j++) {
            nodeNames.push(grandChildren[j].nodeName);
        }

        var transformationIndex = nodeNames.indexOf("transformation");
        var materialsIndex = nodeNames.indexOf("materials");
        var textureIndex = nodeNames.indexOf("texture");
        var childrenIndex = nodeNames.indexOf("children");
        var animationIndex = nodeNames.indexOf("animation");
        var highlightedIndex = nodeNames.indexOf("highlighted");


        // Transformations
        var transformation;
        if (transformationIndex == -1) {
            return "Transformations block is mandatory. Missing <transformation> tag"
        }
        else {
            var transformationBlock = component.children[transformationIndex];
            transformation = componentTransformationParser.call(this, transformationBlock, componentID);
        }


        // Materials
        var materials = [];
        if (materialsIndex == -1) {
            return "Materials block is mandatory. Missing <materials> tag for " + componentID;
        }
        else {
            var materialsBlock = component.children[materialsIndex];
            materials = componentMaterialParser.call(this, materialsBlock, componentID);
            if (!Array.isArray(materials)) {
                return materials;
            }
        }
        // Texture
        var texture;
        if (textureIndex == -1) {
            return "Texture is mandatory. Missing <materials> tag for " + componentID;
        }
        else {
            var textureBlock = component.children[textureIndex];
            texture = componentTextureParser.call(this, textureBlock, componentID);
            if (!(texture instanceof ComponentTexture)) {
                return texture;
            }
        }

        // Animation
        var animation;
        if (animationIndex == -1) {
            animation = new NoAnimation();
        } else {
            var animationBlock = component.children[animationIndex];
            animation = componentAnimationParser.call(this, animationBlock, componentID);
            if (!(animation instanceof MyAnimation)) {
                return animation;
            }
        }

        // Highlighted
        var highlighted;
        if (highlightedIndex == -1) {
            highlighted = new NoHighlight();
        } else {
            var highlightedBlock = component.children[highlightedIndex];
            highlighted = componentHighlightedParser.call(this, highlightedBlock, componentID);
            if (!(highlighted instanceof Highlight)) {
                return highlighted;
            }
            this.highlights[componentID] = false;
        }

        // Create and add component to data structure
        componentIDs.push(componentID);
        this.components[componentID] = new Component(componentID, this, transformation, materials, texture, animation, highlighted);

    }

    // Another traversal. Component references might use only later defined names
    for (var i = 0; i < children.length; i++) {
        var component = children[i];
        if (children[i].nodeName != "component") {
            this.onXMLMinorError("unknown tag <" + component.nodeName + ">");
            continue;
        }

        // Get id of the current component.
        var componentID = this.reader.getString(component, 'id');
        if (componentID == null) {
            return "no ID defined for component";
        }
        grandChildren = component.children;
        nodeNames = [];
        for (var j = 0; j < grandChildren.length; j++) {
            nodeNames.push(grandChildren[j].nodeName);
        }
        var childrenIndex = nodeNames.indexOf("children");


        // Children
        var componentDescendence = [];
        if (childrenIndex == -1) {
            return "Children block is mandatory. Missing <children> tag";
        }
        else {
            var childrenBlock = component.children[childrenIndex];
            componentDescendence = componentChildrenParser.call(this, childrenBlock, componentID);
            if (!Array.isArray(componentDescendence)) {
                return componentDescendence;
            }
        }
        let [componentChildren, primitiveChildren] = componentDescendence;
        this.components[componentID].addChildren(componentChildren, primitiveChildren);
    }
}

function componentTransformationParser(transformationBlock, componentID) {
    var transformations = transformationBlock.children;
    // Iterate the transformations from right to left, to ensure multiplication order
    var componentTransformation = Array.from(transformations).reduceRight(
        (totalTransformation, transformation) => {
            var transformationMatrix = transformationParser.call(this, transformation, componentID); // get transformation matrix
            return totalTransformation = mat4.mul(totalTransformation, transformationMatrix, totalTransformation); // multiply transformation matrix by the cumulative transformation
        }, mat4.create()
    );

    return componentTransformation;
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
        case 'transformationref':
            let transfId = this.reader.getString(node, "id");
            if (transfId == null) {
                return "no ID defined for transformation";
            }
            if (!(transfId in this.transformations)) {
                this.onXMLMinorError("Transformation " + transfId + " does not exist");
            } else {
                transfMatrix = this.transformations[transfId];
            }
            break;
        default:
            this.onXMLError("unknown tag <" + node.nodeName + ">");
    }
    return transfMatrix;
}

function componentMaterialParser(materialsBlock, componentId) {
    var materials = [];
    for (var i = 0; i < materialsBlock.children.length; i++) {
        let child = materialsBlock.children[i];
        if (child.nodeName != "material") {
            this.onXMLMinorError("Not a valid tag for a materials block in " + componentId);
        }

        var materialId = this.reader.getString(child, "id");
        if (materialId == null) {
            return "no ID defined for material";
        }
        if (materialId == "inherit") {
            materials.push(new InheritedMaterial());
        }
        else if (!(materialId in this.materials)) {
            this.onXMLMinorError("Not a valid material id for " + componentId);
        }
        else {
            materials.push(this.materials[materialId]);
        }

        if (materials.length == 0) {
            return "No valid materials for " + componentId;
        }
    }
    return materials;
}

function componentTextureParser(textureBlock, componentId) {
    var textureId, length_s, length_t;
    textureId = this.reader.getString(textureBlock, "id");
    if (textureId == null) {
        return "no ID defined for texture";
    }
    if (textureId == "inherit") {
        return new InheritedTexture();
    }
    else if (textureId == "none") {
        return new NoTexture();
    }
    else if (!(textureId in this.textures)) {
        return "Not a valid texture id for " + componentId + " in texture " + textureId;
    }
    length_s = this.reader.getFloat(textureBlock, "length_s");
    if (!(length_s != null && !isNaN(length_s))) {
        return "unable to parse length_s attribute for " + componentId + " in texture " + textureId;
    }
    length_t = this.reader.getFloat(textureBlock, "length_t");
    if (!(length_t != null && !isNaN(length_t))) {
        return "unable to parse length_t attribute for " + componentId + " in texture " + textureId;
    }

    return new Texture(textureId, this.textures[textureId], length_s, length_t);
}
function componentAnimationParser(animationBlock, componentId) {
    var animationId;
    animationId = this.reader.getString(animationBlock, "id");
    if (animationId == null) {
        return "no ID defined for animation";
    }
    if (!(animationId in this.animations)) {
        return "Not a valid animation id for " + componentId + " in animation " + animationId;
    }
    return this.animations[animationId];
}

function componentHighlightedParser(highlightedBlock, componentId) {
    var color = this.parseColor(highlightedBlock, "component " + componentId, false);
    if (!Array.isArray(color)) {
        return color;
    }

    var scale_h = this.reader.getFloat(highlightedBlock, "scale_h");
    if (!(scale_h != null && !isNaN(scale_h))) {
        return "unable to parse scale_h attribute for highlight in " + componentId;
    }
    var highlight = new Highlight(color, scale_h);
    return highlight;
}


function componentChildrenParser(childrenBlock, componentID) {
    var children = childrenBlock.children;
    var componentObjs = [];
    var primitiveObjs = [];
    if (children.length == 0) {
        this.onXMLError("Children block of " + componentID + " must have at least one child");
        return;
    }
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (child.nodeName == "primitiveref") {
            var primitiveName = this.reader.getString(child, "id");
            if (primitiveName == null) {
                return "no ID defined for primitive";
            }
            if (!(primitiveName in this.primitives)) {
                this.onXMLMinorError("Unknown primitive for component " + componentID);
                continue;
            }
            // Create a new primitive object to be added to the component's children
            // let primitiveObj = this.primitives[primitiveName]();
            primitiveObjs.push(primitiveName);
        }
        else if (child.nodeName == "componentref") {
            var componentName = this.reader.getString(child, "id");
            if (componentName == null) {
                return "no ID defined for component";
            }
            if (!(componentName in this.components)) {
                this.onXMLMinorError("Unknown primitive for component " + componentID);
                continue;
            }
            if (componentName == componentID) {
                this.onXMLMinorError("Recursion component invocation of " + componentID);
                continue;
            }
            // Add component to the component's children
            componentObjs.push(componentName);
        }
        else {
            this.onXMLMinorError("unknown tag <" + child.nodeName + ">");
        }
    }

    if (primitiveObjs.length + componentObjs.length == 0) {
        return "Children block of " + componentID + " must have at least one valid child";
    }
    return [componentObjs, primitiveObjs];
}