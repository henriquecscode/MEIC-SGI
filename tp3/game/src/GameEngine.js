import { GameState } from "./State/GameState.js"
import { MenuState } from "./State/MenuState.js"

export class GameEngine{
    constructor(){
        this.state = new MenuState()
    }

    nextState(){
        if(this.state instanceof MenuState){
            this.state = new GameState()
        } else {
            this.state = new MenuState()
        }
    }

    pickGame(i, j){
        this.state.pick(i, j, this.gameComponent)
    }

    setGameComponent(gameComponent){
        this.gameComponent = gameComponent;
        this.state.setGameComponent(gameComponent)
    }
}