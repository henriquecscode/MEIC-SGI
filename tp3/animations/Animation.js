import { MyAnimation } from "./MyAnimation.js";
export class Animation extends MyAnimation {
    constructor(sceneGraph, id, keyframes, callback = null, updateCallback = null) {
        super(id);
        this.sceneGraph = sceneGraph;
        this.keyframes = this.sortKeyframes(keyframes);
        this.instants = this.keyframes.map((kf) => kf.instant);
        this.transformation = mat4.create();
        this.callback = callback;
        this.updateCallback = updateCallback;
    }

    sortKeyframes(keyframes) {
        let sortedKeyframes = keyframes.sort((kf1, kf2) => {
            if (kf1.instant < kf2.instant) {
                return -1;
            }
            else if (kf1.instant > kf2.instant) {
                return 1;
            }
        });
        return sortedKeyframes;
    }

    isVisible(now) {
        return now >= this.keyframes[0].instant;
    }

    update(t) {
        if (this.updateCallback) {
            this.updateCallback(t, this);
        }

        for (let i = 0; i < this.instants.length - 1; i++) {
            if (t == this.instants[i]) {
                this.transformation = this.keyframes[i].getExactTransformation();
                return;
            }
            else if (t > this.instants[i] && t < this.instants[i + 1]) {
                let kf1 = this.keyframes[i];
                let kf2 = this.keyframes[i + 1];
                this.transformation = kf1.interpolate(t, kf2);
                return;
            }
        }
        this.transformation = this.keyframes[this.keyframes.length - 1].getExactTransformation();
        if (this.callback) {
            this.callback();
        }
    }

    apply() {
        this.sceneGraph.scene.multMatrix(this.transformation);
    }

}