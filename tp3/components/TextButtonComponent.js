import { Sprite } from "../sprites/Sprite.js";
import { NoTexture } from "../textures/NoTexture.js";
import { CubeComponent } from "./CubeComponent.js";

export class TextButtonComponent extends CubeComponent {

    static getSprite(scene, text, scalex, scaley, material, strategies = []) {
        let sprite = new Sprite(scene, text, scalex, scaley, material);
        sprite.setStrategy(strategies);
        sprite.setMaterial(material);
        return sprite;
    }

    constructor(id, sceneGraph, transformation, materials = undefined, textures = undefined, animation = undefined, highlight = undefined, onClick = undefined, sprite = undefined) {
        if (!textures) textures = [new NoTexture(), new NoTexture()];
        if (textures.length == 1) {
            textures.push(textures[0]);
        }
        super(id, sceneGraph, transformation, materials, textures[0], animation, highlight, true);
        if (sprite) {
            this.sprite = sprite;
            this.surface.addComponents([sprite]);
        }
        this.onClick = onClick;
        this.textures = textures;
        this.deselect()

    }

    select() {
        this.isActive = true;
        this.texture = this.textures[1];
        this.material = this.materials[1];
    }

    deselect() {
        this.isActive = false;
        this.texture = this.textures[0];
        this.material = this.materials[0];
    }

    toggleSelect() {
        if (this.isActive) {
            this.deselect();
        }
        else {
            this.select();
        }
    }

    setSprite(sprite) {
        let components = this.surface.components;
        let index = components.indexOf(this.sprite);
        components = components.splice(index, 1);
        components.push(sprite)
        this.surface.components = components;
        this.sprite = sprite;
    }

    getSprite() {
        return this.sprite;
    }

    setText(text) {
        this.sprite.setText(text);
    }

    setOnClick(onClick) {
        this.onClick = onClick;
    }

    pick() {
        if (this.onClick) { this.onClick(); }
    }

}