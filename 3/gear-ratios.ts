import fs from 'fs'
const input = fs.readFileSync('input.txt').toString().split(/\n/g)

type NumberMap = Map<number, number>
type NumberArrayMap = Map<number, number[]>

const numbers: Map<number, NumberMap> = new Map()
const symbols: NumberArrayMap = new Map()
const parts: Map<number, NumberMap> = new Map()
const partsPerSymbol: Map<number, NumberArrayMap> = new Map()

input.map(line => {
    const numberReg = /\d+/g
    const symbolReg = /[^0-9\.]/g
    const numberMap: NumberMap = new Map()
    const symbolIndices: number[] = []
    let result: RegExpExecArray | null
    while ( (result = numberReg.exec(line)) ) {
        numberMap.set(result.index, parseInt(result.toString()))
    }
    while ( (result = symbolReg.exec(line)) ) {
        symbolIndices.push(result.index)
    }
    return { numberMap, symbolIndices }
}).forEach(({numberMap, symbolIndices}, i) => {
    numbers.set(i, numberMap)
    symbols.set(i, symbolIndices)
})

/**
 * 
 * @param {Number} number The number which we want to gather all the indexes for each character
 * @param {Number} startIndex The index at which the first character of the number was found at
 * @returns {Array<Number>} Returns an array containing each index of the number's characters
 */
const getAllIndices = (number: number, startIndex: number): number[] => {
    const numLength = `${number}`.length
    const indices: number[] = []
    for(let i = 0; i < numLength; i++) {
        indices.push(startIndex + i)
    }
    return indices
}

/**
 * 
 * @returns {Number}
 */
const partOne = (): number => {
    /**
     * 
     * @param {Number} rowIndex The index of the row we found the symbol in
     * @param {Number} symbolIndex The index of the column we found the symbol in
     * @returns {void} Returns void; Sets the partsMap to the parts variable
     */
    const checkRowForParts = (rowIndex: number, symbolIndex: number): void => {
        const [symbolLowBoundary, symbolHighBoundary] = [symbolIndex - 1, symbolIndex + 1]
        const numberMap = numbers.get(rowIndex)
        const partsMap = parts.get(rowIndex) || new Map() as NumberMap
        numberMap!.forEach((number, startIndex) => {
            const numberIndices = getAllIndices(number, startIndex)
            if(numberIndices.some(numberIndex => numberIndex >= symbolLowBoundary && numberIndex <= symbolHighBoundary)) {
                // Number touches the symbol
                partsMap.set(startIndex, number)
            }
        })
        parts.set(rowIndex, partsMap)
    }

    symbols.forEach((symbolIndices, rowIndex) => {
        symbolIndices.forEach((symbolIndex) => {
            // Look behind you!
            if(rowIndex > 0) {
                const behindRowIndex = rowIndex - 1
                checkRowForParts(behindRowIndex, symbolIndex)
            }
    
            // Look beside you!
            checkRowForParts(rowIndex, symbolIndex)
    
            // Look in front of you!
            if(rowIndex < symbols.size - 1) {
                const forwardRowIndex = rowIndex + 1
                checkRowForParts(forwardRowIndex, symbolIndex)
            }
        })
    })
    
    let sum = 0
    
    parts.forEach((row) => {
        row.forEach(number => {
            sum += number
        })
    })
    return sum
}

/**
 * 
 * @returns {Number}
 */
const partTwo = (): number => {
    /**
     * 
     * @param {Number} rowIndex The index of the row we found the symbol in
     * @param {Number} symbolIndex The index of the column we found the symbol in
     * @returns {void} Returns void; Sets the partsMap to the parts variable
     */
    const checkRowForParts = (rowIndex: number, symbolIndex: number, partsArray: number[]): void => {
        const [symbolLowBoundary, symbolHighBoundary] = [symbolIndex - 1, symbolIndex + 1]
        const numberMap = numbers.get(rowIndex)
        numberMap!.forEach((number, startIndex) => {
            const numberIndices = getAllIndices(number, startIndex)
            if(numberIndices.some(numberIndex => numberIndex >= symbolLowBoundary && numberIndex <= symbolHighBoundary)) {
                // Number touches the symbol
                partsArray.push(number)
            }
        })
    }

    symbols.forEach((symbolIndices, rowIndex) => {
        symbolIndices.forEach((symbolIndex) => {
            const partsArray: number[] = []
            // Look behind you!
            if(rowIndex > 0) {
                const behindRowIndex = rowIndex - 1
                checkRowForParts(behindRowIndex, symbolIndex, partsArray)
            }
    
            // Look beside you!
            checkRowForParts(rowIndex, symbolIndex, partsArray)
    
            // Look in front of you!
            if(rowIndex < symbols.size - 1) {
                const forwardRowIndex = rowIndex + 1
                checkRowForParts(forwardRowIndex, symbolIndex, partsArray)
            }
            const numberArrayMap = partsPerSymbol.get(rowIndex) || new Map() as NumberArrayMap
            numberArrayMap.set(symbolIndex, partsArray)
            partsPerSymbol.set(rowIndex, numberArrayMap)
        })
    })

    let sum = 0
    partsPerSymbol.forEach((row) => {
        row.forEach((numberArray) => {
            if(numberArray.length >= 2) {
                sum += numberArray.reduce((a,b) => a * b, 1)
            }
        })
    })
    return sum
}

console.log('Part one: the sum of all the part numbers in the schematic is ', partOne())
console.log('Part two: the sum of all the gear ratios in the schematic is ', partTwo())
