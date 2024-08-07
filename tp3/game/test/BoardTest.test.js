import { Board } from "../src/Board.js";
test('Initial board test', () => {
    var initialBoard = new Board(8);
    var expectedBoard = [['0', 'w', '0', 'w', '0', 'w', '0', 'w'],
    ['w', '0', 'w', '0', 'w', '0', 'w', '0'],
    ['0', 'w', '0', 'w', '0', 'w', '0', 'w'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0'],
    ['0', 'X', '0', 'X', '0', 'X', '0', 'X'],
    ['b', '0', 'b', '0', 'b', '0', 'b', '0'],
    ['0', 'b', '0', 'b', '0', 'b', '0', 'b'],
    ['b', '0', 'b', '0', 'b', '0', 'b', '0']]
    
    expect(initialBoard.board).toStrictEqual(expectedBoard);
  });

test('copy', () => {
  var initialBoard = new Board(8);
    var expectedBoard = [['0', 'w', '0', 'w', '0', 'w', '0', 'w'],
    ['w', '0', 'w', '0', 'w', '0', 'w', '0'],
    ['0', 'w', '0', 'w', '0', 'w', '0', 'w'],
    ['X', '0', 'X', '0', 'X', '0', 'X', '0'],
    ['0', 'X', '0', 'X', '0', 'X', '0', 'X'],
    ['b', '0', 'b', '0', 'b', '0', 'b', '0'],
    ['0', 'b', '0', 'b', '0', 'b', '0', 'b'],
    ['b', '0', 'b', '0', 'b', '0', 'b', '0']]
    
    expect(initialBoard.board).toStrictEqual(expectedBoard);

    var newBoard = initialBoard.copy()
    expect(initialBoard != newBoard).toStrictEqual(true);
})