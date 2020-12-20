// day nineteen 

const fs = require('fs');
const _ = require('lodash');

let messageData
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day19Input.txt', 'utf8')
    messageData = data
        .toString()
        .split('\n')
        // .filter(elem => {
        //     if (elem) return true
        // })
} catch(e) {
    console.log('Error:', e.stack)
}

// part one

const getRulesAndMessages = (messageData) => {
    let breakIdx
    messageData.some((elem, idx) => {
        if (elem === '') {
            breakIdx = idx
            return true
        }
    })
    const rules = messageData.slice(0, breakIdx)
    const messages = messageData.slice(breakIdx + 1).filter(elem => {
        if (elem) return true
    })
    
    const rulesObj = {}
    rules.forEach((rule) => {
        const [ruleKey, ruleContent] = rule.split(': ')
        rulesObj[ruleKey] = ruleContent.replace(/"/g, '')
    })

    return {
        rules,
        messages,
        rulesObj,
    }
}

// const {
//     rules,
//     messages,
//     rulesObj,
// } = getRulesAndMessages(messageData)

const {
    rules: testRules,
    messages: testMessages,
    rulesObj: testRulesObj,
} = getRulesAndMessages([
    '0: 4 1 5',
    '1: 2 3 | 3 2',
    '2: 4 4 | 5 5',
    '3: 4 5 | 5 4',
    '4: "a"',
    '5: "b"',
    '',
    'ababbb',
    'bababa',
    'abbbab',
    'aaabbb',
    'aaaabbb',
])

// console.log(testRules)
// console.log(testMessages)
// console.log(testRulesObj)

const buildPossibleValues = (rulesObj) => {
    // first, find the root values
    const valueLookupObj = {}
    const ruleKeys = Object.keys(rulesObj)
    ruleKeys.forEach(key => {
        const ruleStr = rulesObj[key]
        const flattenedRuleStrArr = ruleStr.split(' | ')
        const rootCheck = flattenedRuleStrArr[0].split(' ')
        if (flattenedRuleStrArr.length === 1 && rootCheck.length === 1 && !parseInt(rootCheck[0])) {
            valueLookupObj[key] = [rulesObj[key]]
        }
    })

    // next, for each rule, replace values if all numbers are found in valueLookupObj
    const rootKeys = Object.keys(valueLookupObj)
    let remainingKeys = ruleKeys.filter(key => !rootKeys.includes(key))

    // while there are still keys left to check in the array, keep iterating
    while (remainingKeys.length > 0) {
        for (var idx = 0; idx < remainingKeys.length; idx++) {
            const key = remainingKeys[idx]
            const ruleStr = rulesObj[key]
            const flattenedRuleStrArr = ruleStr.split(' | ')
    
            let shouldReplaceWithLookup = true
            for (var i = 0; i < flattenedRuleStrArr.length; i++) {
                const indivRuleStr = flattenedRuleStrArr[i].split(' ')
                indivRuleStr.forEach(num => {
                    if (shouldReplaceWithLookup) {
                        if (!valueLookupObj[num]) shouldReplaceWithLookup = false
                    }
                })
            }
    
            // only proceed if all numbers are known
            if (shouldReplaceWithLookup) {
                const replacedValues = flattenedRuleStrArr.map(flattenedRule => {
                    const result = flattenedRule.split(' ').reduce((acc, curr, idx) => {
                        const newAcc = []
                        acc.forEach(substring => {
                            valueLookupObj[curr].forEach(value => {
                                newAcc.push(substring + value)
                            })
                        })
                        acc = newAcc
                        return acc
                    }, [''])
                    return result
                })

                // console.log('calculated key', key)
                valueLookupObj[key] =  _.flattenDeep(replacedValues)
    
                // remove from remaining keys
                remainingKeys[idx] = ''
            }
        }

        // prune remaining keys
        remainingKeys = remainingKeys.filter(elem => elem !== '')
    }

    return valueLookupObj
}

const invertPossibleValues = (lookupObj) => {
    const inverseLookup = {}

    Object.keys(lookupObj).forEach(key => {
        lookupObj[key].forEach(value => {
            inverseLookup[value] = key
        })
    })

    return inverseLookup
}

const calculateNumValidMessages = (messages, inverseLookupObj) => {
    let validCount = 0

    messages.forEach(message => {
        if (inverseLookupObj[message]) {
            console.log(message)
            validCount++
        }
    })

    return validCount
}

// const testLookupObj = buildPossibleValues(testRulesObj)
// const testInverseLookup = invertPossibleValues(testLookupObj)
// console.log(calculateNumValidMessages(testMessages, testInverseLookup))

// const lookupObj = buildPossibleValues(rulesObj)
// const inverseLookup = invertPossibleValues(lookupObj)
// console.log(calculateNumValidMessages(messages, inverseLookup))

// part two 

// fix rules onject
// rulesObj['8'] = '42 | 42 8'
// rulesObj['11'] = '42 31 | 42 11 31'
// console.log(rulesObj)

let part2MessageData
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day19Part2TestInput.txt', 'utf8')
    part2MessageData = data
        .toString()
        .split('\n')
        // .filter(elem => {
        //     if (elem) return true
        // })
} catch(e) {
    console.log('Error:', e.stack)
}

// test run 

const {
    rules: part2TestRules,
    messages: part2TestMessages,
    rulesObj: part2TestRulesObj,
} = getRulesAndMessages(part2MessageData)

// delete problematic values
delete part2TestRulesObj['0']
delete part2TestRulesObj['8']
delete part2TestRulesObj['11']
// console.log(part2TestRulesObj)

const part2TestLookupObj = buildPossibleValues(part2TestRulesObj)
const part2TestInverseLookup = invertPossibleValues(part2TestLookupObj)
console.log(part2TestLookupObj['42'].sort(function (a, b) {return a.localeCompare(b)}))
console.log(part2TestLookupObj['31'].sort(function (a, b) {return a.localeCompare(b)}))

// actual run
const {
    rules,
    messages,
    rulesObj,
} = getRulesAndMessages(messageData)

delete rulesObj['0']
delete rulesObj['8']
delete rulesObj['11']

const lookupObj = buildPossibleValues(rulesObj)
const inverseLookupObj = invertPossibleValues(lookupObj)


// abbbb babbb aaaab abbaa bbbba babab bbabb bbbba baaaa
// 42     42      42   31    42    

// 0: 8 11 => repeat 42, then repeat 42, 31
// 8: 42 | 42 8 => 42, 42 42, 42 42 42, etc.
// 11: 42 31 | 42 11 31 => 42 31, 42 42 31 31, 42 42 11 31 31, 42 42 42 11 31 31 31

// console.log(part2TestLookupObj['42'].reduce((acc, curr, idx) => {
//     if (idx === 0) acc = curr
//     if (idx > 0) acc += `|${curr}`
//     return acc
// }, ''))

const rule0Calculator = (lookupObj, evalStr) => {
    const rule31 = lookupObj['31']
    const rule31ValueLength = rule31[0].length 
    const rule42 = lookupObj['42']
    const rule42ValueLength = rule42[0].length
    const evalStrLength = evalStr.length

    let isOnFirstRule = true
    let currentIdx = 0
    let rule31Count = 0
    let rule42Count = 0
    while (currentIdx < evalStrLength) {
        if (isOnFirstRule) {
            const currSubstring = evalStr.slice(currentIdx, currentIdx + rule42ValueLength)

            if (rule42.includes(currSubstring)) {
                rule42Count++
                currentIdx += rule42ValueLength

            } else {
                // cannot start with anything other than rule 42
                if (rule42Count === 0) {
                    rule31Count = 0
                    rule42Count = 0
                    break
                } else {
                    // transition from rule 42 to rule 31
                    const rule31SubstringTest = evalStr.slice(currentIdx, currentIdx + rule31ValueLength)

                    if (rule31.includes(rule31SubstringTest)) {
                        rule31Count++
                        currentIdx += rule31ValueLength
                        isOnFirstRule = false

                    // if you start
                    } else {
                        rule31Count = 0
                        rule42Count = 0
                        break 
                    }
                }
            }
        } else {
            const rule31SubstringTest = evalStr.slice(currentIdx, currentIdx + rule31ValueLength)

            if (rule31.includes(rule31SubstringTest)) {
                rule31Count++
                currentIdx += rule31ValueLength

            // if you start
            } else {
                rule31Count = 0
                rule42Count = 0
                break 
            }
        }
    }

    if (rule31Count === 0 || rule42Count === 0) return false
    if (rule42Count > rule31Count) return true
    if (rule42Count <= rule31Count) return false
}  

// console.log(rule0Calculator(part2TestLookupObj, 'abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa'))

const calculateNumValidMessagesUpdated = (messages, lookupObj, inverseLookupObj) => {
    const rule31 = lookupObj['31']
    const rule31ValueLength = rule31[0].length 
    const rule42 = lookupObj['42']
    const rule42ValueLength = rule42[0].length

    const rule31Regex = rule31.reduce((acc, curr, idx) => {
        if (idx === 0) acc = curr
        if (idx > 0) acc += `|${curr}`
        return acc
    }, '')

    const rule42Regex = rule42.reduce((acc, curr, idx) => {
        if (idx === 0) acc = curr
        if (idx > 0) acc += `|${curr}`
        return acc
    }, '')

    const rule8Regex = `^(${rule31Regex})*$`

    let validCount = 0

    messages.forEach((message, idx) => {
        console.log('message', idx)
        if (inverseLookupObj[message]) {
            console.log(message)
            validCount++
        } else {
            if (message % (rule31ValueLength) === 0) {
                const rule8Test = new RegExp(rule8Regex)
                if (rule8Test.test(message)) {
                    console.log(message, 'rule 8')
                    validCount++
                }
            } else if (message % (rule31ValueLength + rule42ValueLength) === 0) {
                let count = 1
                while ((count * (rule31ValueLength + rule42ValueLength))< message.length) {
                    const rule11Regex = `^(${rule42Regex}){count}(${rule31Regex}){count}$`
                    const rule11Test = new RegExp(rule11Regex)
                    if (rule11Test.test(message)) {
                        console.log(message, 'rule 11')
                        validCount++
                    }
                    count++
                }
            } else {
                if (rule0Calculator(lookupObj, message)) {
                    console.log(message, 'rule 0')
                    validCount++
                }
            }
        }
    })

    return validCount
}

// console.log(calculateNumValidMessagesUpdated(part2TestMessages, part2TestLookupObj, part2TestInverseLookup))
console.log(calculateNumValidMessagesUpdated(messages, lookupObj, inverseLookupObj))

