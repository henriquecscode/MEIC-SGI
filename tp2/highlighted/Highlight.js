import '../../lib/CGF.js'
import { ObjectHighlight } from "./ObjectHighlight.js";
// import { CGFaxis, CGFcamera, CGFshader } from '../../lib/CGF.js';

export class Highlight extends ObjectHighlight{
    constructor(color, scale_h){
        super();
        this.name = "yes"
        this.color = color
        this.scale_h = scale_h
    }

    setDisplay(scene, shader){
        scene.setActiveShader(shader) 
    }

    updateNow(timeFactor, shader, texture){
        var offset_factor = (Math.sin(timeFactor) + 1.0)*0.5
        shader.setUniformsValues({ scale: this.scale_h, 
            colorx: this.color[0], colory: this.color[1], colorz: this.color[2], offset_factor: offset_factor});
    }
}