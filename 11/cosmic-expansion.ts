import fs from 'fs'
const input = fs.readFileSync('input.txt', 'utf-8').split(/\n/g)
type Coordinates = [x: number, y: number]
const rowsToExpand: number[] = []
const columnsToExpand: number[] = []

const universe = input.map(((row, y) => {
    const splitRow = row.split('')
    if(!splitRow.find(x => x === '#')) {
        rowsToExpand.push(y)
        return splitRow
    }
    return splitRow
}))

for(let x = 0; x < input[0].length; x++) {
    const column: string[] = []
    for(let y = 0; y < input.length; y++) {
        column.push(input[y][x])
    }
    if(!column.find(s => s === '#')) {
        columnsToExpand.push(x)
    }
}

const findGalaxyDistances = (universe: string[][], multiplier: number) => {
    const galaxies: Coordinates[] = []
    universe.forEach((row, y) => {
        row.forEach((char, x) => {
            if(char === '#') {
                galaxies.push([x,y])
            }
        })
    })
    const distances: number[] = []
    galaxies.forEach((galaxy, i) => {
        const pairGalaxies = galaxies.slice(i + 1)
        pairGalaxies.forEach(pairGalaxy => {
            const filteredRowsToExpandCount = rowsToExpand.filter(rowToExpand => rowToExpand >= Math.min(galaxy[1], pairGalaxy[1]) && rowToExpand <= Math.max(galaxy[1], pairGalaxy[1])).length
            const filteredColumnsToExpandCount =  columnsToExpand.filter(columnsToExpand => columnsToExpand >= Math.min(galaxy[0], pairGalaxy[0]) && columnsToExpand <= Math.max(galaxy[0], pairGalaxy[0])).length
            const rowExpansion = filteredRowsToExpandCount  * multiplier
            const columnExpansion = filteredColumnsToExpandCount * multiplier
            distances.push((Math.abs(galaxy[0] - pairGalaxy[0]) - filteredRowsToExpandCount) + (Math.abs(galaxy[1] - pairGalaxy[1]) - filteredColumnsToExpandCount) + rowExpansion + columnExpansion)
        })
    })
    return distances.reduce((a,b) => a + b, 0)
}

const partOne = () => {
    return findGalaxyDistances(universe, 2)
}

const partTwo = () => {
    return findGalaxyDistances(universe, 1000000)
}

console.log('Part one: The sum of all the shortest distances between galaxy pairs is ', partOne())
console.log('Part two: The sum of all the shortest distances between galaxy pairs is ', partTwo())
