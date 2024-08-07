import { ComponentTexture } from "./ComponentTexture.js";

export class Texture extends ComponentTexture {
    constructor(id, texture, length_s = 1, length_t = 1) {
        super(texture);
        this.id = id;
        this.length_s = length_s;
        this.length_t = length_t;
    }

    setOnMaterial(prevTexture, prevMaterial) {
        prevMaterial.setTexture(this.texture);
        return this;
    }

}