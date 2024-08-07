import '../../lib/CGF.js'
import { ObjectHighlight } from "./ObjectHighlight.js";
import { CGFscene } from '../../lib/CGF.js';
import { CGFaxis, CGFcamera, CGFshader } from '../../lib/CGF.js';

export class NoHighlight extends ObjectHighlight{
    constructor(){
        
        super();
        this.name = "no"
    }

    setDisplay(scene, shader){
        
    }

    updateNow(timeFactor, shader){
        
    }
}