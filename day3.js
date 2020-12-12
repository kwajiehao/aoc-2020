// Day three

const fs = require('fs');

let mapData
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day3Input.txt', 'utf8')
    mapData = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

//  Part one

const MAP_ROW_LENGTH = mapData[0].length

const countTreesV1 = (mapData) => {
    let treeCount = 0

    mapData.forEach((mapRow, idx) => {
        const mapRowIndex = (3 * idx) % MAP_ROW_LENGTH
        if (mapRow[mapRowIndex] === '#' && idx > 0) treeCount++
    })

    return treeCount
}

console.log(countTreesV1(mapData))

//  Part two

const countTreesGeneral = (mapData, rightIncrement, downIncrement) => {
    let treeCount = 0

    mapData.forEach((mapRow, idx) => {
        console.log(mapRow, rightIncrement, downIncrement)
        if (idx % downIncrement === 0) {
            const mapRowIndex = (rightIncrement * idx) % MAP_ROW_LENGTH
            console.log(mapRowIndex, mapRow[mapRowIndex])
            if (mapRow[mapRowIndex] === '#' && idx > 0) {
                treeCount++
            }
        }
    })

    return treeCount
}

const case1 = countTreesGeneral(mapData, 1, 1)
const case2 = countTreesGeneral(mapData, 3, 1)
const case3 = countTreesGeneral(mapData, 5, 1)
const case4 = countTreesGeneral(mapData, 7, 1)
const case5 = countTreesGeneral(mapData, 1, 2)
console.log(case1 * case2 * case3 * case4 * case5)
