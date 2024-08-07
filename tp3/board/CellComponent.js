import { InheritedTexture } from "../textures/InheritedTexture.js";
import { Texture } from "../textures/Texture.js";
import { CGFscene } from '../../lib/CGF.js';
import { CGFaxis, CGFcamera, CGFshader } from '../../lib/CGF.js';
import { MyRectangle } from "../primitives/MyRectangle.js";
import { NoAnimation } from "../animations/NoAnimation.js";
import { NoHighlight } from "../highlighted/NoHighlight.js";

export class CellComponent {
    constructor(id, sceneGraph, game, board, position, size, transformation, materials, textures) {
        this.id = id
        this.positionParams;
        this.sceneGraph = sceneGraph;
        this.game = game;
        this.board = board;
        this.transformation = transformation;
        this.materials = materials;
        this.textures = textures;
        this.animation = new NoAnimation();
        this.highlight = new NoHighlight();
        this.components = [];
        this.createCell(position, size);
        this.deselect();

    }

    createCell(position, size) {
        this.i = position.i;
        this.j = position.j;
        this.x = position.x;
        this.y = position.y;
        this.width = size.x;
        this.length = size.y;
        this.primitives = [
            new MyRectangle(this.sceneGraph.scene, this.id, position.x, position.x + size.x, position.y, position.y + size.y, 1)
        ]
    }

    select(){
        this.isActive = true;
        this.texture = this.textures[1];
        this.material = this.materials[1];
    }

    deselect(){
        this.isActive = false;
        this.texture = this.textures[0];
        this.material = this.materials[0];
    }

    setTextureCoordinates(path, prevTexture) {
        let appliedTexture;
        if (this.texture instanceof Texture) {
            appliedTexture = this.texture;
        }
        else if (this.texture instanceof InheritedTexture) {
            appliedTexture = prevTexture
        }
        else { //NoTexture
            appliedTexture = null;
        }

        let primitiveObj = this.primitives
        if (appliedTexture != null) {
            primitiveObj.updateTexCoords(appliedTexture.length_s, appliedTexture.length_t);
        }


        for (let component of this.components) {
            this.sceneGraph.components[component].setTextureCoordinates(path + ' ' + this.id, appliedTexture);
        }
    }

    display(path, prevMaterial, prevTexture) {
        if (!this.animation.isVisible(this.sceneGraph.now)) {
            return;
        }
        if (prevMaterial == null) {
            prevMaterial = this.material.material;
        }
        if (prevTexture == null) {
            prevTexture = this.texture;
        }

        let [thisMaterial, thisTexture] = this.setDisplay(prevMaterial, prevTexture);
        this.draw(path, thisMaterial, thisTexture);
        this.unsetDisplay();
    }

    setDisplay(prevMaterial, prevTexture) {
        let appliedMaterial = this.material.apply(prevMaterial);
        let appliedTexture = this.texture.setOnMaterial(prevTexture, appliedMaterial);

        this.sceneGraph.scene.pushMatrix();
        this.sceneGraph.scene.multMatrix(this.transformation);

        this.animation.update(this.sceneGraph.now);
        this.animation.apply();

        if (this.sceneGraph.highlights[this.id]) {
            this.highlight.setDisplay(this.sceneGraph.scene, this.sceneGraph.scene.shaders)
            this.highlight.updateNow(this.sceneGraph.now, this.sceneGraph.scene.shaders, this.texture)
        }

        return [appliedMaterial, appliedTexture];
    }

    draw(path, thisMaterial, thisTexture) {
        thisMaterial.apply()
        for (let primitiveObj of this.primitives) {
            primitiveObj.display();
        }

        for (let component of this.components) {
            this.sceneGraph.components[component].display(path + ' ' + this.id, thisMaterial, thisTexture);
        }

    }

    unsetDisplay() {
        this.sceneGraph.scene.popMatrix();
        this.highlight.setDisplay(this.sceneGraph.scene, this.sceneGraph.scene.defaultShader)
    }

    pick(){
        this.game.pickCell(this.board, this.i, this.j);
    }

    toggleSelect(){
        if (this.isActive){
            this.deselect();
        }
        else{
            this.select();
        }
    }
}