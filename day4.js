// Day four

const fs = require('fs');

let passportBatchData
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day4Input.txt', 'utf8')
    passportBatchData = data
        .toString()
        .split('\n\n') // data is separated by double new lines
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// Part 1

// Within each data str, data is separated by a mix of new line chars or spaces
const passportDataCleanupFunc = (passportDataStr) => {
    const dataWithoutSpaces = passportDataStr.split(' ')
    const cleanedData = dataWithoutSpaces.reduce((acc, curr) => {
        const fieldsWithoutNewLine = curr.split('\n')
        acc.push(...fieldsWithoutNewLine)
        return acc
    }, [])
    return cleanedData
}

const cleanedPassportBatchData = passportBatchData.map((passportDataStr) => {
    const passportDataObj = {}
    passportDataCleanupFunc(passportDataStr).forEach((passportDataRow) => {
        // data is stored in the format '[field]:[value]' like so 'hcl:#b6652a'
        const [field, value] = passportDataRow.split(':')
        if (field) passportDataObj[field] = value
    })
    return passportDataObj
})

const requiredPassportFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']//, 'cid']
const verifyPassportValidity = (passportDataObj) => {
    let isValidPassport = true

    requiredPassportFields.forEach((passportField) => {
        if (!passportDataObj[passportField]) isValidPassport = false
    })

    return isValidPassport
}

const calculateNumValidPassports = (cleanedPassportBatchData) => {
    let validPassportCount = 0

    cleanedPassportBatchData.forEach((passportDataObj) => {
        if (verifyPassportValidity(passportDataObj) === true) validPassportCount++
    })

    return validPassportCount
}

// test case
const a = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`

const b =  a
    .split('\n\n') // data is separated by double new lines
    .filter(elem => {
        if (elem) return true
    })

const c = b.map((passportDataStr) => {
    const passportDataObj = {}
    const cleanedPassportDataStr =  passportDataCleanupFunc(passportDataStr).forEach((passportDataRow) => {
        // data is stored in the format '[field]:[value]' like so 'hcl:#b6652a'
        const [field, value] = passportDataRow.split(':')
        passportDataObj[field] = value
    })
    
    return verifyPassportValidity(passportDataObj)
})
console.log(c)

console.log(calculateNumValidPassports(cleanedPassportBatchData))

// part two
const validEyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']
const numbersOnlyRegex = /^[0-9]+$/
const hclRegex = /^#[0-9a-f]{6}$/

const verifyPassportValidityUpdated = (passportDataObj) => {
    let isValidPassport = true

    requiredPassportFields.forEach((passportField) => {
        const value = passportDataObj[passportField]
        if (value) {
            switch(passportField) {
                case 'byr':
                    if (value.length !== 4) isValidPassport = false
                    if (parseInt(value) < 1920) isValidPassport = false
                    if (parseInt(value) > 2002) isValidPassport = false
                    break
                case 'iyr':
                    if (value.length !== 4) isValidPassport = false
                    if (parseInt(value) < 2010) isValidPassport = false
                    if (parseInt(value) > 2020) isValidPassport = false
                    break
                case 'eyr':
                    if (value.length !== 4) isValidPassport = false
                    if (parseInt(value) < 2020) isValidPassport = false
                    if (parseInt(value) > 2030) isValidPassport = false
                    break
                case 'hgt': 
                    // check whether cm or in
                    if (value.includes('cm')) {
                        const hgtValue = value.replace('cm', '')
                        if (parseInt(hgtValue) < 150) isValidPassport = false
                        if (parseInt(hgtValue) > 193) isValidPassport = false
                    }
    
                    if (value.includes('in')) {
                        const hgtValue = value.replace('in', '')
                        if (parseInt(hgtValue) < 59) isValidPassport = false
                        if (parseInt(hgtValue) > 76) isValidPassport = false
                    }

                    if (!value.includes('cm') && !value.includes('in')) isValidPassport = false
                    break
                case 'hcl': 
                    const hclMatch = value.match(hclRegex)
                    if (!hclMatch) isValidPassport = false
                    break
                case 'ecl':
                    if (!validEyeColors.includes(value)) isValidPassport = false
                    break
                case 'pid':
                    if (value.length !== 9) isValidPassport = false
                    if (!value.match(numbersOnlyRegex)) isValidPassport = false
                    break
                default:
                    break
            }
        } else {
            if (passportField !== 'cid') isValidPassport = false
        }
    })
    if (isValidPassport) console.log(passportDataObj)
    return isValidPassport
}

const calculateNumValidPassportsUpdated = (cleanedPassportBatchData) => {
    let validPassportCount = 0

    cleanedPassportBatchData.forEach((passportDataObj) => {
        if (verifyPassportValidityUpdated(passportDataObj) === true) validPassportCount++
    })

    return validPassportCount
}
// console.log(cleanedPassportBatchData[cleanedPassportBatchData.length -1])
console.log(calculateNumValidPassportsUpdated(cleanedPassportBatchData))
