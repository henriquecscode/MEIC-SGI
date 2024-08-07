import { InheritedTexture } from "../textures/InheritedTexture.js";
import { Texture } from "../textures/Texture.js";
import { CGFscene } from '../../lib/CGF.js';
import { CGFaxis, CGFcamera, CGFshader } from '../../lib/CGF.js';
import { AbstractComponent } from "./AbstractComponent.js";

export class Component extends AbstractComponent {
    constructor(id, sceneGraph, transformation, materials, texture, animation, highlight, doPick = false) {
        super(id, sceneGraph);
        this.transformation = transformation;
        this.materials = materials;
        this.texture = texture;
        this.animation = animation;
        this.highlight = highlight;
        this.materialIndex = 0;
        this.numberMaterials = materials.length;
        this.material = materials[0];
        this.doPick = doPick;
        this.initializeChildren();
    }
    initializeChildren() {
        //Just if it is empty (debug)
        this.components = [];
        this.primitivesNames = [];
        this.primitives = {};
    }

    addChildren(components, primitives) {
        this.components = components;
        this.primitivesNames = primitives;
        this.primitives = {};
    }

    nextMaterial() {
        this.materialIndex = (this.materialIndex + 1) % this.numberMaterials;
        this.material = this.materials[this.materialIndex];
    }

    prevMaterial() {
        this.materialIndex = (this.materialIndex - 1) % this.numberMaterials;
        this.material = this.materials[this.materialIndex];
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

        this.primitives[path] = [];
        for (let primitiveName of this.primitivesNames) {
            let primitiveObj = this.sceneGraph.primitives[primitiveName]();
            if (appliedTexture != null) {
                primitiveObj.updateTexCoords(appliedTexture.length_s, appliedTexture.length_t);
            }
            this.primitives[path].push(primitiveObj);
        }


        for (let component of this.components) {
            this.sceneGraph.components[component].setTextureCoordinates(path + ' ' + this.id, appliedTexture);
        }
    }

    registerPick(component) {
        if (this.doPick) {
            this.sceneGraph.scene.registerForPick(this.sceneGraph.getPickingId(), component)
        }
    }

    pick() {

    }

    display(path, prevMaterial, prevTexture) {
        this.registerPick(this);
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
        for (let primitiveObj of this.primitives[path]) {
            primitiveObj.display();
        }

        for (let component of this.components) {
            this.sceneGraph.components[component].display(path + ' ' + this.id, thisMaterial, thisTexture);
        }

    }

    unsetDisplay() {
        this.sceneGraph.scene.popMatrix();
        if (this.sceneGraph.highlights[this.id]) {
            this.highlight.setDisplay(this.sceneGraph.scene, this.sceneGraph.scene.defaultShader)
        }
    }


}