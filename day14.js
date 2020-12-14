// day fourteen 

const fs = require('fs');
const _ = require('lodash');

let dockingData
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day14Input.txt', 'utf8')
    dockingData = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// console.log(dockingData)

const cleanDockingData = (dockingData) => {
    const cleanedDockingData = []
    let currMask = ''

    dockingData.forEach((dataStr) => {
        const dataStrArr = dataStr.split(' = ')
        if (dataStrArr[0] === 'mask') {
            currMask = dataStrArr[1]
        } else {
            const idx = dataStrArr[0].split('[')[1].split(']')[0]
            cleanedDockingData.push({
                mask: currMask,
                idx,
                value: dataStrArr[1],
            })
        }
    })
    return cleanedDockingData
}
const cleanedDockingData = cleanDockingData(dockingData)
// console.log(cleanedDockingData)


function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

function bin2dec(bin) {
    return parseInt(bin, 2)
}

function replicateChar(char, len) {
    let res = ''
    for (i = 0; i < len; i++) {
        res += char
    }
    return res
}

// part one

const maskComparison = (mask, binVal) => {
    const lenDiff = mask.length - binVal.length
    const standardizedBinVal = replicateChar('0', lenDiff) + binVal
    
    let result = ''

    for (i = 0; i < standardizedBinVal.length; i++) {
        if (mask[i] === 'X') {
            result += standardizedBinVal[i]
        } else {
            result += mask[i]
        }
    }
    return result
}

const generateValueObject = (cleanedDockingData) => {
    const valObj = {}

    cleanedDockingData.forEach((dockingData) => {
        const {
            mask, idx, value,
        } = dockingData
        const binVal = dec2bin(value)
        const binResult = maskComparison(mask, binVal)
        valObj[idx] = bin2dec(binResult)
    })

    return valObj
}

const calculateResult = (resObj) => {
    let count = 0
    Object.keys(resObj).forEach((resObjKey) => {
        count += resObj[resObjKey]
    })
    return count
}

const testCleanedDockingData = [
    {
        mask: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X',
        idx: '8',
        value: '11'
    },
    {
        mask: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X',
        idx: '7',
        value: '101'
    },
    {
        mask: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X',
        idx: '8',
        value: '0'
    },
]

// console.log(generateValueObject(testCleanedDockingData))
// console.log(calculateResult(generateValueObject(testCleanedDockingData)))
// console.log(calculateResult(generateValueObject(cleanedDockingData)))

// part two
const maskComparisonUpdated = (mask, binVal) => {
    const lenDiff = mask.length - binVal.length
    const standardizedBinVal = replicateChar('0', lenDiff) + binVal

    let result = ''
    let xIdx = []

    for (i = 0; i < standardizedBinVal.length; i++) {
        if (mask[i] === '0') {
            result += standardizedBinVal[i]
        } else if (mask[i] === '1') {
            result += 1
        } else {
            result += 'X'
            xIdx.push(i)
        }
    }
    return {
        result,
        xIdx,
    }
}

const generateBinStringRecursive = (results) => {
    if (typeof results === 'string') return [results + '0', results + '1']
    if (typeof results === 'object') return results.map((elem) => {
        return generateBinStringRecursive(elem)
    })
}

const generateAllBinStrings = (len) => {
    let results = []
    for (i = 0; i < len; i++) {
        if (i === 0) {
            results.push('0', '1')
        } else {
            results = generateBinStringRecursive(results)
        }
    }
    return _.flattenDeep(results)
}

const generateResultsArray = (binResult, xIndices) => {
    const resArr = []
    const numX = xIndices.length
    const allBinStrings = generateAllBinStrings(numX)

    for (i = 0; i < allBinStrings.length; i++) {
        let tmpResult = binResult
        for (j = 0; j < numX; j++) {
            tmpResult = tmpResult.slice(0, xIndices[j]) + allBinStrings[i][j] + tmpResult.slice(xIndices[j] + 1)
        }

        // calculate res
        resArr.push(bin2dec(tmpResult))
    }
    return resArr
}

// console.log(generateResultsArray('000000000000000000000000000000X1101X', [30, 35]))

const generateValueObjectUpdated = (cleanedDockingData) => {
    const valObj = {}

    cleanedDockingData.forEach((dockingData) => {
        const {
            mask, idx, value,
        } = dockingData
        const binVal = dec2bin(idx)
        const { result: binResult, xIdx: xIndices } = maskComparisonUpdated(mask, binVal)
        const idxArr = generateResultsArray(binResult, xIndices)
        idxArr.forEach((index) => {
            valObj[index] = value
        })


        // console.log(generateResultsArray(binResult, xIndices))
    })

    return valObj
}

const calculateResultUpdated = (resObj) => {
    let count = 0
    Object.keys(resObj).forEach((resObjKey) => {
        count += parseInt(resObj[resObjKey])
    })
    return count
}


const testCleanedDockingData2 = [
    {
        mask: '000000000000000000000000000000X1001X',
        idx: '42',
        value: '100'
    },
    {
        mask: '00000000000000000000000000000000X0XX',
        idx: '26',
        value: '1'
    },
]

// console.log(calculateResultUpdated(generateValueObjectUpdated(testCleanedDockingData2)))
console.log(calculateResultUpdated(generateValueObjectUpdated(cleanedDockingData)))