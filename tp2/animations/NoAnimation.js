import '../../lib/CGF.js'
import { MyAnimation } from "./MyAnimation.js";

export class NoAnimation extends MyAnimation{
    constructor(id){
    super(id);
    }

    isVisible(){
        return true;
    }

    update(t){
        // do nothing  
    }

    apply(){
        // do nothing
    }
}