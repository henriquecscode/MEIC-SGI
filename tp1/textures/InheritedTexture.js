import { ComponentTexture } from "./ComponentTexture.js";

export class InheritedTexture extends ComponentTexture{
    constructor(){
        super(null);
    }

    setOnMaterial(prevTexture, prevMaterial){
        prevMaterial.setTexture(prevTexture.texture);
        return prevTexture;
    }

}