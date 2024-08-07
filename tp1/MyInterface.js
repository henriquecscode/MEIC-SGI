import { CGFinterface, CGFapplication, dat } from '../lib/CGF.js';

/**
* MyInterface class, creating a GUI interface.
*/

export class MyInterface extends CGFinterface {
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

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }
    assembleInterface(sceneGraph) {
        // Checkboxes for lights
        for (let light of Object.keys(sceneGraph.lights)) {
            this.gui.add(sceneGraph.lights[light], '0')
                .name('Toggle ' + light)
                // .onChange(() => this.scene.updateLight(light));
        }

        // View selector
        this.gui.add(sceneGraph, 'defaultView', sceneGraph.defaultViewSelector).name('Selected Camera')
        .onChange(this.scene.initCameras.bind(this.scene));

    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}