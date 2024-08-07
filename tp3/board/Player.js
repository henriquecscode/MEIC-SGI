export class Player {
  constructor(id, board) {
    this.id = id;
    this.board = board;
    board.setPlayer(this);
  }
}
