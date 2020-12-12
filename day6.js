// Day six

const fs = require('fs');

let customsData
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day6Input.txt', 'utf8')
    customsData = data
        .toString()
        .split('\n\n') // data is separated by double new lines
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// console.log(customsData)

// part one

const cleanCustomData = (customsData) => {
    return customsData.map((groupData) => {
        return groupData.split('\n')
    })
}

const cleanedCustomData = cleanCustomData(customsData)
// console.log(cleanedCustomData)

const countGroupData = (groupData) => {
    const groupDataStore = {}
    groupData.forEach((indivData) => {
        console.log(indivData)
        for (i = 0; i < indivData.length; i++) {
            if (!groupDataStore[indivData[i]]) groupDataStore[indivData[i]] = true
        }
    })
    return Object.keys(groupDataStore).length
}

const groupDataCount = cleanedCustomData.map((groupData) => countGroupData(groupData))
console.log(groupDataCount.reduce((a, b) => a + b, 0))

console.log([['abc'], ['a','b','c'], ['ab','ac'], ['a','a','a','a'], ['b']].map((groupData) => countGroupData(groupData)))

// part two
const countGroupDataUpdated = (groupData) => {
    const groupDataStore = {}
    groupData.forEach((indivData, idx) => {
        // Check that indiv data is a valid string
        if (indivData) {
            const indivChoices = []
            for (i = 0; i < indivData.length; i++) {
                if (idx === 0) {
                    // add all answers from first individual
                    groupDataStore[indivData[i]] = true
                } else {
                    // if it does not already exist, remove from the list
                    if (!groupDataStore[indivData[i]]) groupDataStore[indivData[i]] = false
                    if (groupDataStore[indivData[i]]) groupDataStore[indivData[i]] = true
                }

                indivChoices.push(indivData[i])
            }

            if (idx > 0) {
                const remainingOptions = Object.keys(groupDataStore)
                    .map((key) => {
                        if (groupDataStore[key]) {
                            return key
                        }
                        return
                    }).filter(Boolean)
                const diff = remainingOptions.filter(x => !indivChoices.includes(x))
                // negate remaining choices which were not selected
                diff.forEach((key) => groupDataStore[key] = false)
            }
        }
    })

    // console.log(groupDataStore)
    
    let commonAnswerCount = 0
    Object.keys(groupDataStore).forEach((key) => {
        if (groupDataStore[key]) commonAnswerCount++
    })

    return commonAnswerCount
}

// console.log(cleanedCustomData[cleanedCustomData.length - 1])
// console.log([['abc'], ['a','b','c'], ['ab','ac'], ['a','a','a','a'], ['b']].map((groupData) => countGroupDataUpdated(groupData)))
const groupDataCount = cleanedCustomData.map((groupData) => countGroupDataUpdated(groupData))
console.log(groupDataCount.reduce((a, b) => a + b, 0))
