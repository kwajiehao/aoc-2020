// day eighteen 

const fs = require('fs');
const _ = require('lodash');

let puzzleInput
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day18Input.txt', 'utf8')
    puzzleInput = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// console.log(puzzleInput)

// part one - NOTE: this solution is wrong because i stripped spaces - it doesn't work if I use double digit numbers
const evaluateString = (equation, isRoot) => {
    const despacedEquation = isRoot ? '0+' + equation.replace(/ /g, '') : equation.replace(/ /g, '')
    console.log(despacedEquation, 'function call')

    let currentSum = 0
    let isCurrentOperatorPlus = true
    let isInBrackets = false
    let bracketCount = 0
    let subString = ''
    let stringStartsWithBracket = false

    for (var i = 0; i < despacedEquation.length; i++) {
        if (despacedEquation[i] === '(') {
            if (i === 0) stringStartsWithBracket = true
            if (isInBrackets) subString += despacedEquation[i]

            isInBrackets = true
            bracketCount += 1
        } else if (despacedEquation[i] === ')') {
            bracketCount -= 1
            if (bracketCount === 0) {
                isInBrackets = false

                // console.log(currentSum, 'before')

                if (isCurrentOperatorPlus) currentSum += evaluateString(subString, stringStartsWithBracket)
                if (!isCurrentOperatorPlus) currentSum *= evaluateString(subString, stringStartsWithBracket)
                
                // console.log(currentSum, 'after')
                // console.log('')


                // reset 
                stringStartsWithBracket = false
                subString = ''
            } else {
                subString += despacedEquation[i]
            }
        } else if (despacedEquation[i] === '+') {
            if (isInBrackets) {
                subString += despacedEquation[i]
            } else {
                isCurrentOperatorPlus = true
            }
        } else if (despacedEquation[i] === '*') {
            if (isInBrackets) {
                subString += despacedEquation[i]
            } else {
                isCurrentOperatorPlus = false
            }
        } else {

            if (i === 0) currentSum = parseInt(despacedEquation[i])

            if (i > 0) {
                if (isInBrackets) {
                    subString += despacedEquation[i]
                }
                if (!isInBrackets) {
                    if (isCurrentOperatorPlus) currentSum += parseInt(despacedEquation[i])
                    if (!isCurrentOperatorPlus) currentSum *= parseInt(despacedEquation[i])
                }
            }
        }
    }

    return currentSum
}
// console.log(evaluateString('2 * 3 + 4'))
// console.log(evaluateString('2 * 3 + (4 * 5)', true))
// console.log(evaluateString('5 + (8 * 3 + 9 + 3 * 4 * 3)', true))
// console.log(evaluateString('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', true))
// console.log(evaluateString('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', true))


// const results = puzzleInput.map(equation => evaluateString(equation))
// const sum = results.reduce((a, b) => a + b, 0)
// console.log(sum)

// part two
const newEvaluationProcedure = (equation) => {
    let newEquationString = equation.split(' ')
    let isCurrentOperationPlus

    // console.log(newEquationString)
    // assume equation with no brackets - we perform the addition first
    for (var i = 0; i < newEquationString.length; i++) {
        if (i === 0) {
            // do nothing
        } else {
            if (newEquationString[i] === '+') {
                isCurrentOperationPlus = true
                newEquationString[i] = ''
            } else if (newEquationString[i] === '*') {
                isCurrentOperationPlus = false
            } else {
                if (isCurrentOperationPlus) {
                    newEquationString[i] = parseInt(newEquationString[i - 2]) + parseInt(newEquationString[i])
                    newEquationString[i - 2] = ''
                }
            }

            // console.log(newEquationString, i, newEquationString[i])
        }
    }
    return newEquationString.filter(elem => elem !== '' && elem !== '*').reduce((a, b) => a * b, 1)
}

// test case: 1 + 2 * 3 + 4 * 5 + 6
// const testEquation = '1 + 2 * 3 + 4 * 5 + 6'
// console.log(newEvaluationProcedure(testEquation))

const evaluateStringUpdated = (equation, isRoot) => {
    const despacedEquation = isRoot ? '0 + ' + equation : equation
    console.log(despacedEquation, 'function call')

    var currentString = ''
    var isInBrackets = false
    var bracketCount = 0
    var subString = ''
    var stringStartsWithBracket = false

    for (var i = 0; i < despacedEquation.length; i++) {
        if (despacedEquation[i] === ' ') {
            if (isInBrackets) {
                subString += ' '
            } else {
                currentString += ' '
            }
        } else if (despacedEquation[i] === '(') {
            if (i === 0) stringStartsWithBracket = true
            if (isInBrackets) subString += despacedEquation[i]

            isInBrackets = true
            bracketCount += 1
        } else if (despacedEquation[i] === ')') {
            bracketCount -= 1
            if (bracketCount === 0) {
                isInBrackets = false

                currentString += evaluateStringUpdated(subString, stringStartsWithBracket)

                // reset 
                stringStartsWithBracket = false
                subString = ''
            } else {
                subString += despacedEquation[i]
            }
        } else if (despacedEquation[i] === '+') {
            if (isInBrackets) {
                subString += despacedEquation[i]
            } else {
                currentString += despacedEquation[i]            
            }
        } else if (despacedEquation[i] === '*') {
            if (isInBrackets) {
                subString += despacedEquation[i]
            } else {
                currentString += despacedEquation[i]
            }
        } else {
            if (i === 0) currentString += despacedEquation[i]

            if (i > 0) {
                if (isInBrackets) {
                    subString += despacedEquation[i]
                }
                if (!isInBrackets) {
                    currentString += despacedEquation[i]
                }
            }
        }
    }

    return newEvaluationProcedure(currentString)
}

// console.log(evaluateStringUpdated('1 + (23 * 3)', true))
// console.log(evaluateStringUpdated('1 + (2 * 3) + (4 * (5 + 6))', true))
// console.log(evaluateStringUpdated('2 * 3 + (4 * 5)', true))
// console.log(evaluateStringUpdated('5 + (8 * 3 + 9 + 3 * 4 * 3)', true))
// console.log(evaluateStringUpdated('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', true))
// console.log(evaluateStringUpdated('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', true))

const results = puzzleInput.map(equation => evaluateStringUpdated(equation))
const sum = results.reduce((a, b) => a + b, 0)
console.log(sum)