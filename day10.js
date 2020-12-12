// Day ten

const fs = require('fs');
const { measureMemory } = require('vm');

let adapterList
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day10Input.txt', 'utf8')
    adapterList = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}


// part one

const countDifferences = (adapterList) => {
    const sortedAdapterList = adapterList.sort((a,b) => a - b)
    // console.log(sortedAdapterList)

    // const deviceJoltage = sortedAdapterList[sortedAdapterList.length - 1] + 3
    // console.log(deviceJoltage) // 1633

    const diffTracker = {}
    for (i = 0; i < sortedAdapterList.length - 1; i++) {
        let diff
        if (i === 0) {
            diff = parseInt(sortedAdapterList[i] - 0)
        } else {
            diff = parseInt(sortedAdapterList[i]) - parseInt(sortedAdapterList[i - 1])
        }
        // console.log(diff)
        if (diffTracker[diff]) {
            diffTracker[diff]++
        } else {
            diffTracker[diff] = 1
        }
    }
    return diffTracker
}

// console.log(countDifferences(adapterList))
const testAdapterList = [16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4]
console.log(countDifferences(testAdapterList))

//  part two

function fillArray(value, len) {
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(value);
    }
    return arr;
  }

const countPermutations = (adapterList) => {
    const sortedAdapterList = adapterList.sort((a,b) => a - b)
    const augmentedSortedAdapterList = [0, ...sortedAdapterList]
    const listLength = augmentedSortedAdapterList.length
    console.log(augmentedSortedAdapterList)

    // initialize memoization for dp
    const memo = fillArray(0, listLength)
    memo[0] = 1

    for (idx = 1; idx < listLength; idx++) {
        if (idx === 1) memo[idx] = 1
        if (idx === 2) {
            if (augmentedSortedAdapterList[2] - 0 <= 3) {
                memo[idx] = 2
            } else {
                memo[idx] = 1
            }
        }
        if (idx > 2) {
            let caseCount = 0
            if (augmentedSortedAdapterList[idx] - augmentedSortedAdapterList[idx - 1] <= 3) {
                caseCount += memo[idx - 1]
            }

            if (augmentedSortedAdapterList[idx] - augmentedSortedAdapterList[idx - 2] <= 3) {
                caseCount += memo[idx - 2]
            }

            if (augmentedSortedAdapterList[idx] - augmentedSortedAdapterList[idx - 3] <= 3) {
                caseCount += memo[idx - 3]
            }

            memo[idx] = caseCount
        }
    }
    return memo[memo.length -1]
}

const miniTestList = [1, 2, 3, 4]
const miniTestList2 = [1, 4, 5, 6, 7]
const testAdapterList2 = [1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31, 32, 33, 34, 35, 38, 39, 42, 45, 46, 47, 48, 49]
const testAdapterList3 = [1, 2, 3, 4, 7, 8, 9, 10, 11, 14]
console.log(countPermutations(adapterList))
