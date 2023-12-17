import fs from 'fs'
type SpringsMap = [ symbols: string, numbers: string ]
const input = fs.readFileSync('input.txt', 'utf-8').split(/\n/g).map(s => s.split(' ')) as SpringsMap[]
const cache: Map<string, number> = new Map()

const isQuestionMark = (character: string) => character === '?'
const containsBrokenSpring = (characters: string) => characters.indexOf('#') !== -1
const containsWorkingSpring = (characters: string) => characters.indexOf('.') !== -1
const possiblyBroken = (character: string) => containsBrokenSpring(character) || isQuestionMark(character)
const possiblyWorking = (character: string) => containsWorkingSpring(character) || isQuestionMark(character)

/**
 * 
 * @param springsMap An array containing a string of symbols at the first index,
 * and a string of comma separated numbers at the second index
 * @returns The number of possible arrangements for the given springsMap
 */
const findPossibleArrangements = (springsMap: SpringsMap): number => {
    const [symbolString, numberString] = springsMap
    if(!symbolString) {
        // If there are no more characters left, but numbers remaining, there are no remaining valid configurations
        // If no numbers remain, then there is exactly one valid configuration remaining
        return numberString ? 0 : 1
    } 
    if(!numberString) {
        // If no numbers remain, but we still have known broken springs, then there are no remaining valid configurations
        // If there are no more broken springs, then there is exactly one valid configuration remaining
        return containsBrokenSpring(symbolString) ? 0 : 1
    }

    const cacheKey = symbolString + numberString
    const cachedResult = cache.get(cacheKey)
    if(cachedResult !== undefined) {
        return cachedResult
    }

    let possibleArrangements = 0
    const numbers = numberString.split(',').map(s => parseInt(s))
    const beginning = symbolString.charAt(0)
    if(possiblyWorking(beginning)) {
        // If the symbols begin with a working spring, recurse with the same numbers and without the first symbol
        possibleArrangements += findPossibleArrangements([symbolString.substring(1), numberString])
    }
    if(possiblyBroken(beginning)) {
        const [number, ...nextNumbers] = numbers
        const { length } = symbolString
        const segment = symbolString.substring(0, number)
        if(number <= length && !containsWorkingSpring(segment) && (number === length || possiblyWorking(symbolString.charAt(number)) )) {
            /* 
                IF the remaining symbol string length isn't less than the current number,
                AND the segment we are trying to build doesn't contain a working spring,
                AND EITHER the remaining symbol string length is exactly the current number
                OR the symbol immediately succeeding the segment is possible a working spring
                THEN recurse with the next numbers and without the first symbol
            */
            possibleArrangements += findPossibleArrangements([symbolString.substring(number + 1), nextNumbers.join(',')])
        }
    }

    cache.set(cacheKey, possibleArrangements)
    return possibleArrangements
}

/**
 * 
 * @returns The sum of all the possible arrangements for the hot springs maps
 */
const partOne = () => {
    const allPossibleArrangements: number[] = []
    input.forEach(springsMap => {
        allPossibleArrangements.push(findPossibleArrangements(springsMap))
    })
    return allPossibleArrangements.reduce((a,b) => a + b)
}

/**
 * 
 * @returns The sum of all the possible arrangements for the expanded hot springs maps
 */
const partTwo = () => {
    const allPossibleArrangements: number[] = []
    input.map((springsMap) => {
        const [symbolString, numberString] = springsMap
        const expandedSymbols = new Array(5).fill(symbolString).join('?')
        const expandedNumbers = new Array(5).fill(numberString).join(',')
        return [expandedSymbols, expandedNumbers] as SpringsMap
    }).forEach(springsMap => {
        allPossibleArrangements.push(findPossibleArrangements(springsMap))
    })
    return allPossibleArrangements.reduce((a,b) => a + b)
}

console.log('Part one: The sum of all the possible arrangements for the hot springs maps is ', partOne())
console.log('Part two: The sum of all the possible arrangements for the expanded hot springs maps is ', partTwo())