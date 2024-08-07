import { CGFinterface, CGFapplication, dat } from '../lib/CGF.js';
/**
* MenuInterface class, creating a GUI interface.
*/

export class MenuInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();
    }
    assembleInterface(graph) {
        let callback = graph.callback
        this.gui.add({ click: () => callback(graph, () => this.delete()) }, 'click').name('START GAME');
    }

    delete() {
        this.gui.destroy();
    }

    /**
     * initKeys
     */
    // initKeys() {
    //     this.scene.gui = this;
    //     this.processKeyboard = function () { };
    //     this.activeKeys = {};
    // }

    // processKeyDown(event) {
    //     this.activeKeys[event.code] = true;
    // };

    // processKeyUp(event) {
    //     this.activeKeys[event.code] = false;
    // };

    // isKeyPressed(keyCode) {
    //     return this.activeKeys[keyCode] || false;
    // }
}