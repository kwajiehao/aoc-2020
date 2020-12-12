// Day seven

const fs = require('fs');

let bagRules
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day7Input.txt', 'utf8')
    bagRules = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// console.log(bagRules)

// part one
const extractRule = (ruleStr) => {
    const ruleStrArr = ruleStr.split(' bags contain ')
    const ruleColor = ruleStrArr[0]

    // Account for root case
    if (ruleStr.includes('contain no other bags')) return {
        ruleColor,
        ruleConditions: [],
    }

    const ruleConditionsStr = ruleStrArr[1]

    const ruleConditions = ruleConditionsStr
        .split(',')
        .filter(Boolean)
        .map((ruleCond) => {
            // console.log(ruleCond)
            const ruleCondArr = ruleCond
                .trim()
                .split(' ')
            const quantity = ruleCondArr[0]
            const color = ruleCondArr
                .slice(1)
                .join(' ')
                .replace(/bag[s]?/g, '')
                .replace(/\./g, '')
                .trim()
            return {
                color,
                quantity,
            }
        })
    return {
        ruleColor,
        ruleConditions,
    }
}
// console.log(extractRule(bagRules[0]))
// console.log(extractRule('dotted black bags contain no other bags.'))
// console.log(extractRule('pale plum bags contain 1 light bronze bag, 5 dotted violet bags, 2 dark salmon bags.'))

const ruleObj = {}

bagRules.forEach((rule) => {
    const { ruleColor, ruleConditions } = extractRule(rule)
    ruleObj[ruleColor] = ruleConditions
})

// console.log(ruleObj)

const calculateBaseRuleColors = (ruleObj) => {
    const baseRuleColors = {}
    Object.keys(ruleObj).map(key => {
        if (ruleObj[key].length === 0) baseRuleColors[key] = true
    })
    return baseRuleColors
}
const baseRuleColors = calculateBaseRuleColors(ruleObj)
console.log(baseRuleColors)

// unoptimized
const checkWhetherBagContainsColoredBag = (color, ruleColor, rulesObj, baseRuleColors, canContainColoredBag, traversedColors) => {
    if (baseRuleColors[ruleColor] || color === ruleColor) return false
    if (canContainColoredBag[ruleColor]) return true

    let containsColoredBag = false

    const ruleConditions = rulesObj[ruleColor]
    // console.log(ruleConditions)
    ruleConditions.forEach((ruleCond, idx) => {
        console.log(idx, ruleColor, ruleCond.color)
        if (ruleCond.color === color && ruleCond.quantity > 0  || canContainColoredBag[ruleCond.color]) {
            // console.log('contains specified color')
            containsColoredBag = true
        } else {
            // do not consider if color is already traversed
            // check for containsColoredBag to ensure we don't overwrite already true result
            if (!containsColoredBag && !traversedColors[ruleCond.color]) {
                // console.log('does not contain specified color')
                traversedColors[ruleCond.color] = true
                containsColoredBag = checkWhetherBagContainsColoredBag(color, ruleCond.color, rulesObj, baseRuleColors, canContainColoredBag, traversedColors)
            }
        }
    })

    return containsColoredBag
}

// does dotted violet contain at least one dotted violet?
// console.log(checkWhetherBagContainsColoredBag('dotted violet', 'dotted violet', ruleObj, baseRuleColors, {}))

// does dark gold contain at least one bright olive?
// console.log(checkWhetherBagContainsColoredBag('bright olive', 'dark gold', ruleObj, baseRuleColors, {}, {}))

let count = 0
Object.keys(ruleObj).forEach((ruleColor) => {
    const res = checkWhetherBagContainsColoredBag('shiny gold', ruleColor, ruleObj, baseRuleColors, {}, {})
    if (res) count++
})
console.log(count)

// part two

const countDependentBags = (color, ruleObj, baseRuleColors) => {
    let count = 1

    // Some bags don't need to contain any bags
    if (baseRuleColors[color]) return count

    const ruleConditions = ruleObj[color]
    // console.log(ruleConditions)

    ruleConditions.forEach((ruleCond, idx) => {
        count += ruleCond.quantity * countDependentBags(ruleCond.color, ruleObj, baseRuleColors)
    })

    return count
}

console.log(countDependentBags('shiny gold', ruleObj, baseRuleColors))

// test cases
const testBaseRuleColors = {
    'dark violet': true
}

const testRuleObj = {
    'shiny gold': [{
        color: 'dark red',
        quantity: 2,
    }], 
    'dark red': [{
        color: 'dark orange',
        quantity: 2,
    }],
    'dark orange': [{
        color: 'dark yellow',
        quantity: 2,
    }],
    'dark yellow': [{
        color: 'dark green',
        quantity: 2,
    }],
    'dark green': [{
        color: 'dark blue',
        quantity: 2,
    }],
    'dark blue': [{
        color: 'dark violet',
        quantity: 2,
    }],
}

console.log(countDependentBags('shiny gold', testRuleObj, testBaseRuleColors))