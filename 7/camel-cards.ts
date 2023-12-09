import fs from 'fs'

type HandInfo = { hand: string, bid: number }
enum HANDS {
    FIVE_OF_A_KIND = 'five-of-a-kind',
    FOUR_OF_A_KIND = 'four-of-a-kind',
    FULL_HOUSE = 'full-house',
    THREE_PAIR = 'three-pair',
    TWO_PAIR = 'two-pair',
    ONE_PAIR = 'one-pair',
    HIGH_CARD = 'high-card'
}

const hands = fs.readFileSync('input.txt', 'utf-8').split(/\n/g).map(line => line.split(' '))
const handRankings = [HANDS.FIVE_OF_A_KIND, HANDS.FOUR_OF_A_KIND, HANDS.FULL_HOUSE, HANDS.THREE_PAIR, HANDS.TWO_PAIR, HANDS.ONE_PAIR, HANDS.HIGH_CARD]

/**
 * 
 * @param firstValue The highest count of the same type of card in the hand
 * @param secondValue The second highest count of the same type of card in the hand
 * @param jokers The count of jokers in the hand, if any
 * @returns The calculated hand ranking from the HANDS enum
 */
const calculateRanking = (firstValue: number, secondValue: number, jokers = 0) => {
    if(firstValue + jokers === 5) {
        return HANDS.FIVE_OF_A_KIND
    }
    if(firstValue + jokers === 4) {
        return HANDS.FOUR_OF_A_KIND
    }
    if(firstValue + jokers === 3 && secondValue === 2) {
        return HANDS.FULL_HOUSE
    }
    if(firstValue + jokers === 3 && secondValue < 2) {
        return HANDS.THREE_PAIR
    }
    if(firstValue === 2 && secondValue + jokers === 2) {
        return HANDS.TWO_PAIR
    }
    if(firstValue + jokers === 2 && secondValue < 2) {
        return HANDS.ONE_PAIR
    }
    return HANDS.HIGH_CARD
}

/**
 * 
 * @param hand A string representing one hand of cards
 * @returns The calculated hand ranking from the HANDS enum, NOT accounting for jokers
 */
const getHandRanking = (hand: string): HANDS => {
    const countByLetter = new Map()
    for(let i = 0; i < hand.length; i++) {
        const letter = hand.charAt(i)
        const letterCount = countByLetter.get(letter) || 0
        countByLetter.set(letter, letterCount + 1)
    }
    const values = Array.from(countByLetter.values()).sort((a,b) => b - a)
    return calculateRanking(values[0], values[1])
}

/**
 * 
 * @param hand A string representing one hand of cards
 * @returns The calculated hand ranking from the HANDS enum, accounting for jokers
 */
const getHandRankingWithJokers = (hand: string): HANDS => {
    const countByLetter: Map<string, number> = new Map()
    for(let i = 0; i < hand.length; i++) {
        const letter = hand.charAt(i)
        const letterCount = countByLetter.get(letter) || 0
        countByLetter.set(letter, letterCount + 1)
    }
    let jokersInHand = false
    const values = Array.from(countByLetter.entries()).sort(([a, countA], [b, countB]) => {
        if(a === 'J') {
            jokersInHand = true
            return 1
        }
        if(b === 'J') {
            jokersInHand = true
            return -1
        }
        return countB - countA
    }).map(([_, val]) => val)
    
    const jokers = jokersInHand ? values.pop() || 0 : 0
    const firstValue = values[0] || 0
    const secondValue = values[1] || 0
    return calculateRanking(firstValue, secondValue, jokers)
}

/**
 * 
 * @returns The sum of all the winnings from each hand
 */
const partOne = () => {
    const cardRankings = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
    const rankedHands: Map<HANDS, HandInfo[]> = new Map()
    hands.forEach(([hand, bid]) => {
        const handRanking = getHandRanking(hand)
        const rankedHandsEntry = rankedHands.get(handRanking) || []
        rankedHands.set(handRanking, [...rankedHandsEntry, { hand, bid: parseInt(bid) }])
    })

    const rankedHandsArray = handRankings.reduce((a, b) => {
        const handsAndBids = rankedHands.get(b) || []
        return [...a, ...handsAndBids.sort((c,d) => {
            const handOne = c.hand.split('')
            const handTwo = d.hand.split('')
            for(let i = 0; i < handOne.length; i++) {
                if(handOne[i] !== handTwo[i]) {
                    return cardRankings.indexOf(handTwo[i]) - cardRankings.indexOf(handOne[i])
                }

            }
            return 0
        })]
    }, [] as HandInfo[])

    return rankedHandsArray.reverse().reduce((a,b,i) => {
        const rank = i + 1
        return a + (b.bid * rank)
    }, 0)
}

/**
 * 
 * @returns The sum of all the winnings from each hand
 */
const partTwo = () => {
    const cardRankings = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']
    const rankedHands: Map<HANDS, HandInfo[]> = new Map()
    hands.forEach(([hand, bid]) => {
        const handRanking = getHandRankingWithJokers(hand)
        const rankedHandsEntry = rankedHands.get(handRanking) || []
        rankedHands.set(handRanking, [...rankedHandsEntry, { hand, bid: parseInt(bid) }])
    })

    const rankedHandsArray = handRankings.reduce((a, b) => {
        const handsAndBids = rankedHands.get(b) || []
        return [...a, ...handsAndBids.sort((c,d) => {
            const handOne = c.hand.split('')
            const handTwo = d.hand.split('')
            for(let i = 0; i < handOne.length; i++) {
                if(handOne[i] !== handTwo[i]) {
                    return cardRankings.indexOf(handTwo[i]) - cardRankings.indexOf(handOne[i])
                }

            }
            return cardRankings.indexOf(handTwo[4]) - cardRankings.indexOf(handOne[4])
        })]
    }, [] as HandInfo[])

    return rankedHandsArray.reverse().reduce((a,b,i) => {
        const rank = i + 1
        return a + (b.bid * rank)
    }, 0)
}

console.log('Part one: The sum of all the winnings from each hand is: ', partOne())
console.log('Part two: The sum of all the winnings from each hand is: ', partTwo())
