import fs from 'fs'
type Coordinates = [x: number, y: number]
const startingCoordinates: Coordinates = [0, 0]
const startingPipe = 'S'
const input = fs.readFileSync('input.txt', 'utf-8').split(/\n/g).map(((row, i) => {
    // Might as well grab the starting coordinates while we're parsing the input.
    const startingIndex = row.indexOf(startingPipe)
    if(startingIndex !== -1) {
        startingCoordinates[0] = startingIndex
        startingCoordinates[1] = i
    }
    return row.split('')
}))

const possibleConnections = {
    left: ['L', 'F', '-'],
    right: ['J', '7', '-'],
    up: ['7', 'F' ,'|'],
    down: ['L', 'J', '|']
}

/**
 * 
 * @param coordinates The x and y coordinates of the point to check if it is connected to the starting point
 * @param input An array of string arrays containing the parsed data from the input
 * @returns 
 */
const pipeIsConnectedToStart = (coordinates: Coordinates, input: string[][]) => {
    const pipe = input[coordinates[1]][coordinates[0]]
    if(possibleConnections.right.some(p => p === pipe)) {
        // Look left
        if(input[coordinates[1]][coordinates[0] - 1] === startingPipe) {
            return true
        }
    }
    if(possibleConnections.left.some(p => p === pipe)) {
        // Look right
        if(input[coordinates[1]][coordinates[0] + 1] === startingPipe) {
            return true
        }
    }
    if(possibleConnections.down.some(p => p === pipe)) {
        // Look up
        if(input[coordinates[1] - 1][coordinates[0]] === startingPipe) {
            return true
        }
    }
    if(possibleConnections.up.some(p => p === pipe)) {
        // Look down
        if(input[coordinates[1] + 1][coordinates[0]] === startingPipe) {
            return true
        }
    }
    return false
}

/**
 * 
 * @param coordinates The x and y coordinates of the point to find immediately connected pipes for
 * @param input An array of string arrays containing the parsed data from the input
 */
const findConnectedPipes = (coordinates: Coordinates, input: string[][]): Coordinates[] => {
    const connectedPipes: Coordinates[] = []
    // TODO: Parse the starting point's pipe type instead of hardcoding it
    const currentPipe = input[coordinates[1]][coordinates[0]] === 'S' ? 'L' : input[coordinates[1]][coordinates[0]]
    if(coordinates[0] > 0) {
        // Look left
        const searchPipe = input[coordinates[1]][coordinates[0] - 1]
        if(possibleConnections.left.some(pipe => pipe === searchPipe) && possibleConnections.right.some(pipe => pipe === currentPipe)) {
            connectedPipes.push([coordinates[0] - 1, coordinates[1]])
        }
    }
    if(coordinates[0] < input[0].length - 1) {
        // Look right
        const searchPipe = input[coordinates[1]][coordinates[0] + 1]
        if(possibleConnections.right.some(pipe => pipe === searchPipe) && possibleConnections.left.some(pipe => pipe === currentPipe)) {
            connectedPipes.push([coordinates[0] + 1, coordinates[1] ])
        }
    }
    if(coordinates[1] > 0) {
        // Look up
        const searchPipe = input[coordinates[1] - 1][coordinates[0]]
        if(possibleConnections.up.some(pipe => pipe === searchPipe) && possibleConnections.down.some(pipe => pipe === currentPipe)) {
            connectedPipes.push([coordinates[0], coordinates[1] - 1])
        }
    }
    if(coordinates[1] < input.length - 1) {
        // Look down
        const searchPipe = input[coordinates[1] + 1][coordinates[0]]
        if(possibleConnections.down.some(pipe => pipe === searchPipe) && possibleConnections.up.some(pipe => pipe === currentPipe)) {
            connectedPipes.push([coordinates[0], coordinates[1] + 1 ])
        }
    }
    return connectedPipes
}

/**
 * 
 * @param coordinates The x and y coordinates of the point to find all connected pipes for
 * @param input An array of string arrays containing the parsed data from the input
 * @returns 
 */
const findAllConnectedPipesForPoint = (coordinates: Coordinates, input: string[][]) => {
    const connectedPipes: Coordinates[] = []
    let circuitComplete = false
    while(!circuitComplete) {
        const previousCoordinates = connectedPipes[connectedPipes.length - 2] || []
        const currentCoordinates = connectedPipes[connectedPipes.length - 1] || coordinates
        const foundPipes = findConnectedPipes(currentCoordinates, input).filter((c => {
            return c[0] !== previousCoordinates[0] || c[1] !== previousCoordinates[1]
        }))[0]
        connectedPipes.push(foundPipes)
        if(connectedPipes.length > 1 && pipeIsConnectedToStart(foundPipes, input)) {
            circuitComplete = true
        }
    }
    return [...connectedPipes, startingCoordinates]
}

/**
 * 
 * @param connectedPipes An array of Coordinates containing all of the pipes connected to the starting point
 * @param input An array of string arrays containing the parsed data from the input
 * @returns An array of string arrays containing the input data with non connected characters replaced with a .
 */
const replaceNonConnectedCharacters = (connectedPipes: Coordinates[], input: string[][]) => {
    return input.map((row, y) => {
        return row.map(((pipe, x) => {
            if(connectedPipes.some(([connectedX, connectedY]) => {
                return connectedX === x && connectedY === y
            })){
                // Leave connected pipes in place
                return pipe
            }
            // Replace unconnected pipes with .
            return '.'
        }))
    })
}

/**
 * 
 * @param simplifiedInput An array of string arrays containing the input data with non connected characters replaced with a .
 * @returns The number of points that are contained inside of the pipe loop
 */
const getCountOutsideLoop = (simplifiedInput: string[][]) => {
    let outsideCount = 0
    simplifiedInput.forEach((row) => {
        row.forEach((char, x) => {
            if(char !== '.') {
                return
            }
            const leftSide = row.slice(0, x)
            /*
            Interestingly enough, if we cross a border an odd amount of times,
            then the point is contained inside the loop. 
            Elbow pieces count as one border.
            So 'F-----J' and 'L-----7' both would count as crossing the border once.
            Because of this, we can simply count the occurrences of 'J', 'L', and '|'.
            Also, since we know S is an L in this particular input data, we count it too
            */
           // TODO: Parse the starting point's pipe type instead of hardcoding it
            const crossings = leftSide.filter((s) => {
                return 'SJL|'.indexOf(s) !== -1
            })
            if(crossings.length % 2 === 1) {
                outsideCount++
            }
        })
    });
    return outsideCount
}

/**
 * 
 * @returns The number of steps to get to the furthest pipe connected to the starting point
 */
const partOne = () => {
    const allConnectedPipes = findAllConnectedPipesForPoint(startingCoordinates, input)
    return Math.floor(allConnectedPipes.length / 2)
}

/**
 * 
 * @returns The number of positions inside the pipe loop
 */
const partTwo = () => {
    const allConnectedPipes = findAllConnectedPipesForPoint(startingCoordinates, input)
    const simplifiedInput = replaceNonConnectedCharacters(allConnectedPipes, input)
    return getCountOutsideLoop(simplifiedInput)
}

console.log('Part one: The number of steps to get to the furthest pipe connected to the starting point is ', partOne())
console.log('Part two: The number of positions inside of the pipe loop is ', partTwo())