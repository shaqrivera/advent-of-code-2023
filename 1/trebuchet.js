import fs from 'fs'
const input = fs.readFileSync('input.txt').toString().split(/\n/g)

/**
 * 
 * @returns {Number}
 */
const partOne = () => {
   return input.reduce((sum, line) => {
        const numbers = line.match(/\d/g)
        return sum + parseInt(numbers[0].toString() + numbers[numbers.length -1].toString())
    }, 0)
}

/**
 * 
 * @returns {Number}
 */
const partTwo = () => {
    const digits = {
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9
    }
    
    /**
     * 
     * @param {String | Number} numberOrWord
     * @returns {Number}
     */
    const parseNumbersAndWords = (numberOrWord) => {
        // All of words have a length greater than 1
        return numberOrWord.length > 1 ? digits[numberOrWord] : parseInt(numberOrWord)
    }

    return input.reduce((sum, line) => {
        const regex = /[\d]|one|two|three|four|five|six|seven|eight|nine/g
        const numbersAndWords = []
        let match;
        while (match = regex.exec(line)) {
            // Match overlapping words in the line
            regex.lastIndex -= match[0].length - 1;
            numbersAndWords.push(match[0]);
        }
        const firstPosition = parseNumbersAndWords(numbersAndWords[0])
        const lastPosition = parseNumbersAndWords(numbersAndWords[numbersAndWords.length - 1])
        return sum + parseInt(`${firstPosition}${lastPosition}`)
    }, 0)
}

console.log('---------Day One: Trebuchet?!---------')
console.log('Part one: The sum of all calibration values is ', partOne())
console.log('Part two: The sum of all calibration values is ', partTwo())