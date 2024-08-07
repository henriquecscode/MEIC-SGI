export class Coordinate{
    constructor(x, y){
        this.x = x;
        this.y = y; 
    }

    static upLeft(){
        return new Coordinate(-1,1)
    }

    static upRight(){
        return new Coordinate(1,1)
    }

    static downLeft(){
        return new Coordinate(-1,-1)
    }

    static downRight(){
        return new Coordinate(1,-1)
    }

    static allPossibleDirection(){
        return [this.upLeft(), this.upRight(), this.downLeft(), this.downRight()]
    }

    sum(coordinate){
        return new Coordinate(this.x + coordinate.x, this.y + coordinate.y)
    }

    diference(coordinate){
        return new Coordinate(this.x - coordinate.x, this.y - coordinate.y)
    }

    checkOverflow(tableSize){
        if(this.x >= tableSize || this.y >= tableSize){
            return true;
        }

        if(this.x < 0 || this.y < 0){
            return true;
        }

        return false;
    }

    isValidDirection(){
        const divY = this.y / this.x
        if(Math.abs(divY) == 1){
            return true
        } else{
            return false
        }
    }

    basicDirection(){
        const divisior = Math.abs(this.x)
        return new Coordinate(this.x/divisior, this.y/divisior)
    }

    equal(coordinate){
        return (this.x == coordinate.x && this.y == coordinate.y)
    }
}