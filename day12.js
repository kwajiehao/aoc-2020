// day twelve 

const fs = require('fs');

let directions
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day12Input.txt', 'utf8')
    directions = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// console.log(directions)

// part one

const calcChangeInPosition = (instructionStr, currDirection) => {
    const instruction = instructionStr.slice(0, 1)
    const magnitude = parseInt(instructionStr.slice(1))

    let deltaX = 0
    let deltaY = 0
    let newDirection = currDirection

    // Directional change
    if (instruction === 'L') {
        // Use >= because we don't want to allow 360
        if (currDirection + magnitude >= 360) {
            newDirection = currDirection + magnitude - 360
        } else {
            newDirection = currDirection + magnitude
        }
    }

    if (instruction === 'R') {
        // Use < 0 because we don't want to allow 360
        if (currDirection - magnitude < 0) {
            newDirection = currDirection - magnitude + 360
        } else {
            newDirection = currDirection - magnitude
        }
    }

    // Move in same direction
    if (instruction === 'F') {
        // assumption: direction is either 0, 90, 180, 270
        if (currDirection === 0) {
            deltaX = magnitude
        }

        if (currDirection === 90) {
            deltaY = magnitude
        }

        if (currDirection === 180) {
            deltaX = 0 - magnitude
        }

        if (currDirection === 270) {
            deltaY = 0 - magnitude
        }
    }

    // Shift in this direction
    if (instruction === 'N') {
        deltaY = magnitude
    }

    if (instruction === 'S') {
        deltaY = 0 - magnitude
    }

    if (instruction === 'E') {
        deltaX = magnitude
    }

    if (instruction === 'W') {
        deltaX = 0 - magnitude
    }

    return {
        deltaX,
        deltaY,
        newDirection,
    }
}

const calculateFinalPosition = (directions) => {
    let xCoord = 0
    let yCoord = 0
    let direction = 0

    directions.forEach((instructionStr) => {
        const {
            deltaX,
            deltaY,
            newDirection,
        } = calcChangeInPosition(instructionStr, direction)

        xCoord += deltaX
        yCoord += deltaY
        direction = newDirection
    })

    return {
        xCoord,
        yCoord,
        direction,
    }
}

const testInstructions = ['F10', 'N3', 'F7', 'R90', 'F11']
// console.log(calculateFinalPosition(testInstructions))
// console.log(calculateFinalPosition(directions)) // { xCoord: 403, yCoord: -187, direction: 90 }

// part two

function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

// console.log(rotate(0, 0, 2, 1, -90))

const calcChangeInPositionUpdated = (instructionStr, currWaypointX, currWaypointY) => {
    const instruction = instructionStr.slice(0, 1)
    const magnitude = parseInt(instructionStr.slice(1))

    let deltaX = 0
    let deltaY = 0
    let newWaypointX = currWaypointX
    let newWaypointY = currWaypointY

    // Directional changes
    if (instruction === 'L') {
        // rotate anticlockwise by magnitude
        const [updatedWaypointX, updatedWaypointY] = rotate(0, 0, currWaypointX, currWaypointY, 0 - magnitude)
        newWaypointX = updatedWaypointX
        newWaypointY = updatedWaypointY
    }

    if (instruction === 'R') {
        // rotate clockwise by magnitude
        const [updatedWaypointX, updatedWaypointY] = rotate(0, 0, currWaypointX, currWaypointY, magnitude)
        newWaypointX = updatedWaypointX
        newWaypointY = updatedWaypointY
    }

    // Move in same direction
    if (instruction === 'F') {
        deltaX = magnitude * currWaypointX
        deltaY = magnitude * currWaypointY
    }

    // Shift in this direction
    if (instruction === 'N') {
        newWaypointY = currWaypointY + magnitude
    }

    if (instruction === 'S') {
        newWaypointY = currWaypointY - magnitude
    }

    if (instruction === 'E') {
        newWaypointX = currWaypointX + magnitude
    }

    if (instruction === 'W') {
        newWaypointX = currWaypointX - magnitude
    }

    return {
        deltaX,
        deltaY,
        newWaypointX,
        newWaypointY
    }
}

const calculateFinalPositionUpdated = (directions, currWaypointX, currWaypointY) => {
    let xCoord = 0
    let yCoord = 0
    let waypointX = currWaypointX
    let waypointY = currWaypointY

    directions.forEach((instructionStr) => {
        const {
            deltaX,
            deltaY,
            newWaypointX,
            newWaypointY
        } = calcChangeInPositionUpdated(instructionStr, waypointX, waypointY)

        xCoord += deltaX
        yCoord += deltaY
        waypointX = newWaypointX
        waypointY = newWaypointY
    })

    return {
        xCoord,
        yCoord,
        waypointX,
        waypointY,
    }
}

// console.log(calculateFinalPositionUpdated(testInstructions, 10, 1))
// console.log(calculateFinalPositionUpdated(directions, 10, 1))
