import { CGFtexture, CGFXMLreader } from '../lib/CGF.js';
import { colorParser } from './parser/ColorParser.js';
import { animationsParser } from './parser/AnimationsParser.js';
import { componentsParser } from './parser/ComponentsParser.js';
import { coordinates3DParser } from './parser/Coordinates3DParser.js';
import { coordinates4DParser } from './parser/Coordinates4DParser.js';
import { lightsParser } from './parser/LightsParser.js';
import { materialsParser } from './parser/MaterialsParser.js';
import { primitiveParser } from './parser/PrimitiveParser.js';
import { sceneParser } from './parser/SceneParser.js';
import { texturesParser } from './parser/TexturesParser.js';
import { transformationsParser } from './parser/TransformationsParser.js';
import { viewsParser } from './parser/ViewsParser.js';
import { ambientParser } from './parser/AmbientParser.js';
import { XMLFileParser } from './parser/XMLFileParser.js';
import { rotationParser } from './parser/RotationParser.js';
import componentTransformationParser from './parser/ComponentsParser.js';
import { PerspectiveView } from './views/PerspectiveView.js';
import { MenuComponent } from './menu/MenuComponent.js';
import { Material } from './materials/Material.js';
import { Texture } from './textures/Texture.js';
import { Sprite } from './sprites/Sprite.js';


var SCENES_INDEX = 0;
var MATERIALS_INDEX = 1;
var TEXTURES_INDEX = 2;

export class BoardFileGraph {
    constructor(filename, scene, gui, callback) {
        this.loadedOk = null;

        this.scene = scene;
        scene.graph = this;

        this.gui = gui;
        this.callback = callback
        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.startDefaults();
        this.reader.open('scenes/' + filename, this);


    }

    startDefaults() {
        this.lights = [];
        this.highlights = {}
        this.referenceLength = 1;
        this.startColors();
        this.startViews();

    }

    startComponents() {
        this.components = {};
        this.idRoot = 'menu';
        this.menu = new MenuComponent(this.idRoot, this);
        this.components[this.idRoot] = this.menu;
    }

    startColors() {
        this.background = [0.1, 0.1, 0.1, 1]
        this.ambient = [0.6, 0.6, 0.6, 1];
    }

    startViews() {
        this.views = {};
        this.views['default'] = new PerspectiveView(0.4, 500, 45, vec3.fromValues(10, 5, 0), vec3.fromValues(5, 0, 0));
        this.defaultView = 'default';
    }

    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }
        this.loadedOk = true;

        Sprite.loadSprites(this.scene);
        this.startComponents();
        this.setTextureCoordinates();

        // INITS THE SCENE
        this.scene.onGraphLoaded();

        // Make interface
        this.gui.assembleInterface(this);
    }

    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "sxs") {
            return "root tag <sxs> missing";
        }

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        var index;
        if ((index = nodeNames.indexOf("scenes")) == -1)
            return "tag <scenes> missing";
        else {
            if (index != SCENES_INDEX)
                this.onXMLMinorError("tag <scenes> out of order " + index);

            //Parse scenes block
            if ((error = this.parseScenes(nodes[index])) != null)
                return error;
        }

        var index;
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order " + index);

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        var index;
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order " + index);

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }
    }

    parseScenes(scenesNode) {
        var children = scenesNode.children;
        this.scenes = {}

        for (var i = 0; i < children.length; i++) {
            var board = {}
            var child = children[i];
            if (child.nodeName != "scene") {
                return "unkonwn tag <" + child.nodeName + ">";
            }

            var name = this.reader.getString(child, 'name');
            var file = this.reader.getString(child, 'path');

            var grandChildren = child.children;
            if (grandChildren.length != 1) {
                return "scene must have exactly one board";
            }
            var boardNode = grandChildren[0];
            if (boardNode.nodeName != "board") {
                return "scene must have exactly one node named board";
            }
            var board = this.parseBoard(boardNode);
            if (board.constructor == String) {
                return board;
            }
            const scene = {
                ...board,
                file: file,
            }
            this.scenes[name] = scene;
        }
    }

    parseBoard(boardNode) {
        var children = boardNode.children;

        if (children.length != 3) {
            return "board must have exactly 3 children";
        }
        var boardTransformationBlock = children[0];
        if (boardTransformationBlock.nodeName != "transformation") {
            return "board must have a transformation child";
        }

        let boardTransformation = componentTransformationParser.call(this, boardTransformationBlock, "board");

        var p1BoardNode = children[1];
        if (p1BoardNode.nodeName != "p1board") {
            return "board must have a p1Board child";
        }
        var p1BoardChildren = p1BoardNode.children;
        if (p1BoardChildren.length != 1) {
            return "p1Board must have a transformation child";
        }
        var p1BoardTransformationBlock = p1BoardChildren[0];
        if (p1BoardTransformationBlock.nodeName != "transformation") {
            return "p1Board child must be a transformation";
        }
        let p1BoardTransformation = componentTransformationParser.call(this, p1BoardTransformationBlock, "p1Board");

        var p2BoardNode = children[2];
        if (p2BoardNode.nodeName != "p2board") {
            return "board must have a p2Board child";
        }
        var p2BoardChildren = p2BoardNode.children;
        if (p2BoardChildren.length != 1) {
            return "p2Board must have a transformation child";
        }
        var p2BoardTransformationBlock = p2BoardChildren[0];
        if (p2BoardTransformationBlock.nodeName != "transformation") {
            return "p2Board child must be a transformation";
        }
        let p2BoardTransformation = componentTransformationParser.call(this, p2BoardTransformationBlock, "p2Board");

        return {
            "boardTransformation": boardTransformation,
            "p1BoardTransformation": p1BoardTransformation,
            "p2BoardTransformation": p2BoardTransformation
        }
    }


    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];
        this.materialsOptions = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + child.nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(child, 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            var shininess = this.reader.getFloat(child, "shininess")
            if (!(shininess != null && !isNaN(shininess))) {
                return "unable to parse shininess attribute for material" + materialID;
            }

            var lightComponentsElements = child.children;
            nodeNames = [];
            for (var j = 0; j < lightComponentsElements.length; j++) {
                nodeNames.push(lightComponentsElements[j].nodeName);
            }

            var emissionIndex = nodeNames.indexOf("emission");

            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");
            if (emissionIndex == -1) {
                return "No emission component for " + materialID;
            }
            if (ambientIndex == -1) {
                return "No ambient component for " + materialID;
            }
            if (diffuseIndex == -1) {
                return "No diffuse component for " + materialID;
            }
            if (specularIndex == -1) {
                return "No specular component for " + materialID;
            }
            var indices = [emissionIndex, ambientIndex, diffuseIndex, specularIndex]

            var lightComponents = [];
            for (let indice of indices) {
                let lightComponent = this.parseColor(lightComponentsElements[indice], "material " + materialID, true);
                lightComponents.push(lightComponent);
            }
            let material = new Material(this.scene, shininess, lightComponents);
            let materialOptions = {
                "shininess": shininess,
                lightComponents
            }
            this.materials[materialID] = material;
            this.materialsOptions[materialID] = materialOptions;
        }
    }

    parseTextures(texturesNode) {
        //For each texture in textures block, check ID and file URL

        this.textures = [];
        this.texturesOptions = [];
        if (texturesNode.children.length == 0) {
            return "No texture in <textures> block";
        }
        var children = texturesNode.children;

        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + child.nodeName + ">");
                continue;
            }
            var id, fileName;
            id = this.reader.getString(child, "id");
            if (id == null) {
                return "no ID defined for texture";
            }

            // Checks for repeated IDs.
            if (this.textures[id] != null) {
                return "ID must be unique for each texture (conflict: ID = " + id + ")";
            }

            fileName = this.reader.getString(child, "file");
            if (fileName == null) {
                return "no file defined for texture";
            }
            if (!(fileName.endsWith(".jpg") || fileName.endsWith(".png"))) {
                return "specified texture file must be a jpg or a png";
            }
            var CFGtexture = new CGFtexture(this.scene, fileName);
            var texture = new Texture(id, CFGtexture);

            this.textures[id] = texture;
            this.texturesOptions[id] = fileName

        }

        if (Object.keys(this.textures).length == 0) {
            return "No existent valid texture in <textures> block";
        }
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        return coordinates3DParser.call(this, node, messageError);
    }

    parseRotation(node, messageError) {
        return rotationParser.call(this, node, messageError);
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        return coordinates4DParser.call(this, node, messageError);
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     * @param {boolean that informs if the color has alpha} alpha
     */
    parseColor(node, messageError, alpha) {
        return colorParser.call(this, node, messageError, alpha);
    }
    /*
 * Callback to be executed on any read error, showing an error on the console.
 * @param {string} message
 */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    init() {

    }

    resetPickingId() {
        this.pickingId = 1;
    }
    getPickingId() {
        return this.pickingId++;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.resetPickingId();
        this.components[this.idRoot].display('', null, null);
    }

    setTextureCoordinates() {
        this.components[this.idRoot].setTextureCoordinates('', null);
    }
}
