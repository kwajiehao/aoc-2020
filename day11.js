// day eleven 

const fs = require('fs');
const { join } = require('path');
const { measureMemory } = require('vm');

let seatingPlan
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day11Input.txt', 'utf8')
    seatingPlan = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// console.log(seatingPlan[0].length, seatingPlan.length)

// part one

const checkForHashes = (adjacentSeatArr) => {
    let containsHash = false
    adjacentSeatArr.forEach((seatVal) => {
        if (!containsHash) {
            if (seatVal === '#') containsHash = true
        }
    })

    return containsHash
}

const countOccupiedSeats = (adjacentSeatArr) => {
    let occupiedSeatCount = 0
    adjacentSeatArr.forEach((seatVal) => {
        if (seatVal === '#') occupiedSeatCount += 1
    })
    return occupiedSeatCount
}

const calculateSeatOutput = (currSeatVal, adjacentSeatArr) => {
    // if (currSeatVal === '.') return currSeatVal

    if (currSeatVal === 'L') {
        // if (checkForHashes(adjacentSeatArr)) return currSeatVal
        if (!checkForHashes(adjacentSeatArr)) return '#'
    }

    if (currSeatVal === '#') {
        const adjacentOccupiedSeats = countOccupiedSeats(adjacentSeatArr)
        if (adjacentOccupiedSeats >= 4) return 'L'
    }

    return currSeatVal
}

const seatStateModifier = (seatingPlan) => {
    const newSeatPlan = []
    const seatPlanWidth = seatingPlan[0].length
    const seatPlanHeight = seatingPlan.length 

    let currSeatPlanRow = ''
    let seatChangeCount = 0
    for (i = 0; i < seatPlanHeight; i++) {
        for (j = 0; j < seatPlanWidth; j++) {
            const seatValue = seatingPlan[i][j]

            const adjacentSeats = []
            for (idx = 0; idx < 3; idx++) {
                for (jdx = 0; jdx < 3; jdx ++) {
                    if (!(idx === 1 && jdx === 1)) {
                        try {
                            const adjacentSeatVal = seatingPlan[i + (idx - 1)][j + (jdx - 1)]
                            if (adjacentSeatVal) adjacentSeats.push(adjacentSeatVal)
                        } catch (err) {
                            // do nothing
                        }
                    }
                }
            }

            const newSeatValue =  calculateSeatOutput(seatValue, adjacentSeats)
            currSeatPlanRow += newSeatValue
            if (newSeatValue !== seatValue) seatChangeCount += 1

            // reset if at the end of the row
            if (j === ((seatPlanWidth - 1))) {
                newSeatPlan.push(currSeatPlanRow)
                currSeatPlanRow = ''
            }
        }
    }

    return {
        newSeatPlan,
        seatChangeCount
    }
}

const testSeatPlan = [
    'L.LL.LL.LL',
    'LLLLLLL.LL',
    'L.L.L..L..',
    'LLLL.LL.LL',
    'L.LL.LL.LL',
    'L.LLLLL.LL',
    '..L.L.....',
    'LLLLLLLLLL',
    'L.LLLLLL.L',
    'L.LLLLL.LL',
]

// console.log(seatStateModifier(testSeatPlan))

const steadyStateCalculator = (seatingPlan) => {
    let tmpSeatPlan = seatingPlan
    let tmpSeatChangeCount

    while (tmpSeatChangeCount !== 0) {
        const { 
            newSeatPlan,
            seatChangeCount,
        } = seatStateModifier(tmpSeatPlan)

        tmpSeatPlan = newSeatPlan
        tmpSeatChangeCount = seatChangeCount
    }

    return tmpSeatPlan
}

// console.log(steadyStateCalculator(testSeatPlan))

const steadyStatePlan = steadyStateCalculator(seatingPlan)

let occupiedSeatCount = 0 
for (index = 0; index < steadyStatePlan.length; index++) {
    for (jindex = 0; jindex < steadyStatePlan[0].length; jindex++) {
        if (steadyStatePlan[index][jindex] === '#') occupiedSeatCount += 1
    }
}

console.log(occupiedSeatCount)

// part two

const calculateSeatOutputUpdated = (currSeatVal, adjacentSeatArr) => {
    // if (currSeatVal === '.') return currSeatVal

    if (currSeatVal === 'L') {
        // if (checkForHashes(adjacentSeatArr)) return currSeatVal
        if (!checkForHashes(adjacentSeatArr)) return '#'
    }

    if (currSeatVal === '#') {
        const adjacentOccupiedSeats = countOccupiedSeats(adjacentSeatArr)
        if (adjacentOccupiedSeats >= 5) return 'L'
    }

    return currSeatVal
}

const diffCalc = (idx, jdx) => {
    let yIndex = 0
    let xIndex = 0
    // top left
    if (idx === 0 && jdx === 0) {
        yIndex -= 1
        xIndex -= 1
        // console.log('top left')
    } 
    
    // top
    if (idx === 0 && jdx === 1) {
        yIndex -= 1
        // console.log('top')
    } 

    // top right
    if (idx === 0 && jdx === 2) {
        yIndex -= 1
        xIndex += 1
        // console.log('top right')
    } 

    // left
    if (idx === 1 && jdx === 0) {
        xIndex -= 1
        // console.log('left')
    } 

    // right
    if (idx === 1 && jdx === 2) {
        xIndex += 1
        // console.log('right')
    }

    // bottom left
    if (idx === 2 && jdx === 0) {
        yIndex += 1
        xIndex -= 1
        // console.log('bottom left')
    } 
    
    // bottom
    if (idx === 2 && jdx === 1) {
        yIndex += 1
        // console.log('bottom')
    } 

    // bottom right
    if (idx === 2 && jdx === 2) {
        yIndex += 1
        xIndex += 1
        // console.log('bottom right')
    } 

    return {
        xDiff: xIndex,
        yDiff: yIndex,
    }
}

const seatStateModifierUpdated = (seatingPlan) => {
    const newSeatPlan = []
    const seatPlanWidth = seatingPlan[0].length
    const seatPlanHeight = seatingPlan.length 

    let currSeatPlanRow = ''
    let seatChangeCount = 0
    for (i = 0; i < seatPlanHeight; i++) {
        for (j = 0; j < seatPlanWidth; j++) {
            const seatValue = seatingPlan[i][j]

            const adjacentSeats = []

            for (idx = 0; idx < 3; idx++) {
                for (jdx = 0; jdx < 3; jdx ++) {
                    if (!(idx === 1 && jdx === 1)) {

                        let yIndex = i + (idx - 1)
                        let xIndex = j + (jdx - 1)
                        let foundSeat = false

                        if (xIndex >= 0 && yIndex >= 0) {
                            // Stop the while loop if either 1) we found a seat, 2) indices are out of bounds
                            while ((xIndex >= 0 && yIndex >=0) && (xIndex < seatPlanWidth) && (yIndex < seatPlanHeight) && !foundSeat) {
                                // console.log(seatingPlan[yIndex], yIndex, xIndex)
                                const adjacentSeatVal = seatingPlan[yIndex][xIndex]
                                if (adjacentSeatVal !== '.') {
                                    foundSeat = true
                                    adjacentSeats.push(adjacentSeatVal)
                                } else {
                                    const {
                                        xDiff,
                                        yDiff,
                                    } = diffCalc(idx, jdx)

                                    yIndex += yDiff
                                    xIndex += xDiff
                                }
                            }
                        }
                    }
                }
            }

            const newSeatValue =  calculateSeatOutputUpdated(seatValue, adjacentSeats)
            currSeatPlanRow += newSeatValue
            if (newSeatValue !== seatValue) seatChangeCount += 1

            // reset if at the end of the row
            if (j === ((seatPlanWidth - 1))) {
                newSeatPlan.push(currSeatPlanRow)
                currSeatPlanRow = ''
            }
        }
    }

    return {
        newSeatPlan,
        seatChangeCount
    }
}

const steadyStateCalculatorUpdated = (seatingPlan) => {
    let tmpSeatPlan = seatingPlan
    let tmpSeatChangeCount

    while (tmpSeatChangeCount !== 0) {
        const { 
            newSeatPlan,
            seatChangeCount,
        } = seatStateModifierUpdated(tmpSeatPlan)

        tmpSeatPlan = newSeatPlan
        tmpSeatChangeCount = seatChangeCount
        // console.log(tmpSeatPlan)
    }

    return tmpSeatPlan
}


// console.log(seatStateModifierUpdated(testSeatPlan))
// console.log(steadyStateCalculatorUpdated(testSeatPlan))

const steadyStatePlanUpdated = steadyStateCalculatorUpdated(seatingPlan)

let occupiedSeatCountUpdated = 0 
for (index = 0; index < steadyStatePlanUpdated.length; index++) {
    for (jindex = 0; jindex < steadyStatePlanUpdated[0].length; jindex++) {
        if (steadyStatePlanUpdated[index][jindex] === '#') occupiedSeatCountUpdated += 1
    }
}

console.log(occupiedSeatCountUpdated)