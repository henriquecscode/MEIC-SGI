import { Coordinate } from "../Coordinate.js"
import { Board } from "../Board.js"
import { toLower } from "../utils.js"

export class PositionValidator{
    constructor(){
    }

    firstPositionPickValidator(board, coordinate, turn){
        if(!this.#hasPiece(board, coordinate)){
            console.log("This position has no piece")
            return false
        }
        if(!this.#turnValidator(board, coordinate, turn)){
            console.log("Not your piece")
            return false
        }
        return true
    }

    secondPositionPickValidator(board, coordinate){
        if(!this.#emptyCell(board, coordinate)){
            console.log("This position already has a piece")
            return false
        } 
        return true
    }

    #emptyCell(board, coordinate){
        if(board.access(coordinate) != 'X'){
            return false
        } else{
            return true
        }
    }

    #hasPiece(board, coordinate){
        let access = board.access(coordinate) 
        if(access != 'X' && access != '0'){
            return true
        } else{
            return false
        }
    }

    #turnValidator(board, coordinate, turn){
        let access = board.access(coordinate) 
        if (toLower(access) == toLower(turn)){
            return true
        } else { 
            return false
        }
    }


}