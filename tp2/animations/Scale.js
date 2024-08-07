export class Scale {
    constructor(scales) {
        this.scales = scales;
        this.exactTranformation = this.getExactTransformation();
    }

    getExactTransformation() {
        let destinationMatrix = mat4.create();
        destinationMatrix = mat4.scale(destinationMatrix, destinationMatrix, vec3.fromValues(...this.scales));
        return destinationMatrix;
    }

    interpolate(ratio, nextScale) {
        let newScales = [];
        for (let i = 0; i < 3; i++) {
            newScales.push(this.scales[i] + ratio * (nextScale.scales[i] - this.scales[i]));
        }
        let destinationMatrix = mat4.create();
        destinationMatrix = mat4.scale(destinationMatrix, destinationMatrix, vec3.fromValues(...newScales));
        return destinationMatrix;
    }
}