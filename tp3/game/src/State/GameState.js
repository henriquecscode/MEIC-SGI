import { Board } from "../Board.js";
import { State } from "./State.js";
import { Coordinate } from "../Coordinate.js";
import { GameComponent } from "../../../board/GameComponent.js";
import { PositionValidator } from "../Validators/PositionValidator.js"
import { nextPlayer, toLower, toUpper, isLowerCase, sleep } from "../utils.js";

class PreviousBoard {
    constructor(board, turn, move, canTurnEnd) {
        this.board = board.map(function (arr) {
            return arr.slice();
        });
        this.turn = turn
        this.move = [...move]
        this.canTurnEnd = canTurnEnd
    }

}

export class GameState extends State {
    
    TOTAL_TIME = 1 * 60;
    TURN_TIME = 15;

    constructor(turn = "b") {
        super();
        this.size = 8;
        this.blackGames = 0
        this.whiteGames = 0
        this.resetState(turn)
    }

    setGameComponent(gameComponent) {
        this.gameComponent = gameComponent;
    }

    getState() {
        return this.board.board;
    }

    getChecker(i, j) {
        return this.board.board[i][j]
    }

    nextTurn() {
        this.turn = nextPlayer(this.turn)
        this.possibleCaptures = this.board.allPossibleCaptures(this.turn)
    }

    pick(i, j) {
        if (this.gameOver) {
            return
        }
        if(this.replay){
            return
        }
        if (this.animationInProgress > 0) {
            return;
        }
        if (this.canTurnEnd) {
            this.pickMultiple(i, j)
        } else {
            this.pickSimple(i, j)
        }

    }

    unverifiedPick(i, j){
        if (this.canTurnEnd) {
            this.pickMultiple(i, j)
        } else {
            this.pickSimple(i, j)
        }
    }

    pickMultiple(i, j) {
        this.canTurnEnd = false
        const destiny = new Coordinate(i, j)

        if (this.positionValidator.secondPositionPickValidator(this.board, destiny)) {
            if (this.board.validateMove(this.selectionCoordinate, destiny, this.possibleCaptures)) {
                const captureMade = this.move(this.selectionCoordinate, destiny)

                //Would it be possible to continue capturing?
                const multipleCapture = this.board.possibleCapturesMultiple(this.turn, destiny)
                if (!captureMade || multipleCapture.length == 0) {
                    this.selectionCoordinate = null
                    this.nextTurn()
                } else {
                    this.canTurnEnd = true
                    this.selectionCoordinate = destiny
                    this.gameComponent.displaySelection(this.selectionCoordinate.x, this.selectionCoordinate.y)
                    this.possibleCaptures = multipleCapture
                }
                // this.logMessage("Second pick")
            } else {
                this.logMessage("Invalid move")
                this.canTurnEnd = true
            }
        } else {
            this.logMessage("Error, can't pick that place")
            this.canTurnEnd = true
        }
    }

    pickSimple(i, j) {
        if (this.selectionCoordinate == null) {
            //first pick done
            if (this.positionValidator.firstPositionPickValidator(this.board, new Coordinate(i, j), this.turn)) {
                this.selectionCoordinate = new Coordinate(i, j)
                this.gameComponent.displaySelection(this.selectionCoordinate.x, this.selectionCoordinate.y)
            } else {
                this.logMessage("Error, can't pick that place")
            }

        } else {
            //second pick
            const destiny = new Coordinate(i, j)
            if (this.positionValidator.secondPositionPickValidator(this.board, destiny)) {

                if (this.board.validateMove(this.selectionCoordinate, destiny, this.possibleCaptures)) {
                    const captureMade = this.move(this.selectionCoordinate, destiny)

                    //Would it be possible to continue capturing?
                    const multipleCapture = this.board.possibleCapturesMultiple(this.turn, destiny)
                    if (!captureMade || multipleCapture.length == 0) {
                        this.nextTurn()
                    } else {
                        this.canTurnEnd = true
                        this.selectionCoordinate = destiny
                        this.gameComponent.displaySelection(this.selectionCoordinate.x, this.selectionCoordinate.y)
                        this.possibleCaptures = multipleCapture
                        return
                    }
                } else {
                    this.gameComponent.displaySelection(this.selectionCoordinate.x, this.selectionCoordinate.y)
                    this.logMessage("Invalid move")
                }
            } else {
                this.gameComponent.displaySelection(this.selectionCoordinate.x, this.selectionCoordinate.y)
                this.logMessage("Error, can't pick that place")
            }
            this.selectionCoordinate = null
        }
    }

    move(origin, destiny) {
        this.previousBoard.push(new PreviousBoard(this.board.board, this.turn, [origin, destiny], this.canTurnEnd))
        var wasCapture = false;
        var wasQueen = false
        if (this.possibleCaptures.length != 0) {
            const capture = this.board.captureCoord(origin, destiny)
            this.board.modify(capture, 'X')
            this.incPoints(this.turn)
            wasCapture = true
        }
        this.board.move(origin, destiny)
        this.gameComponent.movePiece(origin.x, origin.y, destiny.x, destiny.y)

        if (this.board.arrivedOnQueen(this.turn, destiny) && isLowerCase(this.board.access(destiny))) {
            wasQueen = true
            this.board.modify(destiny, toUpper(this.turn))
            this.toMakeQueen = destiny
            // this.gameComponent.makeQueen(destiny.x, destiny.y)
        }
        this.isEndGame()
        return wasCapture && !wasQueen
    }

    endTurn() {
        if(this.replay) return
        if(this.animationInProgress) return
        if (this.canTurnEnd) {
            this.gameComponent.displaySelection(this.selectionCoordinate.x, this.selectionCoordinate.y)
            this.selectionCoordinate = null
            this.nextTurn()
            this.canTurnEnd = false
        }
    }

    startedAnimation() {
        this.animationInProgress += 1;
    }

    finishedAnimation() {
        this.animationInProgress -= 1;
        if (this.animationInProgress == 0 && this.toMakeQueen) {
            this.gameComponent.makeQueen(this.toMakeQueen.x, this.toMakeQueen.y)
            this.toMakeQueen = null;
        }
    }

    canPickButton() {
        if(this.replay){
            this.logMessage("Replay in progress. Can't pick button")
            return false;
        }

        if (this.animationInProgress > 0) {
            this.logMessage("Animation in progress. Can't pick button")
            return false;
        }
        this.logMessage('');
        return true;
    }

    logMessage(message) {
        this.errorMessage = message;
    }

    resetState(turn = "b") {
        //Board issues 
        this.board = new Board(this.size);
        if (turn != "b" && turn != "w") turn = "b"
        this.turn = turn;

        //selection issues
        this.selectionCoordinate = null;
        
        //ending game issues and point issues
        this.blackPoints = 0
        this.whitePoints = 0
        this.gameOver = false

        //validators and control
        this.positionValidator = new PositionValidator(this.board)
        this.animationInProgress = 0;
        this.possibleCaptures = []
        this.canTurnEnd = false
        this.toMakeQueen = null

        //messages
        this.errorMessage = '';
       
        //replay and movie
        this.previousBoard = []
        this.replay = false
    }

    incPoints(turn) {
        if (toLower(turn) == "b") this.blackPoints++;
        else this.whitePoints++;
    }

    isEndGame() {
        var winner = null
        if (this.blackPoints >= 12) {
            winner = "black"
            this.blackGames++
        }
        if (this.whitePoints >= 12) {
            winner = "white"
            this.whiteGames++
        }
        if (winner != null) {
            this.gameOver = true
            this.logMessage("GameOver" + winner)
            console.log("Game Over " + winner)
        } //game over
    }

    updateStateTime(player, turnTime, blackTime, whiteTime) {
        //player is being passed because I am not sure if leaderboard and state might be out of sync 1 frame
        if (this.gameOver) {
            return;
        }
        if (turnTime > this.TURN_TIME) {
            //end game for the one playing
            this.gameOver = true;
            if (player == 'b') {
                this.logMessage("GameOver: white wins!")
                this.whiteGames++
            }
            else {
                this.logMessage("GameOver: black wins!")
                this.blackGames++
            }
            return;
        }

        else if (blackTime > this.TOTAL_TIME) {
            this.gameOver = true;
            this.logMessage("GameOver: white wins!")
            this.whiteGames++
            //end game black loses
        }

        else if (whiteTime > this.TOTAL_TIME) {
            this.gameOver = true;
            this.logMessage("GameOver: black wins!")
            this.blackGames++
        }
    }

    async movie() {
        this.gameComponent.leaderboard.pauseTime();

        var previousStates = this.previousBoard
        this.resetState()
        this.replay = true
        this.gameComponent.resetBoards()

        for (const move of previousStates) {
            this.unverifiedPick(move.move[0].x, move.move[0].y)
            await sleep(3000);
            this.unverifiedPick(move.move[1].x, move.move[1].y)
            await sleep(3000);
        }
        this.replay = false
        this.logMessage("End replay")
        this.gameComponent.leaderboard.resumeTime();
    }

    undo() {
        if(this.gameOver) return
        if(this.replay) return
        if(this.canTurnEnd) return
        if (this.previousBoard.length != 0) {
            this.board.board = this.previousBoard[this.previousBoard.length - 1].board
            this.turn = this.previousBoard[this.previousBoard.length - 1].turn
            this.canTurnEnd = this.previousBoard[this.previousBoard.length - 1].canTurnEnd
            if(this.canTurnEnd){
                this.selectionCoordinate = this.previousBoard[this.previousBoard.length - 1].move[1]
                
            } else {
                this.selectionCoordinate = null;
            }
            this.previousBoard.pop()
            this.gameComponent.resetBoards()
   
            this.selectionCoordinate = null;
            this.possibleCaptures = this.board.allPossibleCaptures(this.turn)
    
            this.toMakeQueen = null
        }
    }       
}