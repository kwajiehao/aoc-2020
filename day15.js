// day fifteen 

const startingNumbers = [1,0,15,2,10,13]
const generateTrackingObject = (startingNumbers) => {
    const trackingObj = {}

    startingNumbers.forEach((num, idx) => {
        trackingObj[num] = idx
    })

    return trackingObj
}
// const trackingObj = generateTrackingObject(startingNumbers)
// console.log(trackingObj)

// part one

// assumption: each starting number only appears once in the starting number set
const trackNumberPositions = (startingNumbers, targetNum) => {
    const numOfStartingNumbers = startingNumbers.length
    const numberList = [...startingNumbers]
    const trackingObj = generateTrackingObject(startingNumbers)

    let lastNumber = numberList[numberList.length - 1]
    // console.log(startingNumbers)

    for (i = numOfStartingNumbers - 1; i < targetNum - 1; i++) {
        if (i % 1000000 === 0) console.log(i)

        let nextNumber

        // console.log(lastNumber, numberList, trackingObj)
        // console.log(lastNumber)

        if (i === numOfStartingNumbers - 1) {
            nextNumber = 0
            lastNumber = nextNumber

        } else {
            nextNumber = (trackingObj[lastNumber] || trackingObj[lastNumber] === 0) ? i - trackingObj[lastNumber] : 0
            trackingObj[lastNumber] = i 
            lastNumber = nextNumber

        }

    }

    return {
        lastNumber,
        trackingObj,
    }
}
// const { lastNumber, trackingObj } = trackNumberPositions([2,1,3], 2020)
// console.log(numberList, trackingObj)
// console.log(lastNumber)
// const { lastNumber } = trackNumberPositions(startingNumbers, 2020)
const { lastNumber } = trackNumberPositions(startingNumbers, 30000000)
console.log(lastNumber)