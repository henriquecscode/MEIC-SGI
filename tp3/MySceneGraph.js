import { CGFappearance, CGFXMLreader } from '../lib/CGF.js';
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
import { GameComponent } from './board/GameComponent.js';
import { Sprite } from './sprites/Sprite.js';


/**
 * MySceneGraph class, representing the scene graph.
 */
export class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene, gui, boardData = undefined) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        this.gui = gui;
        scene.graph = this;
        this.boardData = boardData;

        this.nodes = [];
        this.components = [];
        this.views = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.components['board'] = null;

        // File reading 
        this.reader = new CGFXMLreader();


        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        Sprite.loadSprites(this.scene);
        if (this.boardData) {
            this.board = new GameComponent("board", this, this.boardData);
            this.components['board'] = this.board;
            this.board.leaderboard.reset();
        }
        
        // Change primitives to have texture coordinate based on length_s and length_t
        this.setTextureCoordinates();
        
        // Add next material even listener
        addEventListener('keyup', (e) => {
            if (e.key == "m" || e.key == "M") {
                this.nextMaterial();
            }
        });
        
        this.loadedOk = true;
        // INITS THE SCENE
        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.board.boards[this.board.MAIN].camera.setCamera();
        this.board.leaderboard.reset();
        this.scene.onGraphLoaded();
        // Make interface
        this.gui.assembleInterface(this);


    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        return XMLFileParser.call(this, rootElement);
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {
        return sceneParser.call(this, sceneNode)
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        return viewsParser.call(this, viewsNode)
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {
        return ambientParser.call(this, ambientsNode);
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        return lightsParser.call(this, lightsNode);
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        return texturesParser.call(this, texturesNode);
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        return materialsParser.call(this, materialsNode);
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        return transformationsParser.call(this, transformationsNode);
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        return primitiveParser.call(this, primitivesNode);
    }

    /**
    * Parses the <components> block.
    * @param {components block element} componentsNode
    */
    parseComponents(componentsNode) {
        return componentsParser.call(this, componentsNode);
    }

    /**
* Parses the <animations> block.
* @param {animations block element} animationsNode
*/
    parseAnimations(animationsNode) {
        return animationsParser.call(this, animationsNode);
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
        this.start = new Date().getTime();
        this.now = this.getNow();
    }

    getNow() {
        return (new Date().getTime() - this.start) / 1000;
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
        this.now = this.getNow();
        this.resetPickingId();
        this.components[this.idRoot].display('', null, null);
        this.components['board'].display('', null, null);
    }

    nextMaterial() {
        for (let component in this.components) {
            this.components[component].nextMaterial();
        }
    }

    setTextureCoordinates() {
        this.components[this.idRoot].setTextureCoordinates('', null);
        this.components['board'].setTextureCoordinates('', null);
    }
}