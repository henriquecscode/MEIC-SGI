import { InheritedTexture } from "../textures/InheritedTexture.js";
import { Texture } from "../textures/Texture.js";


export class Component {
    constructor(id, sceneGraph, transformation, materials, texture) {
        this.id = id
        this.sceneGraph = sceneGraph;
        this.transformation = transformation;
        this.materials = materials;
        this.texture = texture;
        this.materialIndex = 0;
        this.numberMaterials = materials.length;
        this.material = materials[0];
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

    display(path, prevMaterial, prevTexture) {

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
    }


}