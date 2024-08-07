import { toRads } from "../utils/utilities.js";

export class Rotation {
    constructor(axis, angle) {
        this.axis = this.getAxis(axis);
        this.angle = toRads(angle);
        this.exactTransformation = this.getExactTransformation();
    }

    getAxis(axis) {
        switch (axis) {
            case "x":
                return vec3.fromValues(1, 0, 0);
            case "y":
                return vec3.fromValues(0, 1, 0);
            case "z":
                return vec3.fromValues(0, 0, 1);
        }
    }
    getExactTransformation() {
        let destinationMatrix = mat4.create();
        return mat4.rotate(destinationMatrix, destinationMatrix, this.angle, this.axis);
    }

    interpolate(ratio, nextRotation) {
        let newAngle = this.angle + ratio * (nextRotation.angle - this.angle);
        let destinationMatrix = mat4.create();
        return mat4.rotate(destinationMatrix, destinationMatrix, newAngle, this.axis);
    }
}