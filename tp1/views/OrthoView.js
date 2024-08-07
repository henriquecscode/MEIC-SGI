import { CGFcameraOrtho } from "../../lib/CGF.js";
import { View } from "./View.js";

export class OrthoView extends View {
    constructor(near, far, left, right, top, bottom, from, to, up) {
        super();
        this.camera = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);
    }
}