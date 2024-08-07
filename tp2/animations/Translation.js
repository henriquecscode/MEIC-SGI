import '../../lib/CGF.js'

export class Translation {
    constructor(positions) {
        this.positions = positions;
        this.exactTransformation = this.getExactTransformation();
    }

    getExactTransformation() {
        let destinationMatrix = mat4.create();
        return mat4.translate(destinationMatrix, destinationMatrix, this.positions);
    }

    interpolate(ratio, nextTranslation) {
        let newPositions = [];
        for (let i = 0; i < 3; i++) {
            newPositions.push(this.positions[i] + ratio * (nextTranslation.positions[i] - this.positions[i]));
        }
        let destinationMatrix = mat4.create();
        return mat4.translate(destinationMatrix, destinationMatrix, newPositions);
    }
}