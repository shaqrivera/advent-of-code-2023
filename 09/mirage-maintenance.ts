import fs from 'fs'
const input = fs.readFileSync('input.txt', 'utf-8').split(/\n/g)

/**
 * 
 * @param history An array of number arrays representing the entire set of histories
 * @returns The entire set of histories gets mapped into an array, of arrays of histories
 * This new master set contains all of each history traced down to a row of 0's
 */
const parseHistories = (history: number[][]) => {
    return history.map(history => {
        const historyRows: number[][] = []
        while(!historyRows[historyRows.length - 1]?.every(n => n === 0)){
            const lastRow = historyRows[historyRows.length - 1]
            const nextRow: number[] = []
            if(!lastRow) {
                historyRows.push(history)
                continue
            }
            for(let i = 0; i < lastRow.length - 1; i++) {
                nextRow.push(lastRow[i + 1] - lastRow[i])
            }
            historyRows.push(nextRow)
        }
        return historyRows
    })
}

/**
 * 
 * @param histories an array, of arrays of histories
 * @returns The sum of all of the next predictable numbers from the first history in the array of histories
 */
const sumPredictedNextNumbers = (histories: number[][][]) => {
    return histories.reduce((a, history) => {
        const newRows: number[][] = []
        for(let i = history.length - 1; i >= 0; i--){
            const row = history[i]
            const rowBelow = newRows.pop()
            if(!rowBelow) {
                newRows.push([...row, 0])
                continue
            }
            const numberToAdd = rowBelow[rowBelow.length - 1]
            newRows.push([...row, row[row.length - 1] + numberToAdd])
        }
        const [row] = newRows
        return a + row[row.length - 1]
    }, 0)
}

/**
 * The sum of all of the next predictable numbers from the first history
 *  in the array of histories when numbers are predicted at the end of the history
 * @returns 
 */
const partOne = () => {
    const histories = parseHistories(input.map(s => s.split(' ').map(s => parseInt(s))))
    return sumPredictedNextNumbers(histories)
}

/**
 * The sum of all of the next predictable numbers from the first history
 *  in the array of histories when numbers are predicted at the beginning of the history
 * @returns 
 */
const partTwo = () => {
    const histories = parseHistories(input.map(s => s.split(' ').map(s => parseInt(s)).reverse()))
    return sumPredictedNextNumbers(histories)
}

console.log('---------Day 9: Mirage Maintenance---------')
console.log('Part one: The sum of all the extrapolated numbers is: ', partOne())
console.log('Part two: The sum of all the extrapolated numbers is: ', partTwo())
