import { Board } from "../src/Board.js";
import { MoveValidator } from "../src/Validators/MoveValidator.js";
import { Coordinate } from "../src/Coordinate.js";

test("queen test", () => {
    var initialBoard = new Board(8);
    initialBoard. board = [['0', 'X', '0', 'X', '0', 'X', '0', 'X'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0'],
    ['0', 'w', '0', 'w', '0', 'w', '0', 'w'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0'],
    ['0', 'X', '0', 'X', '0', 'X', '0', 'X'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0'],
    ['0', 'X', '0', 'B', '0', 'X', '0', 'X'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0']]
    var moveValidator = new MoveValidator()
    expect(moveValidator.directionVerifier(initialBoard,new Coordinate(6, 3), new Coordinate(3, 2))).toStrictEqual(false);
    expect(moveValidator.directionVerifier(initialBoard,new Coordinate(6, 3), new Coordinate(4, 1))).toStrictEqual(true);

    initialBoard.board = [['0', 'X', '0', 'X', '0', 'X', '0', 'X'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0'],
    ['0', 'w', '0', 'w', '0', 'w', '0', 'w'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0'],
    ['0', 'X', '0', 'X', '0', 'X', '0', 'X'],
    ['X', '0', 'w', '0', 'X', '0', 'X', '0'],
    ['0', 'X', '0', 'B', '0', 'X', '0', 'X'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0']]
    moveValidator = new MoveValidator()
    expect(moveValidator.directionVerifier(initialBoard,new Coordinate(6, 3), new Coordinate(3, 2))).toStrictEqual(false);
    expect(moveValidator.directionVerifier(initialBoard,new Coordinate(6, 3), new Coordinate(4, 1))).toStrictEqual(false);
    expect(moveValidator.directionVerifier(initialBoard,new Coordinate(6, 3), new Coordinate(5, 4))).toStrictEqual(true);

    initialBoard.board = [['0', 'X', '0', 'X', '0', 'X', '0', 'X'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0'],
    ['0', 'w', '0', 'w', '0', 'w', '0', 'w'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0'],
    ['0', 'w', '0', 'X', '0', 'X', '0', 'X'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0'],
    ['0', 'X', '0', 'B', '0', 'X', '0', 'X'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0']]
    moveValidator = new MoveValidator()
    console.log(moveValidator.capturesPossible(initialBoard, new Coordinate(6,3), 'b'))
})