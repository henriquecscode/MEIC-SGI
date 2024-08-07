import { Board } from "../src/Board.js";
import { MoveValidator } from "../src/Validators/MoveValidator.js";
import { Coordinate } from "../src/Coordinate.js";

test('direction verifier test', () => {
    var initialBoard = new Board(8);
    var moveValidator = new MoveValidator()
    var expectedBoard = [['0', 'w', '0', 'w', '0', 'w', '0', 'w'],
    ['w', '0', 'w', '0', 'w', '0', 'w', '0'],
    ['0', 'w', '0', 'w', '0', 'w', '0', 'w'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0'],
    ['0', 'X', '0', 'X', '0', 'X', '0', 'X'],
    ['b', '0', 'b', '0', 'b', '0', 'b', '0'],
    ['0', 'b', '0', 'b', '0', 'b', '0', 'b'],
    ['b', '0', 'b', '0', 'b', '0', 'b', '0']]
    expect(initialBoard.board).toStrictEqual(expectedBoard);
    initialBoard.modify(new Coordinate (3,2), 'w')

    var direction1 = moveValidator.directionVerifier(initialBoard, new Coordinate(2,1), new Coordinate(3,2))
    var direction2 = moveValidator.directionVerifier(initialBoard,new Coordinate(3,2), new Coordinate(2,1))
    expect(direction1).toBe(true)
    expect(direction2).toBe(false)
    direction1 = moveValidator.directionVerifier(initialBoard,new Coordinate(2,1), new Coordinate(4,4))
    expect(direction1).toBe(false)
})


