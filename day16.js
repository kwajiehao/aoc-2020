// day sixteen 
const fs = require('fs');
const _ = require('lodash');

let ticketData
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day16Input.txt', 'utf8')
    ticketData = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// console.log(ticketData)

let yourTicketIdx 
let nearbyTicketsIdx

ticketData.forEach((elem, idx) => {
    if (elem === 'your ticket:') yourTicketIdx = idx + 1
    if (elem ===  'nearby tickets:') nearbyTicketsIdx = idx + 1
})

const ticketRules = ticketData.slice(0, yourTicketIdx - 1)
const yourTicket = ticketData.slice(yourTicketIdx, yourTicketIdx + 1)
const nearbyTickets = ticketData.slice(nearbyTicketsIdx)
// console.log(ticketRules, yourTicket, nearbyTickets)

const cleanArray = (numberRanges) => {
    const cleanedNumberRange = _.flattenDeep(numberRanges)
    let newNumberRange = []

    cleanedNumberRange.forEach((num, idx) => {
        if (idx % 2 === 0) {
            newNumberRange.push([num, cleanedNumberRange[idx + 1]])
        }
    })

    return newNumberRange
}

// part one
const calculateNumberRanges = (ticketRules) => {
    let numberRanges = []
    ticketRules.forEach((rule) => {
        const ruleContentArr = rule.split(': ')[1].split(' or ') // sample: 'departure location: 32-174 or 190-967'

        ruleContentArr.forEach(ruleContent => {
            // console.log(ruleContent, numberRanges)

            const [firstNumber, secondNumber] = ruleContent.split('-')
            let lowerNumber = parseInt(firstNumber)
            let upperNumber = parseInt(secondNumber)
            let transcendsOneRange = false
            
            for (i = 0; i < numberRanges.length; i++) {
                const [currUnparsedLowerNumber, currUnparsedUpperNumber] = numberRanges[i]
                const currLowerNumber = parseInt(currUnparsedLowerNumber)
                const currUpperNumber = parseInt(currUnparsedUpperNumber)

                // console.log(i, lowerNumber, upperNumber, currLowerNumber, currUpperNumber)

                // first element
                if (i === 0) {
                    // [10, 20] vs [30, 40] => [[10, 20], [30, 40]]
                    if (upperNumber < currLowerNumber) {
                        // we don't want to mess up the indices
                        numberRanges = [[[lowerNumber, upperNumber], numberRanges[0]], ...numberRanges.slice(1)]
                        break
                    }

                    // [10, 20] vs [20, 30] => [10, 30]
                    if (upperNumber === currLowerNumber) {
                        numberRanges[i] = [lowerNumber, currUpperNumber]
                        break
                    }

                    if (upperNumber > currLowerNumber) {
                        if (upperNumber > currUpperNumber) {
                            // [10, 20] vs [0, 9] => no conflict
                            if (lowerNumber > currUpperNumber) {
                                // do nothing


                                // if i=0 is both the first and last element in numberRanges
                                if (numberRanges.length === 1) {
                                    numberRanges = [...numberRanges, [lowerNumber, upperNumber]]
                                    break
                                }
                            }

                            // [10, 20] vs [0, 10]
                            // [8, 20] vs [0, 10]
                            // [8, 20] vs [9, 10] => pass to next round
                            if (lowerNumber <= currUpperNumber) {
                                lowerNumber = lowerNumber < currLowerNumber ? lowerNumber : currLowerNumber
                                numberRanges[i] = []
                                transcendsOneRange = true
                            }

                            continue
                            
                        // upperNumber <= currUpperNumber
                        } else {
                            // [10, 20] vs [10, 22]
                            if (lowerNumber >= currLowerNumber) {
                                // do nothing
                            }
    
                            // [10, 20] vs [8, 22] => [8, 22]
                            if (lowerNumber < currLowerNumber) {
                                numberRanges[i] = [lowerNumber, currUpperNumber]
                            }

                            break
                        }
                    }
                }

                // in-between elements
                if (i > 0) {
                    // two cases: either transcends one range or it doesn't

                    if (transcendsOneRange) {
                        // console.log('transcend')

                        // [10, 20] into [[0, 12], [30, 40]] => [[], [[0, 20], [30, 40]]]
                        if (upperNumber < currLowerNumber) {
                            numberRanges = [...numberRanges.slice(0, i), [[lowerNumber, upperNumber], numberRanges[i]], ...numberRanges.slice(i+1)]
                            break
                        }

                        // [10, 20] into [[0, 12], [20, 40]] => [[], [0, 40]]
                        if (upperNumber === currLowerNumber) {
                            numberRanges[i] = [lowerNumber, currUpperNumber]
                            break
                        }

                        if (upperNumber > currLowerNumber) {
                            if (upperNumber > currUpperNumber) {
                                // [10, 20] vs [0, 9] => no conflict
                                if (lowerNumber > currUpperNumber) {
                                    // it's impossible to transcend one range and have lowerNumber >= currUpperNumber
                                    // since the act of transcending implies lowerNumber < currLowerNumber
                                }

                                // [10, 20] into [[0, 12], [14, 18]] => [[], [], ...]
                                if (lowerNumber < currUpperNumber) {
                                    // lowerNumber doesn't need to change, since it already transcends one range
                                    numberRanges[i] = []
                                    transcendsOneRange = true
                                }

                                continue
                                
                            // upperNumber <= currUpperNumber
                            } else {

                                if (lowerNumber >= currLowerNumber) {
                                    // this is impossible, since lowerNumber < currLowerNumber is implied by transcending one range
                                }

                                // [10, 20] vs [8, 22] => [8, 22]
                                if (lowerNumber < currLowerNumber) {
                                    numberRanges[i] = [lowerNumber, currUpperNumber]
                                }

                                break
                            }
                        }





                    } else {
                        // console.log('no transcend')

                        // [10, 20] vs [30, 40] => [[10, 20], [30, 40]]
                        if (upperNumber < currLowerNumber) {
                            numberRanges = [...numberRanges.slice(0, i), [[lowerNumber, upperNumber], numberRanges[i]], ...numberRanges.slice(i+1)]
                            break
                        }

                        // [10, 20] vs [20, 30] => [10, 30]
                        if (upperNumber === currLowerNumber) {
                            numberRanges[i] = [lowerNumber, currUpperNumber]
                            break
                        }

                        if (upperNumber > currLowerNumber) {
                            if (upperNumber > currUpperNumber) {
                                // [10, 20] vs [0, 9] => no conflict
                                if (lowerNumber > currUpperNumber) {
                                    // do nothing

                                    if (i === numberRanges.length - 1) {
                                        numberRanges = [...numberRanges, [lowerNumber, upperNumber]]
                                    }
                                }

                                // [10, 20] vs [0, 10]
                                // [8, 20] vs [0, 10] => pass to next round
                                if (lowerNumber <= currUpperNumber) {
                                    lowerNumber = lowerNumber < currLowerNumber ? lowerNumber : currLowerNumber
                                    
                                    if (i === numberRanges.length - 1) {
                                        numberRanges = [...numberRanges.slice(0, i), [lowerNumber, upperNumber]]
                                        break
                                    } else {
                                        numberRanges[i] = []
                                        transcendsOneRange = true
                                    }
                                }

                                continue
                                
                            // upperNumber <= currUpperNumber
                            } else {
                                // [10, 20] vs [10, 22]
                                if (lowerNumber >= currLowerNumber) {
                                    // do nothing

                                    lowerNumber = lowerNumber < currLowerNumber ? lowerNumber : currLowerNumber
                                    if (i === numberRanges.length - 1) {
                                        numberRanges = [...numberRanges.slice(0, i), [lowerNumber, currUpperNumber]]
                                        break
                                    }
                                }
        
                                // [10, 20] vs [8, 22] => [8, 22]
                                if (lowerNumber < currLowerNumber) {
                                    numberRanges[i] = [lowerNumber, currUpperNumber]
                                }

                                break
                            }
                        }
                    }

                }
            }

            if (numberRanges.length === 0) {
                numberRanges.push([lowerNumber, upperNumber])
            }
        })
    })
    return cleanArray(numberRanges)
}

const testRules = [
    'class: 1-3 or 5-7',
    'row: 6-11 or 33-44',
    'seat: 13-40 or 45-50',
]

const testRange = calculateNumberRanges(testRules)
const actualRange = calculateNumberRanges(ticketRules)
const testNearbyTickets = [
    '7,3,47',
    '40,4,50',
    '55,2,20',
    '38,6,12',
]
const testTicketsArr = testNearbyTickets.map(ticket => ticket.split(',').filter(elem => {if (elem) return true}).map(num => parseInt(num)))

const calculateValidityRate = (rangeArray, nearbyTickets) => {
    const invalidNumbers = []

    nearbyTickets.forEach((nearbyTicket) => {
        const ticketNumbers = nearbyTicket.split(',').filter(elem => {if (elem) return true}).map(num => parseInt(num))
        ticketNumbers.forEach((ticketNum) => {
            for (i = 0; i < rangeArray.length; i++) {
                const [lowerNumber, upperNumber] = rangeArray[i]

                if (ticketNum >= lowerNumber && ticketNum <= upperNumber) {
                    break
                }

                if (i === 0) {
                    if (ticketNum < lowerNumber) {
                        invalidNumbers.push(ticketNum)
                        break
                    }

                    if (ticketNum > upperNumber) {
                        if (rangeArray.length === 1) {
                            invalidNumbers.push(ticketNum)
                            break 
                        } else {
                            continue
                        }
                    }

                } else {

                    if (ticketNum < lowerNumber) {
                        invalidNumbers.push(ticketNum)
                        break
                    }

                    if (ticketNum > upperNumber) {
                        // if last rule
                        if (i === rangeArray.length - 1) {
                            invalidNumbers.push(ticketNum)
                            break 
                        } else {
                            continue
                        }
                    }
                }
            }
        })
    })
    return invalidNumbers
}
// console.log(calculateValidityRate(testRange, testNearbyTickets))
// console.log(calculateValidityRate(actualRange, nearbyTickets).reduce((a, b) => a + b, 0))

// part two

const getInvalidTickets = (rangeArray, nearbyTickets) => {
    const invalidTickets = []

    nearbyTickets.forEach((nearbyTicket) => {
        const ticketNumbers = nearbyTicket.split(',').filter(elem => {if (elem) return true}).map(num => parseInt(num))
        ticketNumbers.forEach((ticketNum) => {
            for (i = 0; i < rangeArray.length; i++) {
                const [lowerNumber, upperNumber] = rangeArray[i]

                if (ticketNum >= lowerNumber && ticketNum <= upperNumber) {
                    break
                }

                if (i === 0) {
                    if (ticketNum < lowerNumber) {
                        invalidTickets.push(nearbyTicket)
                        break
                    }

                    if (ticketNum > upperNumber) {
                        if (rangeArray.length === 1) {
                            invalidTickets.push(nearbyTicket)
                            break 
                        } else {
                            continue
                        }
                    }

                } else {

                    if (ticketNum < lowerNumber) {
                        invalidTickets.push(nearbyTicket)
                        break
                    }

                    if (ticketNum > upperNumber) {
                        // if last rule
                        if (i === rangeArray.length - 1) {
                            invalidTickets.push(nearbyTicket)
                            break 
                        } else {
                            continue
                        }
                    }
                }
            }
        })
    })
    return invalidTickets
}

const invalidTickets = getInvalidTickets(actualRange, nearbyTickets)
const validTickets = nearbyTickets.filter(ticket => !invalidTickets.includes(ticket))


const constructTicketRules = (ticketRules) => {
    const rulesObj = {}
    ticketRules.forEach(rule => {
        const [ruleName, ruleValues] = rule.split(': ')
        const ruleValuesArr = ruleValues.split(' or ').map(numRange => {
            const [lowerNumber, upperNumber] = numRange.split('-')
            return [lowerNumber, upperNumber]
        })
        rulesObj[ruleName] = ruleValuesArr
    }) 
    return rulesObj
}

const deduceTicketFields = (ticketRules, ticketsArr) => {
    const ticketRulesObj = constructTicketRules(ticketRules)
    const ticketRulesKeys = Object.keys(ticketRulesObj)
    const numRules = ticketRulesKeys.length
    
    const fieldValuesArr = []
    const numFields = ticketsArr[0].length
    for (i = 0; i < numFields; i++) {
        fieldValuesArr.push(ticketsArr.map(ticket => ticket[i]))
    }

    const trackPossibleValues = {}
    fieldValuesArr.forEach((fieldValues, fieldIdx) => {
        for (i = 0; i < numRules; i++) {
            const fieldName = ticketRulesKeys[i]
            const fieldRules = ticketRulesObj[fieldName]
            let isValid = true

            // console.log(fieldValues, fieldName, fieldRules)

            for (j = 0; j < fieldValues.length; j++) {
                const [lowerNumber1, upperNumber1] = fieldRules[0]
                const [lowerNumber2, upperNumber2] = fieldRules[1]
                const value = fieldValues[j]

                if ((value < lowerNumber1 || value > upperNumber1) && (value < lowerNumber2 || value > upperNumber2)) {
                    // console.log(value, j, fieldName, fieldIdx, fieldRules)
                    isValid = false
                }

                if (!isValid) break
            }

            if (isValid) {
                if (trackPossibleValues[fieldName]) {
                    trackPossibleValues[fieldName].push(fieldIdx)
                } else {
                    trackPossibleValues[fieldName] = [fieldIdx]
                }
            }

            // console.log('isValid =', isValid)
        }
    })

    return trackPossibleValues
}

// test values
const testRules2 = [
    'class: 0-1 or 4-19',
    'row: 0-5 or 8-19',
    'seat: 0-13 or 16-19',
]
const testTickets2 = [
    '3,9,18',
    '15,1,5',
    '5,14,9',
]
const testTickets2Arr = testTickets2.map(ticket => ticket.split(',').filter(elem => {if (elem) return true}).map(num => parseInt(num)))
const testValues = deduceTicketFields(testRules2, testTickets2Arr)

// solution
const validTicketsArr = validTickets.map(ticket => ticket.split(',').filter(elem => {if (elem) return true}).map(num => parseInt(num)))
const possibleValues = deduceTicketFields(ticketRules, validTicketsArr)
// console.log(possibleValues)
// console.log('your ticket is', yourTicketArr)

const parsePossibleValues = (possibleValues) => {
    const copyObj = _.cloneDeep(possibleValues)
    const keys = Object.keys(possibleValues)

    const filteredFields = {}

    let filterValue

    for (j = 0; j < keys.length; j++) {
        for (i = 0; i < keys.length; i++) {

            if (copyObj[keys[i]].length === 1 && !filteredFields[keys[i]]) {
                filterValue = copyObj[keys[i]][0]
                keys.forEach(key => {
                    if (key !== keys[i]) copyObj[key] = copyObj[key].filter(val => val !== filterValue)
                })
                filteredFields[keys[i]] = true


                console.log(copyObj)
                break
            }
        }
    }
}

// console.log(parsePossibleValues(testValues))
console.log(parsePossibleValues(possibleValues)) 

// 'departure location': [ 18 ],
// 'departure station': [ 17 ],
// 'departure platform': [ 10 ],
// 'departure track': [ 19 ],
// 'departure date': [ 6 ],
// 'departure time': [ 7 ],

const yourTicketArr = yourTicket[0].split(',').filter(elem => {if (elem) return true}).map(num => parseInt(num))
console.log(yourTicketArr[18] * yourTicketArr[17] * yourTicketArr[10] * yourTicketArr[19] * yourTicketArr[6] * yourTicketArr[7])