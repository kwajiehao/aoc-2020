// Day one

const fs = require('fs');

let inputNumbersArr
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/input.txt', 'utf8')
    inputNumbersArr = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// part one

const calculateTwoSum = (inputNumbersArr, sumTarget) => {
    let result
    let firstNum
    let secondNum

    for (i = 0; i < inputNumbersArr.length - 2; i++) {
        for (j = i + 1; j < inputNumbersArr.length - 1; j++) {
            if (parseInt(inputNumbersArr[i]) + parseInt(inputNumbersArr[j]) === sumTarget) {
                // console.log(inputNumbersArr[i], inputNumbersArr[j])
                // console.log(parseInt(inputNumbersArr[i]) * parseInt(inputNumbersArr[j]))
                firstNum = parseInt(inputNumbersArr[i])
                secondNum = parseInt(inputNumbersArr[j])
                result = {
                    firstNum,
                    secondNum,
                }
                break
            }
        }
    }

    return result
}

const twoSum = calculateTwoSum(inputNumbersArr, 2020)
console.log(twoSum)

// part two

const calculateAllSums = (inputNumbersArr) => {
    const result = {}

    for (i = 0; i < inputNumbersArr.length - 2; i++) {
        for (j = i + 1; j < inputNumbersArr.length - 1; j++) {
            result[`${inputNumbersArr[i]},${inputNumbersArr[j]}`] = parseInt(inputNumbersArr[i]) + parseInt(inputNumbersArr[j])
        }
    }
    
    return result
}

const calculateThreeSum = (inputNumbersArr, sumTarget) => {
    let firstNum
    let secondNum
    let thirdNum

    const twoSumDict = calculateAllSums(inputNumbersArr)
    const twoSumDictKeys = Object.keys(twoSumDict)
    
    for (i = 0; i < inputNumbersArr.length - 1; i++) {
        let firstNum = inputNumbersArr[i]
        const target = sumTarget - parseInt(firstNum)
        twoSumDictKeys.forEach((key) => {
            if (target === twoSumDict[key]) {
                [secondNum, thirdNum] = key.split(',')
                console.log(firstNum * secondNum * thirdNum)
            }
        })
    }
}

const test = calculateThreeSum(inputNumbersArr, 2020)
console.log(test)