import { Coordinate } from "../Coordinate.js";
import { toLower, nextPlayer, isLowerCase } from "../utils.js";
import { Board } from "../Board.js";

export class MoveValidator {
    constructor() {
    }

    //given a set of pre calculated possible captures, verifies if one is taken
    captureValidator(origin, destiny, possibleCaptures){
        for(const i of possibleCaptures){
            if(i[0].equal(origin)){
                for(const j of i[1]){
                    if(j.equal(destiny)){
                        return true
                    }
                }
                break
            }
        }
        return false
    }

    //entry point to calculate all of the possible captures with origin in a given coordinate
    capturesPossible(board, coordinate, turn) {
        var piece = board.access(coordinate);

        var possibleDirections = Coordinate.allPossibleDirection();

        if(isLowerCase(piece)) {
            possibleDirections = possibleDirections.filter(a => this.basicDirectionVerifier(a, piece))
            return this.#simpleCaptures(board, possibleDirections, coordinate, turn)
        } else{
            return this.#kingCaptures(board, possibleDirections, coordinate, turn)
        }
    }

    //calculates all of the possible captures of simple pieces from a coordinate
    #simpleCaptures(board, possibleDirections, coordinate, turn){
        var candidates = []
        for (const x of possibleDirections) {
            var target = coordinate.sum(x);
            if (target.checkOverflow(board.size)) {
                continue;
            }
            var access = board.access(target);
            
            if (toLower(access) == nextPlayer(turn)) candidates.push([target, x]);
        }
        
        var captures = [];
        for (const pair of candidates) {
            var captureEnding = pair[0].sum(pair[1]);
            if (!captureEnding.checkOverflow(board.size) &&
                board.access(captureEnding) == "X") {
                captures.push(captureEnding);
            }
        }
        return captures;
    }

    //calculates all of the possible captures of king pieces from a coordinate
    #kingCaptures(board, possibleDirections, coordinate, turn){
        var candidates = []
        for (const x of possibleDirections) {
            let target = coordinate.sum(x);
            if (target.checkOverflow(board.size)) {
                continue;
            }
            var overflow = false;
            while(board.access(target) == "X"){
                target = target.sum(x)
                if (target.checkOverflow(board.size)) {
                    overflow = true
                    break;
                }
            }
            if(overflow) continue;

            var access = board.access(target);
            
            if (toLower(access) == nextPlayer(turn)) candidates.push([target, x]);
        }
        
        var captures = [];
        for (const pair of candidates) {
            var captureEnding = pair[0].sum(pair[1]);
            if (!captureEnding.checkOverflow(board.size) &&
                board.access(captureEnding) == "X") {
                captures.push(captureEnding);
            }
        }
        return captures;
    }
     
    //entry point of direction verification
    directionVerifier(board, origin, destiny) {
        const access = board.access(origin);
        var rightMove = false;
        const difference = destiny.diference(origin);
        
        if(!difference.isValidDirection()){
            rightMove = false
        }

        //regular pieces
        if (isLowerCase(access)) {
            rightMove = this.#singlePieceDirectionVerifier(access, difference)
        } else {
        //kings
            rightMove = this.#kingsPieceDirectionVerifier(board, origin, destiny, difference)
            return rightMove
        }

        return rightMove;
    }

    //king piece direction verifier
    #kingsPieceDirectionVerifier(board, origin, destiny, difference){
        if(!difference.isValidDirection()){
            return false
        }

        var direction = difference.basicDirection()
        var currentStep = new Coordinate(origin.x, origin.y)
        currentStep = currentStep.sum(direction)
        
        while(!currentStep.equal(destiny)){
            if(board.access(currentStep) != "X"){
                return false
            }
            currentStep = currentStep.sum(direction)
        }
        return true
    }

    //check if a simple piece without captures has a movement on hop away in the right direction
    #singlePieceDirectionVerifier(access, difference){
        var rightDirection = false;
            switch (access) {
                case "w":
                    if (difference.x == 1) {
                        rightDirection = true;
                    }
                    break;
                case "b":
                    if (difference.x == -1) {
                        rightDirection = true;
                    }
                    break;
                default:
                    rightDirection = false;
                    break;
            }
            return rightDirection;
    }

    //verifies if the direction of progression is the correct one for blaack or white pieces (can't move backwards)
    basicDirectionVerifier(direction, access){
        var rightDirection = false;
            switch (access) {
                case "w":
                    if (direction.x > 0) {
                        rightDirection = true;
                    }
                    break;
                case "b":
                    if (direction.x < 0) {
                        rightDirection = true;
                    }
                    break;
                default:
                    rightDirection = false;
                    break;
            }
            return rightDirection;
    }

    //in a case of a capture, returns which piece was captured
    captureTarget(origin, destiny){
        const difference = destiny.diference(origin);
        const basicDirection = difference.basicDirection()
        const previous = destiny.diference(basicDirection)
        return previous
    }
}
