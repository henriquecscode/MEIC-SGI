import { Keyframe } from "../animations/Keyframe.js";
import { Rotation } from "../animations/Rotation.js";
import { Scale } from "../animations/Scale.js";
import { Translation } from "../animations/Translation.js";
import { Animation } from "../animations/Animation.js";

export function animationsParser(animationsNode) {

    var children = animationsNode.children;

    this.animations = {};
    for (var i = 0; i < children.length; i++) {
        var keyframeanim = children[i];

        if (children[i].nodeName != "keyframeanim") {
            return "unknown tag <" + keyframeanim.nodeName + "> in animations block";
        }

        // Get id of the current animation.
        var animationID = this.reader.getString(keyframeanim, 'id');
        if (animationID == null)
            return "no ID defined for animationID";

        // Checks for repeated IDs.
        if (this.animations[animationID] != null)
            return "ID must be unique for each animation (conflict: ID = " + animationID + ")";

        let keyframesBlock = keyframeanim.children;
        let keyframes = [];
        let instants = [];
        for (let j = 0; j < keyframesBlock.length; j++) {
            let keyframe = keyframesBlock[j];
            if (keyframe.nodeName != "keyframe") {
                return "unknown tag <" + keyframe.nodeName + "> in keyanimation " + animationID + " in animations block";
            }
            let messageError = "keyframe number " + j + " for keyanimation " + animationID

            let instant = this.reader.getFloat(keyframe, 'instant');

            if (!(instant != null && !isNaN(instant)))
                return "unable to parse instant for " + messageError;

            if (instants.includes(instant)) {
                return "repeated instant for " + messageError
            } else {
                instants.push(instant);
            }

            //Transformations
            if (keyframe.children.length != 5) {
                return "keyframe of instant " + keyframe + " for keyanimation " + animationID + " does not a correct number of transformations";
            }
            // Translation
            let translation = getTranslation.call(this, keyframe, messageError);
            if (typeof translation == 'string') {
                return translation;
            }


            // Rotation z
            let rotationZ = getRotationZ.call(this, keyframe, messageError);
            if (typeof rotationZ == 'string') {
                return rotationZ;
            }
            // Rotation y
            let rotationY = getRotationY.call(this, keyframe, messageError);
            if (typeof rotationY == 'string') {
                return rotationY;
            }
            // Rotation x
            let rotationX = getRotationX.call(this, keyframe, messageError);
            if (typeof rotationX == 'string') {
                return rotationX;
            }
            // Scale
            let scale = getScale.call(this, keyframe, messageError);
            if (typeof scale == 'string') {
                return scale;
            }

            let keyFrameObj = new Keyframe(instant, translation, rotationX, rotationY, rotationZ, scale);
            keyframes.push(keyFrameObj);
        }
        this.animations[animationID] = new Animation(this, animationID, keyframes);
    }
}

function getTranslation(keyframe, messageError) {
    let translation = keyframe.children[0];
    if (translation.nodeName != "translation") {
        return "tag for transformation in " + keyframe + " for keyanimation " + animationID + " is invalid"
    }

    // x
    var x = this.reader.getFloat(translation, 'x');
    if (!(x != null && !isNaN(x)))
        return "unable to parse x-coordinate of the translation in " + messageError;

    // y
    var y = this.reader.getFloat(translation, 'y');
    if (!(y != null && !isNaN(y)))
        return "unable to parse y-coordinate of the translation in " + messageError;

    // z
    var z = this.reader.getFloat(translation, 'z');
    if (!(z != null && !isNaN(z)))
        return "unable to parse z-coordinate of the translation in " + messageError;

    let positions = [];
    positions.push(...[x, y, z]);

    return new Translation(positions);
}

function getRotationAxis(rotationBlock, axisName, messageError) {
    if (rotationBlock.nodeName != "rotation") {
        return "tag for rotation in " + messageError + " is invalid"
    }


    var axis = this.reader.getString(rotationBlock, 'axis');
    if (axis == null) {
        return "unable to parse axis for" + axisName + " rotation in " + messageError;
    }

    if (axis != axisName) {
        return "axis for x rotation in " + messageError + "must be " + axisName
    }

    // angle
    var angle = this.reader.getFloat(rotationBlock, 'angle');
    if (!(angle != null && !isNaN(angle)))
        return "unable to parse angle for " + axisName + " rotation in " + messageError;

    return angle
}


function getRotationZ(keyframe, messageError) {
    let rotationBlock = keyframe.children[1];
    let rotationAngle = getRotationAxis.call(this, rotationBlock, "z", messageError);
    if (typeof rotationAngle == 'string') {
        return rotationAngle;
    }
    return new Rotation("z", rotationAngle);
}

function getRotationY(keyframe, messageError) {
    let rotationBlock = keyframe.children[2];
    let rotationAngle = getRotationAxis.call(this, rotationBlock, "y", messageError);
    if (typeof rotationAngle == 'string') {
        return rotationAngle;
    }
    return new Rotation("y", rotationAngle);
}

function getRotationX(keyframe, messageError) {
    let rotationBlock = keyframe.children[3];
    let rotationAngle = getRotationAxis.call(this, rotationBlock, "x", messageError);
    if (typeof rotationAngle == 'string') {
        return rotationAngle;
    }
    return new Rotation("x", rotationAngle);
}

function getScale(keyframe, messageError) {
    let scale = keyframe.children[4];
    if (scale.nodeName != "scale") {
        return "tag for transformation in " + messageError
    }

    // x
    var x = this.reader.getFloat(scale, 'sx');
    if (!(x != null && !isNaN(x)))
        return "unable to parse x-coordinate of the scale in " + messageError;

    // y
    var y = this.reader.getFloat(scale, 'sy');
    if (!(y != null && !isNaN(y)))
        return "unable to parse y-coordinate of the scale in " + messageError;

    // z
    var z = this.reader.getFloat(scale, 'sz');
    if (!(z != null && !isNaN(z)))
        return "unable to parse z-coordinate of the scale in " + messageError;

    let scales = [];
    scales.push(...[x, y, z]);
    return new Scale(scales);
}