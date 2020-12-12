// Day nine

const fs = require('fs');

let numberArr
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day9Input.txt', 'utf8')
    numberArr = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// part one

const verifyNumberSum = (numArr, num) => {
    let result = false
    let firstNum
    let secondNum
    console.log(typeof num)
    for (i = 0; i < numArr.length - 1; i++) {
        for (j = i + 1; j < numArr.length; j++) {
            // console.log(numArr[i], numArr[j])
            // console.log(i, j)
            // console.log(numArr[i] + numArr[j], i, j)
            if (parseInt(numArr[i]) + parseInt(numArr[j]) === parseInt(num)) {
                firstNum = numArr[i]
                secondNum = numArr[j]
                result = true
                return {
                    result,
                    firstNum,
                    secondNum,
                }
            }
        }
    }

    return {
        result,
        firstNum,
        secondNum,
    }
}

const testArr = [35, 20, 15, 25, 47, 40, 62, 55, 65, 95, 102, 117, 150, 182, 127, 219, 299, 277, 309, 576]
// const testArr = [35, 20, 15, 25, 47]
// const testArr = [
//     '30', '20', '2',  '19', '18',
//     '15', '49', '50', '23', '39',
//     '16', '31', '41', '36', '22',
//     '35', '40', '38', '33', '8',
//     '13', '43', '48', '24', '42'
//   ]
// const testNum = 69
// console.log(verifyNumberSum(testArr, testNum))
// console.log(verifyNumberSum([ 20, 15, 25, 47, 72 ], 1))

const arrayChecker = (fullNumArr, increment) => {
    let number
    for (idx = increment; idx < fullNumArr.length; idx++) {
        const { result } = verifyNumberSum(fullNumArr.slice(idx - increment, idx), fullNumArr[idx])
        if (!result) {
            number = fullNumArr[idx]
            return {
                number,
                numArr: fullNumArr.slice(idx - increment, idx),
            }
        }
    }
    return number
}

// const testArr2 = [35, 20, 15, 25, 47, 72, 1, 40]
// console.log(arrayChecker(testArr2, 5))
// console.log(arrayChecker(testArr, 5))
console.log(arrayChecker(numberArr, 25))

// part two

const contiguousArrSearch = (numArr, num) => {
    for (i = 0; i < numArr.length - 1; i++) {
        if (parseInt(numArr[i]) === parseInt(num)) continue

        let sum = parseInt(numArr[i])
        let sumElem = [parseInt(numArr[i])]
        if (sum > parseInt(num)) continue // if number itself is more than the target number
       
        for (j = i + 1; j < numArr.length - 1; j++) {
            if (parseInt(numArr[j]) === parseInt(num)) break

            sum += parseInt(numArr[j])
            sumElem.push(parseInt(numArr[j]))

            if (sum > parseInt(num)) break
            if (sum === parseInt(num)) return {
                sum,
                sumElem,
            }
        }
    }

    return 'no results found'
}

// console.log(contiguousArrSearch(testArr, 127))
const { sumElem } = contiguousArrSearch(numberArr, 1398413738)
console.log(Math.min(...sumElem) + Math.max(...sumElem))