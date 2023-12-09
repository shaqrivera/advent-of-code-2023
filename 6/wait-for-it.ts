import fs from 'fs'
const [timeRow, distanceRow] = fs.readFileSync('input.txt', 'utf-8').split(/\n/g)
const [_, ...times] = timeRow.split(/[A-Za-z]+\:\s+|\s+/g).map((s) => parseInt(s))
const [__, ...distances] = distanceRow.split(/[A-Za-z]+\:\s+|\s+/g).map((s) => parseInt(s))

/**
 * 
 * @returns The product of the ways to win
 */
const partOne = () => {
    const waysToWinArray: number[] = []
    times.forEach((time, i) => {
        let waysToWin = 0
        const distance = distances[i]
        for(let milliseconds = 1; milliseconds <= time; milliseconds++) {
            const score = milliseconds * ( time - milliseconds )
            if(score > distance) {
                waysToWin++
            }
        }
        waysToWinArray.push(waysToWin)
    })
    return waysToWinArray.reduce((a,b) => a * b)
}

/**
 * 
 * @returns The number of ways to win
 */
const partTwo = () => {
    const time = parseInt(times.reduce((a, b) => {
        return `${a}${b}`
    }, ''))
    const distance = parseInt(distances.reduce((a, b) => {
        return `${a}${b}`
    }, ''))

    let waysToWin = 0
    for(let milliseconds = 1; milliseconds <= time; milliseconds++) {
        const score = milliseconds * ( time - milliseconds )
        if(score > distance) {
            waysToWin++
        }
    }
    return waysToWin
}

console.log('Part one: The product of the ways to win is: ', partOne())
console.log('Part two: The number of ways to win is: ', partTwo())
