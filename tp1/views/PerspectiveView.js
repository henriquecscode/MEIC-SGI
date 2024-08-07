import { CGFcamera } from "../../lib/CGF.js";
import { View } from "./View.js";

export class PerspectiveView extends View{
    constructor(near, far, angle, from, to){
        super();
        this.camera = new CGFcamera(angle, near, far, from, to);
    }
}