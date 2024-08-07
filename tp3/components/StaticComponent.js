import '../../lib/CGF.js';
import { NoAnimation } from '../animations/NoAnimation.js';
import { Material } from '../materials/Material.js';
import { NoTexture } from '../textures/NoTexture.js';
import { Texture } from '../textures/Texture.js';
import { InheritedTexture } from '../textures/InheritedTexture.js';
import { Component } from './Component.js';

function getMaterials(materials, scene) {
    if (materials.length != 0) {
        return materials;
    }

    materials = [
        new Material(scene)
    ]
    return materials;
}

//A class that allows a primitive to behave as a component, so that more components can be added more easily
export class StaticComponent extends Component {
    constructor(id, sceneGraph, transformation = mat4.create(), materials = [], texture = new NoTexture(), animation = new NoAnimation(), highlight = new NoAnimation(), doPick = false) {
        materials = getMaterials(materials, sceneGraph.scene);
        super(id, sceneGraph, transformation, materials, texture, animation, highlight, doPick);

    }


    //Override
    initializeChildren() {
        this.components = [];
        this.primitives = [];
    }

    addComponents(components) {
        this.components = this.components.concat(components);
    }

    addPrimitives(primitives) {
        this.primitives = this.primitives.concat(primitives);
    }

    //Override
    addChildren(components, primitives) {
        this.addComponents(components);
        this.addPrimitives(primitives);
    }
    //Override
    setTextureCoordinates(path, prevTexture = null) {
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

        for (let primitiveObj of this.primitives) {
            if (appliedTexture != null) {
                primitiveObj.updateTexCoords(appliedTexture.length_s, appliedTexture.length_t);
            }
        }

        for (let component of this.components) {
            component.setTextureCoordinates(path + ' ' + this.id, appliedTexture);
        }
    }

    //Override
    draw(path, thisMaterial, thisTexture) {
        thisMaterial.apply()

        for (let primitive of this.primitives) {
            primitive.display();
        }
        for (let component of this.components) {
            component.display(path + ' ' + this.id, thisMaterial, thisTexture);
        }
    }

}