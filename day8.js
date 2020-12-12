// Day eight

const fs = require('fs');

let gameProgram
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day8Input.txt', 'utf8')
    gameProgram = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

//  part one

const generateInstructionTracker = (gameProgram) => {
    const trackingObj = {}
    gameProgram.forEach((instruction, idx) => {
        trackingObj[idx] = {
            tracked: false,
            instruction: instruction,
        }
    })
    return trackingObj
}

// const trackingObj = generateInstructionTracker(gameProgram)
// console.log(trackingObj)

const extractInstrDirectionMagnitude = (instrValue) => {
    const instrDirection = instrValue.slice(0, 1)
    const instrMagnitude = parseInt(instrValue.slice(1))

    return { instrDirection, instrMagnitude }
}

const calculateAccValue = (gameProgram) => {
    const trackingObj = generateInstructionTracker(gameProgram)

    let instructionTracker = 0
    let acc = 0

    // // As long as we haven't visited the same instruction twice, we keep going
    while (!trackingObj[instructionTracker].tracked) {
        // mark as visited
        trackingObj[instructionTracker].tracked = true

        // retrieve instructions
        const instructionStr = trackingObj[instructionTracker].instruction
        const [instruction, instructionValue] = instructionStr.split(' ')
        const { instrDirection, instrMagnitude } = extractInstrDirectionMagnitude(instructionValue)

        if (instruction === 'acc') {
            if (instrDirection === '+') acc += instrMagnitude
            if (instrDirection === '-') acc -= instrMagnitude
            instructionTracker++
        } else if (instruction === 'jmp') {
            if (instrDirection === '+') instructionTracker += instrMagnitude
            if (instrDirection === '-') instructionTracker -= instrMagnitude
        } else {
            instructionTracker++
        }
    }

    return acc
}

const testGameProgram = [
    'nop +0',
    'acc +1',
    'jmp +4',
    'acc +3',
    'jmp -3',
    'acc -99',
    'acc +1',
    'jmp -4',
    'acc +6',
]

console.log(calculateAccValue(gameProgram))

// part two

// Strategy: try flipping every single `jmp` to `nop`. If the program terminates, you know
// you have the right one

const testGameProgramUpdated = [
    'nop +0',
    'acc +1',
    'jmp +4',
    'acc +3',
    'jmp -3',
    'acc -99',
    'acc +1',
    'nop -4',
    'acc +6',
]

const calculateAccValueUpdated = (trackingObj, maxIdxVal) => {
    console.log('visiting')
    let instructionTracker = 0
    let acc = 0

    // // As long as we haven't visited the same instruction twice, we keep going
    while (!trackingObj[instructionTracker].tracked) {
        // console.log(trackingObj)
        console.log(trackingObj[instructionTracker], instructionTracker, acc, maxIdxVal)

        // mark as visited
        trackingObj[instructionTracker].tracked = true

        // retrieve instructions
        const instructionStr = trackingObj[instructionTracker].instruction
        const [instruction, instructionValue] = instructionStr.split(' ')
        const { instrDirection, instrMagnitude } = extractInstrDirectionMagnitude(instructionValue)

        if (instruction === 'acc') {
            if (instrDirection === '+') acc += instrMagnitude
            if (instrDirection === '-') acc -= instrMagnitude
            instructionTracker++
        } else if (instruction === 'jmp') {
            if (instrDirection === '+') instructionTracker += instrMagnitude
            if (instrDirection === '-') instructionTracker -= instrMagnitude
        } else {
            instructionTracker++
        }

        if (instructionTracker === maxIdxVal + 1) {
            instructionTracker--
            break
        }
    }

    return { instructionTracker, acc }
}


const findErroneousJmp = (gameProgram) => {
    const trackingObj = generateInstructionTracker(gameProgram)
    const terminatingIdxVal = gameProgram.length - 1
    let idxTracker
    let accumValue
    let changedInstr

    for (i = 0; i < terminatingIdxVal + 1; i++) {
        // console.log(trackingObj[i])
        const instructionStr = trackingObj[i].instruction
        const [instruction, instructionValue] = instructionStr.split(' ')
        const { instrDirection, instrMagnitude } = extractInstrDirectionMagnitude(instructionValue)
        if (instruction === 'jmp') {
            const modTrackingObj = JSON.parse(JSON.stringify(trackingObj))
            modTrackingObj[i] = {
                tracked: false,
                instruction: `nop ${instrDirection}${instrMagnitude}`,
            }

            const { instructionTracker, acc } = calculateAccValueUpdated(modTrackingObj, terminatingIdxVal)
            // console.log(instructionTracker, acc, terminatingIdxVal)
            idxTracker = instructionTracker
            accumValue = acc
            changedInstr = {
                idx: i,
                value: trackingObj[i]
            }

            if (idxTracker === terminatingIdxVal) {
                console.log('did i get here')
                break
            }
        }
    }

    return { idxTracker, accumValue, changedInstr }
}

// const testTrackingObj = generateInstructionTracker(testGameProgramUpdated)
// console.log(testTrackingObj)
// console.log(calculateAccValueUpdated(testTrackingObj, 8))

// console.log(findErroneousJmp(testGameProgram))
console.log(findErroneousJmp(gameProgram))