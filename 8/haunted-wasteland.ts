import fs from 'fs'
const [rawMoves, _, ...rawMaps] = fs.readFileSync('input.txt', 'utf-8').split(/\n/g)
const moves = rawMoves.split('')
const mapsArray = rawMaps.map(s => s.split(' = ').map((x, i) => {
    if(i === 0) {
        return x
    }
    const letters = x.match(/[A-Z]+/g)
    return letters
}))

type DestinationList = { left: string, right: string }
enum LEFT_OR_RIGHT {
    L = 'left',
    R = 'right'
}

const map: Map<string, DestinationList> = new Map()
mapsArray.forEach(row => {
    const [left, right] = row[1] as string[]
    map.set(row[0] as string, { left, right })
})

/**
 * 
 * @param startingPoint A string representing the position to start from
 * @param leftOrRight 'left' or 'right' indicating which direction to move in, relative to the starting point
 * @returns A string representing the ending point after moving in the specified direction
 */
const move = (startingPoint: string, leftOrRight: LEFT_OR_RIGHT) => map.get(startingPoint)![leftOrRight]
/**
 * 
 * @param startingPoint A string representing the position to start from
 * @returns  A string representing the ending point after moving left
 */
const moveLeft = (startingPoint: string) => move(startingPoint, LEFT_OR_RIGHT.L)
/**
 * 
 * @param startingPoint A string representing the position to start from
 * @returns  A string representing the ending point after moving right
 */
const moveRight = (startingPoint: string) => move(startingPoint, LEFT_OR_RIGHT.R)

/**
 * 
 * @returns The lowest number of moves needed to traverse the map from AAA to ZZZ
 */
const partOne = () => {
    let moveCount = 0
    let startingPoint = 'AAA'
    while(startingPoint !== 'ZZZ') {
        const currentMove = moves[moveCount % moves.length]
        if(currentMove === 'L') {
            startingPoint = moveLeft(startingPoint)
        }else {
            startingPoint = moveRight(startingPoint)
        }
        moveCount++
    }
    return moveCount
}

/**
 * 
 * @returns The lowest number of steps it takes for all of the points 
 *          that end with the character A to reach a point ending in 
 *          the character Z on the same step
 */
const partTwo = () => {
    const startingPoints: string[] = Array.from(map.keys()).filter(s => s.charAt(s.length - 1) === 'A')
    const movesToFinish: number[] = []
    let i = 0
    let moveCount = 0
    while(movesToFinish.length !== startingPoints.length) {
        const startingPoint = startingPoints[i]
        const currentMove = moves[moveCount % moves.length]

        if(startingPoint.charAt(startingPoint.length - 1) === 'Z') {
            movesToFinish.push(moveCount)
            moveCount = 0
            i++
        } else {
            if(currentMove === 'L') {
                startingPoints[i] = moveLeft(startingPoint)
            }else {
                startingPoints[i] = moveRight(startingPoint)
            }
            moveCount++
        }
    }
    const smallestNumberOfMoves = Math.max(...movesToFinish)
    let multiplier = 1
    while(!movesToFinish.every(n => (smallestNumberOfMoves * multiplier) % n === 0)) {
        multiplier++
    }
    return smallestNumberOfMoves * multiplier
}

console.log('---------Day 8: Haunted Wasteland---------')
console.log('Part one: The total number of moves to reach ZZZ from AAA is: ', partOne())
console.log('Part two: The total number of moves for all starting points to reach a point ending in Z is: ', partTwo())
