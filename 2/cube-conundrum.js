import fs from 'fs'
const input = fs.readFileSync('input.txt').toString().split(/\n/g)

const gameRecord = {}
input.forEach(line => {
    const splitLine = line.split(/[\:\;]/g)
    const [gameNumberString, ...handfuls] = splitLine
    const gameNumber = gameNumberString.split(' ')[1]
    gameRecord[gameNumber] = {}

    handfuls.forEach(h => {
        const handful = h.trim().split(', ').map(x => x.split(' '))
        handful.forEach(color => {
            const colorCount = parseInt(color[0])
            const colorName = color[1]
            if(gameRecord[gameNumber][colorName]) {
                gameRecord[gameNumber][colorName].push(colorCount)
            } else {
                gameRecord[gameNumber][colorName] = [colorCount]
            }
        })
    })
})

const partOne = () => {
    const possibleGames = []

    for(const gameNumber in gameRecord) {
        const gameCounts = gameRecord[gameNumber]
        const possibleRed = gameCounts['red'].every(count => count <= 12)
        const possibleGreen = gameCounts['green'].every(count => count <= 13)
        const possibleBlue = gameCounts['blue'].every(count => count <= 14)
        if(possibleRed && possibleGreen && possibleBlue) {
            possibleGames.push(parseInt(gameNumber))
        }
    }
    return possibleGames.reduce((prev, curr) => prev + curr ,0)
}

const partTwo = () => {
    const powers = []

    for(const gameNumber in gameRecord) {
        const gameCounts = gameRecord[gameNumber]
        const maxRed = Math.max(...gameCounts['red'])
        const maxGreen = Math.max(...gameCounts['green'])
        const maxBlue = Math.max(...gameCounts['blue'])
        powers.push(maxRed * maxGreen * maxBlue)
    }
    return powers.reduce((prev, curr) => prev + curr ,0)

}

console.log('Part one: the sum of the IDs of all the possible games is: ', partOne())

console.log('Part two: the sum of all the powers of minimum required cubes for each game is: ', partTwo())

