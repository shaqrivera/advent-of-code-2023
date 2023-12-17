import fs from 'fs'
const input = fs.readFileSync('input.txt', 'utf-8').split(/\n\n/g)

const seedToSoilMap: SourceMap = new Map()
const soilToFertilizerMap: SourceMap = new Map()
const fertilizerToWaterMap: SourceMap = new Map()
const waterToLightMap: SourceMap = new Map()
const lightToTemperatureMap: SourceMap = new Map()
const temperatureToHumidityMap: SourceMap = new Map()
const humidityToLocationMap: SourceMap = new Map()

const mapsArray: SourceMap[] = [
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    lightToTemperatureMap,
    temperatureToHumidityMap,
    humidityToLocationMap
]

// Drop the first line containing seeds
const [_, ...rawMaps] = input
const maps = rawMaps.map(m => m.split(/\n/g))

maps.forEach((mapArray, i) => {
    const currentMap = mapsArray[i]
    const [_, ...dataRows] = mapArray
    dataRows.forEach((row) => {
        const [ destination, source, count ] = row.split(' ').map((s) => parseInt(s))
        currentMap.set(source, { destination, count })
    })
})

/**
 * A map between sources, and their destinations. 
 * The key of the map corresponds to the source index.
 * The value of the map is an object containing the destination index, and the count of the range
 */
export type SourceMap = Map<number, { destination: number, count: number }>

/**
 * 
 * @param searchValue A number representing the index of the source value to search for
 * @param sourceMap The corresponding sourcemap to search, where the searchValue is present amongst the keys
 * @returns 
 */
const findMapRow = (searchValue: number, sourceMap: SourceMap) => {
    return Array.from(sourceMap.entries()).find(([source, { count }]) => searchValue >= source && searchValue <= source + count) || [ searchValue, { destination: searchValue, count: 0 } ]
}

/**
 * Finds the corresponding location index, given a seed index
 * @param seed The seed index to find a location for
 * @returns The location index corresponding to the seed
 */
export const findSeedLocation = (seed: number): number => {
    const foundSeedToSoilMap = findMapRow(seed, seedToSoilMap)
    const [ seedSource, { destination: soilDestination } ] = foundSeedToSoilMap

    const soil = soilDestination + ( seed - seedSource )
    const foundSoilToFertilizerMap = findMapRow(soil, soilToFertilizerMap)
    const [ soilSource, { destination: seedDestination } ] = foundSoilToFertilizerMap

    const fertilizer = seedDestination + ( soil - soilSource )
    const foundFertilizerToWaterMap = findMapRow(fertilizer, fertilizerToWaterMap)
    const [ fertilizerSource, { destination: WaterDestination } ] = foundFertilizerToWaterMap

    const water = WaterDestination + ( fertilizer - fertilizerSource )
    const foundWaterToLightMap = findMapRow(water, waterToLightMap)
    const [ waterSource, { destination: lightDestination } ] = foundWaterToLightMap

    const light = lightDestination + ( water - waterSource )
    const foundLightToTemperatureMap = findMapRow(light, lightToTemperatureMap)
    const [ lightSource, { destination: TemperatureDestination } ] = foundLightToTemperatureMap

    const temperature = TemperatureDestination + ( light - lightSource )
    const foundTemperatureToHumidityMap = findMapRow(temperature, temperatureToHumidityMap)
    const [ temperatureSource, { destination: humidityDestination } ] = foundTemperatureToHumidityMap

    const humidity = humidityDestination + ( temperature - temperatureSource )
    const foundHumidityToLocationMap = findMapRow(humidity, humidityToLocationMap)
    const [ humiditySource, { destination: locationDestination } ] = foundHumidityToLocationMap

    return locationDestination + ( humidity - humiditySource )
}

/**
 * Finds the corresponding ranges, given a search range, and a source map
 * @param low The lower end of the search range
 * @param high The higher end of the search range
 * @param sourceMap The corresponding sourcemap to search, where the search values are present amongst the keys
 * @returns 
 */
export const findCorrespondingRanges = (low: number, high: number, sourceMap: SourceMap): number[][] => {
    const ranges: number[][] = []
    sourceMap.forEach(({ destination, count }, source) => {
        const sourceEnd = source + count - 1
        const distance = destination - source
        if(!(sourceEnd < low || source > high)) {
            ranges.push([Math.max(source + distance, low + distance), Math.min(sourceEnd + distance, high + distance)])
        }
    })
    return ranges
}

export const flattenArray = (array: any[][]): any[] => {
    return array.flat(1)
}

/**
 * 
 * @param seedRanges A map of all the ranges of seeds to search.
 * @returns The lowest location index corresponding to the a seed in the ranges of seeds provided
 */
export const findLowestLocationForSeedRanges = (seedRanges: Map<number, number>): number => {
    const soilRanges: number[][][] = []
    seedRanges.forEach((high, low) => {
        soilRanges.push(findCorrespondingRanges(low, high, seedToSoilMap))
    })
    const fertilizerRanges: number[][][] = []
    flattenArray(soilRanges).forEach(([low, high]) => {
        fertilizerRanges.push(findCorrespondingRanges(low, high, soilToFertilizerMap))
    })
    const waterRanges: number[][][] = []
    flattenArray(fertilizerRanges).forEach(([low, high]) => {
        waterRanges.push(findCorrespondingRanges(low, high, fertilizerToWaterMap))
    })
    const lightRanges: number[][][] = []
    flattenArray(waterRanges).forEach(([low, high]) => {
        lightRanges.push(findCorrespondingRanges(low, high, waterToLightMap))
    })
    const temperatureRanges: number[][][] = []
    flattenArray(lightRanges).forEach(([low, high]) => {
        temperatureRanges.push(findCorrespondingRanges(low, high, lightToTemperatureMap))
    })
    const humidityRanges: number[][][] = []
    flattenArray(temperatureRanges).forEach(([low, high]) => {
        humidityRanges.push(findCorrespondingRanges(low, high, temperatureToHumidityMap))
    })
    const locationRanges: number[][][] = []
    flattenArray(humidityRanges).forEach(([low, high]) => {
        locationRanges.push(findCorrespondingRanges(low, high, humidityToLocationMap))
    })

    const locations = flattenArray(locationRanges).map(([low]) => low)


    return locations.sort((a,b) => a - b)[0]
}