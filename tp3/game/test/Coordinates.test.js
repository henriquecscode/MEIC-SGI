import { Coordinate } from "../src/Coordinate.js";

test('Coordinate sum test', () =>{
    const coor1 = new Coordinate(0,1)
    const coor2 = new Coordinate(4,0)
    const coorResult = coor1.sum(coor2)
    expect(coorResult).toStrictEqual(new Coordinate(4,1))
})

test('Normalize coordinates', () => {
    const coor1 = new Coordinate(0,1)
    const coor2 = new Coordinate(4,0)
    const coor3 = new Coordinate(4,4)
    var coorResult = coor1.isValidDirection()
    expect(coorResult).toStrictEqual(false)
    coorResult = coor2.isValidDirection()
    expect(coorResult).toStrictEqual(false)
    coorResult = coor3.isValidDirection()
    expect(coorResult).toStrictEqual(true)

})

test('Basic direction', ()=>{
    var coord1 = new Coordinate(4,4)
    expect(coord1.basicDirection()).toStrictEqual(new Coordinate(1,1))
    coord1 = new Coordinate(-4,4)
    expect(coord1.basicDirection()).toStrictEqual(new Coordinate(-1,1))
    coord1 = new Coordinate(4,-4)
    expect(coord1.basicDirection()).toStrictEqual(new Coordinate(1,-1))
})