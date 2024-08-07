import { toLower } from "./utils.js";
import { Coordinate } from "./Coordinate.js";
import { MoveValidator } from "./Validators/MoveValidator.js";
import { PositionValidator} from "./Validators/PositionValidator.js";

export class Board{
    constructor(size){
        this.size = size
        this.board = this.#emptyBoard(size)
        this.#fillPlayers()
        this.moveValidator = new MoveValidator()
    }

    #emptyBoard(size){
        var grid = [];
        for(var i = 0; i < size; i++){
            var line = []
            for(var j = 0; j < size; j++){
                if( (i%2 == j%2))
                    line.push('0')
                else line.push('X')
            }
            grid.push(line)        
        }
        return grid
    }

    #fillPlayers(){
        // whites
        for(var i = 0; i<3; i++){
            for(var j = 0; j<this.size; j++){
                if(this.#isBlack(i,j)) {
                    this.board[i][j] = "w"
                }
            }
        }
        // black
        for(var i = 1; i<=3; i++){
            for(var j = 0; j<this.size; j++){
                if(this.#isBlack(i,j)) {
                    this.board[this.size-i][j] = "b"
                }
            }
        }
    }

    #isBlack(x, y){
        if(x < this.size && y<this.size && x >= 0 && y >= 0 ){
            if(this.board[x][y] != '0') return true
            else return false
        }
        return false
    }

    access(coordinate){
        return this.board[coordinate.x][coordinate.y]
    }

    modify(coordinate, value){
        this.board[coordinate.x][coordinate.y] = value
    }

    move(origin, destiny){
        const originPiece = this.access(origin)
        this.modify(origin, 'X')
        this.modify(destiny, originPiece)
    }

    allPossibleCaptures(turn){
        var possibleCaptures = [] 
        for(var i = 0; i < this.size; i++){
            for(var j = 0; j < this.size; j++){
                const coordinate = new Coordinate(i, j)
                if(toLower(this.access(coordinate))!= turn){
                    continue;
                }
                const captures = this.moveValidator.capturesPossible(this, coordinate, turn)
                if(captures.length != 0){
                    possibleCaptures.push([coordinate, captures])
                }
            }
        }
        return possibleCaptures
    }

    possibleCapturesMultiple(turn, coordinate){
        var possibleCaptures = []
        const captures = this.moveValidator.capturesPossible(this, coordinate, turn)
        if(captures.length != 0){
            possibleCaptures.push([coordinate, captures])
        }
        return possibleCaptures
    }

    validateMove(origin, destiny, possibleCaptures){
        if(possibleCaptures.length == 0){
            if(!this.moveValidator.directionVerifier(this, origin, destiny)){
                console.log("Invalid direction")
                return false
            }
        } else{
            if(!this.moveValidator.captureValidator(origin, destiny, possibleCaptures)){
                console.log("There's a possible capture. Must take it")
                return false
            }
        }
        return true
    }

    captureCoord(origin, destiny){
        return this.moveValidator.captureTarget(origin, destiny)
    }

    arrivedOnQueen(turn, coordinate){
        switch(turn){
            case 'b':
                if(coordinate.x == 0) return true
                return false
            case 'w':
                if(coordinate.x == 7) return true
                return false
        }
    }

    copy(){
        var size = this.size
        var board = []
        for(const i of this.board){
            board.push([...i])
        }
        var newBoard =  new Board(size)
        newBoard.board = board
        return newBoard
    }
}