import { CGFappearance } from "../../lib/CGF.js";

export class Material {

    constructor(scene, shininess = 10, lightComponents = [[0, 0, 0, 1], [0.2, 0.2, 0.2, 1.0], [0.5, 0.5, 0.5, 1.0], [0.5, 0.5, 0.5, 1.0] ]) {
        this.material = this.createMaterial(scene, shininess, lightComponents);
    }

    createMaterial(scene, shininess, lightComponents) {
        var material = new CGFappearance(scene);
        material.setShininess(shininess);
        material.setEmission(...lightComponents[0]);
        material.setAmbient(...lightComponents[1]);
        material.setDiffuse(...lightComponents[2]);
        material.setSpecular(...lightComponents[3]);
        material.setTextureWrap('REPEAT', 'REPEAT');

        return material;
    }

    apply(previousMaterial) {
        this.material.apply();
        return this.material;
    }
}