import { State } from "./State.js";

export class MenuState extends State{
    constructor(){
        super();
        console.log("I created a menu state")
    }

    pick(i, j){
        console.log("I picked in menu")
    }
}