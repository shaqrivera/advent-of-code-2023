import fs from 'fs'
const input = fs.readFileSync('input.txt', 'utf-8').split(/\n/g)

/**
 * 
 * @param card A string containing all the data for the card. Each card is a row from the input data
 * @returns The number of winning numbers contained in the card
 */
const findCardMatches = (card: string) => {
    const [_, winningNumbersString, numbersInHandString] = card.split(/Card\s+\d+\:\s+|\s+\|\s+/g)
        const winningNumbers = new Set(winningNumbersString.split(/\s+/g))
        const numbersInHand = new Set(numbersInHandString.split(/\s+/g))
        let matches = 0
        numbersInHand.forEach((number) => {
            if(winningNumbers.has(number)) {
                matches++
            }
        })
        return matches
}

/**
 * 
 * @returns The sum of all the points won according to the rules for part one of the challenge
 */
const partOne = () => {
    return input.map((card) => {
        const matches = findCardMatches(card)
        let points = 0
        for(let i = 0; i < matches; i ++) {
            if(points === 0) {
                points += 1
            } else {
                points *= 2
            }
        }
        return points
    }).reduce((a, b) => a+b, 0)
}

/**
 * 
 * @returns The total number of cards won according to the rules for part two of the challenge
 */
const partTwo = () => {
    const cards: Map<number,{ matches: number, multiplier: number }> = new Map()
    input.forEach((card, index) => {
        const matches = findCardMatches(card)
        const cardStats = cards.get(index) || { matches, multiplier: 0 }
        cards.set(index, { matches, multiplier: cardStats.multiplier + 1 })
        for(let i = 0; i < cardStats.multiplier + 1; i++) {
            for(let j = 1; j <= matches; j++) {
                const cardAheadStats = cards.get(index + j) || { matches: 0, multiplier: 0 }
                cards.set(index + j, { ...cardAheadStats, multiplier: cardAheadStats.multiplier + 1  })
            }
        }
    })
    let sum = 0
    cards.forEach(card => {
        sum += card.multiplier
    })
    return sum
}

console.log('---------Day 4: Scratchcards---------')
console.log('Part one: The sum of all the points won is: ', partOne())
console.log('Part two: The total number of cards won is: ', partTwo())
