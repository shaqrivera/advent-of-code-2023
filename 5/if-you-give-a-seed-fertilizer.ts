import fs from 'fs'
const input = fs.readFileSync('input.txt', 'utf-8').split(/\n\n/g)
import { findLowestLocationForSeedRanges, findSeedLocation, } from './utils'

const seeds = input[0].split(/seeds:\s|\s/g).filter(s => !!s).map((s) => parseInt(s))

/**
 * 
 * @returns The lowest location corresponding to one of the initial seeds
 */
const partOne = () => {
    const locations: number[] = []
    seeds.forEach((seed) => {
        const location = findSeedLocation(seed)
        location && locations.push(location)
    })
    return locations.sort((a,b) => a - b)[0]
}

/**
 * 
 * @returns The lowest location corresponding to one of the initial seeds
 */
const partTwo = () => {
    const seedRanges: Map<number, number> = new Map()
    for(let i = 0; i < seeds.length; i = i + 2) {
        const [ startingSeed, count ] = [ seeds[i], seeds[i + 1] ]
        seedRanges.set(startingSeed, startingSeed + count - 1)
    }
    return findLowestLocationForSeedRanges(seedRanges)
}

console.log('---------Day 5: If You Give A Seed A Fertilizer---------')
console.log('Part one: The lowest location corresponding to one of the initial seeds is ', partOne())
console.log('Part two: The lowest location corresponding to one of the initial seeds is ', partTwo())