import { CGFlight } from "../../lib/CGF.js";

export class Spotlight {
    GAME_SPOTLIGHT = 'boardSpotlight';
    constructor(sceneGraph, game) {
        this.sceneGraph = sceneGraph;
        this.game = game;
        this.createLight();
        this.counter = 0;
    }

    createLight() {
        let lightsLen = Object.keys(this.sceneGraph.lights).length;
        if (lightsLen == 8) {
            // Can only have 8 lights
            let light = Object.keys(this.sceneGraph.lights)[lightsLen - 1];
            delete this.sceneGraph.lightsDict[light];
        }
        this.light = new CGFlight(this.sceneGraph.scene, lightsLen);
        this.light.setQuadraticAttenuation(5);
    }

    toggleVisibility() {
        this.light.visible = !this.light.visible;
    }

    turnOn() {
        this.light.enable();
        // this.light.setVisible(true);
    }

    turnOff() {
        this.light.disable();
        // this.light.setVisible(false);
        this.light.update();
    }

    moveSpotlight(pos, target) {
        this.light.setPosition(...pos);
        this.light.setSpotDirection(...target);
        this.light.update();
    }
}