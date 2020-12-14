// day thirteen 

const fs = require('fs');

let busSchedule
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day13Input.txt', 'utf8')
    busSchedule = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// console.log(busSchedule)

// part one
const earliestDepartureTimeStamp = busSchedule[0]
const busIdsInService = busSchedule[1].split(',').filter((elem) => elem !== 'x')
// console.log(earliestDepartureTimeStamp, busIdsInService)

const constructSchedule = (earliestDepartureTimeStamp, busIdsInService) => {
    let foundDepartureBus = false
    let timestamp = parseInt(earliestDepartureTimeStamp)
    let targetBusId
    
    while (!foundDepartureBus) {
        busIdsInService.forEach((busId) => {
            console.log(busId, timestamp, timestamp % busId)
            if (timestamp % busId === 0) {
                targetBusId = busId
                foundDepartureBus = true
            }
        })
        if (!foundDepartureBus) timestamp += 1
    }

    // return {
    //     timestamp,
    //     targetBusId,
    // }
    return (parseInt(timestamp) - parseInt(earliestDepartureTimeStamp)) * parseInt(targetBusId)
}

const testTimestamp = '939'
const testBusIds = ['7','13','59','31','19']
// console.log(constructSchedule(testTimestamp, testBusIds))
// console.log(constructSchedule(earliestDepartureTimeStamp, busIdsInService))

// part two
const generateBusIdOffsets = (busIdList) => {
    const busIds = busIdList.split(',')
    // console.log(busIdList, busIds)
    const busIdOffsets = []

    let currOffset = 0
    for (i = 0; i < busIds.length; i++) {
        if (busIds[i] === 'x') {
            currOffset += 1
            continue
        } else {
            busIdOffsets.push(currOffset)
        }
        currOffset += 1
    }

    return {
        busIds: busIds.filter(elem => elem !== 'x').map(elem => parseInt(elem)),
        busIdOffsets,
    }
}

const busIdsInServiceInt = busIdsInService.map((busId) => parseInt(busId))
const { busIdOffsets } = generateBusIdOffsets(busSchedule[1])
console.log(busIdsInServiceInt, busIdOffsets)

const testBusIds2 = '67,7,x,59,61' // '17,x,13,19' // '67,x,7,59,61' // x % 17, (x+2) % 13, (x+3) % 19 must all be 0
const {
    busIds: testBusIds2Output,
    busIdOffsets: testBusIds2OutputOffsets
} = generateBusIdOffsets(testBusIds2)

const testOffsetObject = testBusIds2Output.map((busId, idx) => {
    return {
        id: busId,
        offset: ((busId - testBusIds2OutputOffsets[idx]) % busId) < 0 ? busId - (testBusIds2OutputOffsets[idx] % busId) : ((busId - testBusIds2OutputOffsets[idx]) % busId)
    }
})
// console.log(testOffsetObject)
const offSetObject = busIdsInServiceInt.map((busId, idx) => {
    // console.log(busId, busIdOffsets[idx], busId - busIdOffsets[idx])
    return {
        id: busId,
        offset: ((busId - busIdOffsets[idx]) % busId) < 0 ? busId - (busIdOffsets[idx] % busId) : ((busId - busIdOffsets[idx]) % busId)
    }
})
const sortedTestOffsetObjectArr = testOffsetObject.sort((a, b) => b.id  - a.id)
const sortedTestOffsetObjectArr2 = [
    { id: 11, offset: 5 },
    { id: 7, offset: 6 },
    { id: 3, offset: 1 },
  ]
const sortedOffsetObjectArr = offSetObject.sort((a, b) => b.id  - a.id)
console.log(sortedTestOffsetObjectArr)

const findX = (sortedOffsetObjectArr) => {
    let lcm = sortedOffsetObjectArr[0].id
    let guess = sortedOffsetObjectArr[0].offset
    let increment = sortedOffsetObjectArr[0].id

    for (i = 0; i < sortedOffsetObjectArr.length - 1; i++) {
        lcm *= sortedOffsetObjectArr[i+1].id
        while (guess < lcm) {
            console.log(guess, sortedOffsetObjectArr[i+1].id, guess % sortedOffsetObjectArr[i+1].id)
            if (guess % sortedOffsetObjectArr[i+1].id === sortedOffsetObjectArr[i+1].offset) {
                increment *= sortedOffsetObjectArr[i+1].id
                break
            } else {
                guess += increment
            }
        }
    }
    return guess
}

// console.log(findX(sortedOffsetObjectArr))
// console.log(findX(sortedTestOffsetObjectArr2))
