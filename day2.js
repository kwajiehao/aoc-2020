// Day two

const fs = require('fs');

let passwordListArr
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/inputDayTwo.txt', 'utf8')
    passwordListArr = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

// Part one

const retrievePwdPolicy = (row) => {
    const pwdRowArr = row.split(': ')

    const password = pwdRowArr[1]

    const pwdPolicyArr = pwdRowArr[0].split(' ')
    const policyChar = pwdPolicyArr[1]
    const policyCharFreqArr = pwdPolicyArr[0].split('-')
    
    const policyCharFreqUpper = policyCharFreqArr[1]
    const policyCharFreqLower = policyCharFreqArr[0]

    return {
        password,
        policyChar,
        policyCharFreqLower,
        policyCharFreqUpper,
    }
}

const countChar = (string, char) => {
    let charCount = 0
    for (i = 0; i < string.length; i++) {
        if (string[i] === char) charCount++
    }
    return charCount
}

const isValidPwd = (charCount, policyCharFreqLower, policyCharFreqUpper) => {
    if (charCount >= policyCharFreqLower && charCount <= policyCharFreqUpper) return true
    return false
}

const calculateNumValidPwds = (passwordListArr) => {
    let validPwdCount = 0
    passwordListArr.forEach(elem => {
        const {
            password,
            policyChar,
            policyCharFreqLower,
            policyCharFreqUpper,
        } = retrievePwdPolicy(elem)

        const charCount = countChar(password, policyChar)
        if (isValidPwd(charCount, policyCharFreqLower, policyCharFreqUpper)) validPwdCount++
    })
    return validPwdCount
}

const validPwdCount = calculateNumValidPwds(passwordListArr)
console.log(validPwdCount)

// Part two

const isValidPwdNew = (password, policyChar, policyCharCheckOne, policyCharCheckTwo) => {
    const firstCharCheck = password[parseInt(policyCharCheckOne) - 1]
    const secondCharCheck = password[parseInt(policyCharCheckTwo) - 1]

    if (firstCharCheck === policyChar) {
        if (secondCharCheck === policyChar) return false
        if (secondCharCheck !== policyChar) return true
    }
    
    if (firstCharCheck !== policyChar) {
        if (secondCharCheck === policyChar) return true
        if (secondCharCheck !== policyChar) return false
    }
}

const calculateNumValidPwdsNew = (passwordListArr) => {
    let validPwdCount = 0
    passwordListArr.forEach(elem => {
        const {
            password,
            policyChar,
            policyCharFreqLower: policyCharCheckOne,
            policyCharFreqUpper: policyCharCheckTwo,
        } = retrievePwdPolicy(elem)

        if (isValidPwdNew(password, policyChar, policyCharCheckOne, policyCharCheckTwo)) {
            validPwdCount++
        }
    })

    return validPwdCount
}

const validPwdCount = calculateNumValidPwdsNew(passwordListArr)
console.log(validPwdCount)