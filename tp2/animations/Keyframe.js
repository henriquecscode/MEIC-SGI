export class Keyframe {
    constructor(instant, translation, rotX, rotY, rotZ, scale) {
        this.instant = instant;
        this.transformations = [translation, rotX, rotY, rotZ, scale];
    }

    getExactTransformation() {
        let totalTransformation = Array.from(this.transformations).reduceRight(
            (totalTransformation, keyFrameTransformation) => {
                let currTransformation = keyFrameTransformation.getExactTransformation();
                return mat4.multiply(totalTransformation, currTransformation, totalTransformation)
            }, mat4.create());
        return totalTransformation;
    }

    getTransformations() {
        return this.transformations;
    }

    interpolate(now, nextKeyframe) {
        let transformations = this.getTransformations();
        let nextTransformations = nextKeyframe.getTransformations();
        let interpolatedTransformations = [];
        let ratio = (now - this.instant) / (nextKeyframe.instant - this.instant);
        for (let i = 0; i < transformations.length; i++) {
            interpolatedTransformations.push(transformations[i].interpolate(ratio, nextTransformations[i]));
        }
        let totalTransformation = Array.from(interpolatedTransformations).reduceRight(
            (totalTransformation, currTransformation) => {
                return mat4.multiply(totalTransformation, currTransformation, totalTransformation)
            }, mat4.create());
        return totalTransformation;
    }
}