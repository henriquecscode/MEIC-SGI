import { ComponentTexture } from "./ComponentTexture.js";

export class NoTexture extends ComponentTexture{
    constructor(){
        super(null);
    }

    setOnMaterial(prevTexture, prevMaterial){
        prevMaterial.setTexture(null);
        return null;
    }
}