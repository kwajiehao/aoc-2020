// Day five

const fs = require('fs');

let seatingData
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day5Input.txt', 'utf8')
    seatingData = data
        .toString()
        .split('\n') // data is separated by double new lines
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// console.log(seatingData)

// part one

const calculateRowNum = (seatStr) => {
    let upperRowNum = 127
    let lowerRowNum = 0
    for (i = 0; i < 6; i++) {
        if (seatStr[i] === 'F') {
            upperRowNum = upperRowNum - ((upperRowNum + 1 - lowerRowNum) / 2)
        }

        if (seatStr[i] === 'B') {
            lowerRowNum = lowerRowNum + ((upperRowNum - (lowerRowNum - 1)) / 2)
        }
    }

    if (seatStr[6] === 'F') return lowerRowNum
    if (seatStr[6] === 'B') return upperRowNum
}

const calculateColumnNum = (seatStr) => {
    let upperColNum = 7
    let lowerColNum = 0
    for (i = 7; i < 9; i++) {
        if (seatStr[i] === 'L') {
            upperColNum = upperColNum - ((upperColNum + 1 - lowerColNum) / 2)
        }

        if (seatStr[i] === 'R') {
            lowerColNum = lowerColNum + ((upperColNum - (lowerColNum - 1)) / 2)
        }
    }


    if (seatStr[9] === 'L') return lowerColNum
    if (seatStr[9] === 'R') return upperColNum
}

const seatIdCalculator = (rowNum, colNum) => rowNum * 8 + colNum

// console.log(calculateRowNum('FBFBBFFRLR'))
// console.log(calculateColumnNum('FBFBBFFRLR'))

const calculateSeatId = (seatStr) => {
    const rowNum = calculateRowNum(seatStr)
    const colNum = calculateColumnNum(seatStr)
    const seatId = seatIdCalculator(rowNum, colNum)
    return {
        seatId,
        rowNum,
        colNum,
    }
}

const idArr = seatingData.map(calculateSeatId)
const maxId = idArr.reduce((a, b) => {
    if (b.seatId > a.seatId) return b
    return a
})
console.log(maxId)

const minId = idArr.reduce((a, b) => {
    if (b.seatId < a.seatId) return b
    return a
})
console.log(minId)

// part two

const idNumArr = idArr.map((seatDetails) => seatDetails.seatId).sort((a, b) => a - b)
console.log(idNumArr)

let missingSeatId
for (i = 0; i < idNumArr.length - 1; i++) {
    if (idNumArr[i + 1] - idNumArr[i] !== 1) {
        missingSeatId = idNumArr[i + 1] - 1
        break
    }
}
console.log(missingSeatId)