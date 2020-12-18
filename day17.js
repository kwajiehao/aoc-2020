// day sixteen 
const fs = require('fs');
const { filter } = require('lodash');
const _ = require('lodash');

const initialState = [
    '#.#.#.##',
    '.####..#',
    '#####.#.',
    '#####..#',
    '#....###',
    '###...##',
    '...#.#.#',
    '#.##..##',
]

const testInitState3By3 = [
    '.#.',
    '..#',
    '###',
]

const testInitState3By3By3 = [
    [
        '#..',
        '..#',
        '.#.',
    ],
    [
        '#.#',
        '.##',
        '.#.',
    ],
    [
        '#..',
        '..#',
        '.#.',
    ],
]

const testGrid = [
    '.....',
    '.###.',
    '.###.',
    '.###.',
    '.....',
]

// part one

const checkValueOfSurroundCoords = (stateContainer, x, y, z) => {
    let activeCount = 0
    for (i = -1; i < 2; i++) {
        for (j = -1; j < 2; j++) {
            for (k = -1; k < 2; k++) {
                if (!(i === 0 & j === 0 & k === 0)) {
                    try {
                        if (stateContainer[z + k][y + j][x + i] === '#') {
                            activeCount++
                        }
                    } catch (err) {
                        // do nothing, index doesn't exist so it's inactive
                    }
                }
            }
        }
    }

    return activeCount
}
// console.log(checkValueOfSurroundCoords([testInitState3By3], 0, 0, 0))
// console.log(checkValueOfSurroundCoords(testInitState3By3By3, 0, 0, 0, 1))

// const cleanseGrid = (grid) => {
//     const gridDim = grid[0].length
//     let inactiveCount = 0
//     for (i = 0; i < gridDim; i++) {
//         for (j = 0; j < gridDim; j++) {
//             // edges
//             if (
//                 i === 0 && j === 0 
//                 || i === 0 && j === gridDim - 1 
//                 || i === gridDim - 1 && j === 0 
//                 || i === gridDim - 1 && j === gridDim - 1
//             ) {
//                 if (grid[i][j] === '.') inactiveCount++
//             } else if (i === 0) {
//                 if (grid[i][j] === '.') inactiveCount++
//             } else if (i === gridDim - 1) {
//                 if (grid[i][j] === '.') inactiveCount++
//             } else if (j === 0) {
//                 if (grid[i][j] === '.') inactiveCount++
//             } else if (j === gridDim - 1) {
//                 if (grid[i][j] === '.') inactiveCount++
//             }
//         }
//     }

//     if (inactiveCount === (gridDim * 4) - 4) {
//         return grid.map((row, idx) => {
//             if (idx === 0 || idx === grid.length - 1) return ''
//             return row.slice(1, gridDim - 1)
//         }).filter(row => row !== '')
//     }
//     return grid
// }

const generateInactiveGrid = (dim) => {
    const inactiveGrid = []
    for (i = 0; i < dim; i++) {
        inactiveGrid.push('.'.repeat(dim))
    }
    return inactiveGrid
}
// console.log(generateInactiveGrid(5))

const augmentGrid = (grid) => {
    const gridDim = grid[0].length
    const sideAugmentedGrid = grid.map(row => '.' + row + '.')
    // return ['.'.repeat(gridDim + 2), ...sideAugmentedGrid, '.'.repeat(gridDim + 2)]
    return ['.'.repeat(gridDim + 2), '.'.repeat(gridDim + 2), ...sideAugmentedGrid, '.'.repeat(gridDim + 2), '.'.repeat(gridDim + 2)]
}
// console.log(testInitState3By3)
// console.log(augmentGrid(testInitState3By3))

const filterGrid = (grid) => {
    const gridDim = grid[0].length
    let containsActive = false
    for (i = 0; i < gridDim; i++) {
        for (j = 0; j < gridDim; j++) {
            try {
                if (!containsActive && grid[i][j] === '#') containsActive = true 
            } catch (err) {
                console.log(grid, i, j)
            }
        }
    }
    return containsActive
}
// console.log(filterGrid(['...', '...', '...']))
// console.log(filterGrid(['...', '.#.', '...']))

const getNewGrid = (grid, zValue, zValueOffset, stateContainer) => {
    let newGrid = []
    const gridLength = grid.length
    const idxOffset = Math.floor(gridLength / 2)
    for (gridY = 0 - idxOffset; gridY < gridLength - idxOffset; gridY++) {
        let row = ''
        for (gridX = 0 - idxOffset; gridX < gridLength - idxOffset; gridX++) {      
            const activeCount = checkValueOfSurroundCoords(stateContainer, gridX + idxOffset, gridY + idxOffset, zValue + zValueOffset)

            const currentPointValue = stateContainer[zValue + zValueOffset][gridY + idxOffset][gridX + idxOffset]
            // console.log(zValue + zValueOffset, gridY + idxOffset, gridX + idxOffset, currentPointValue, activeCount)      

            if (currentPointValue === '.') {
                if (activeCount === 3) {
                    row += '#'
                } else {
                    row += '.'
                }
            }

            if (currentPointValue === '#') {
                if (activeCount === 2 || activeCount === 3) {
                    row += '#'
                } else {
                    row += '.'
                }
            }
        }
        // console.log(row, zValue + zValueOffset, gridY + idxOffset)
        newGrid.push(row)
    }
    return newGrid
}

const calculateState = (initialState, numRounds) => {
    let stateContainer = [initialState]
    for (round = 0; round < numRounds; round++) {
        console.log('round ', round)
        // augment state container
        const gridDim = stateContainer[0].length
        let tmpStateContainer = [augmentGrid(generateInactiveGrid(gridDim)), ...(stateContainer.map(grid => augmentGrid(grid))), augmentGrid(generateInactiveGrid(gridDim))]
        const augmentedStateContainer = [augmentGrid(generateInactiveGrid(gridDim)), ...(stateContainer.map(grid => augmentGrid(grid))), augmentGrid(generateInactiveGrid(gridDim))]
        // console.log(augmentedStateContainer)

        // metadata
        const maxZValue = augmentedStateContainer.length
        const zValueOffset = Math.floor(maxZValue / 2)

        for (idx = 0; idx < augmentedStateContainer.length; idx++) {
            tmpStateContainer[idx] = getNewGrid(augmentedStateContainer[idx], idx - zValueOffset, zValueOffset, augmentedStateContainer)
        }

        // after each round, cleanse the state container, and cleanse the grids in the state container
        // tmpStateContainer = tmpStateContainer.map(grid => cleanseGrid(grid))
        // stateContainer = tmpStateContainer.filter(grid => filterGrid(grid))
        stateContainer = tmpStateContainer
    }
    return stateContainer.filter(grid => filterGrid(grid))
}

const calculateActive = (finalState) => {
    let activeCount = 0;
    finalState.forEach(grid => {
        grid.forEach(row => {
            for (i = 0; i < row.length; i++) {
                if (row[i] === '#') activeCount += 1
            }
        })
    })
    return activeCount
}

// const finalState = calculateState(testInitState3By3, 6)
// const finalState = calculateState(initialState, 6)
// console.log(calculateActive(finalState))

// part two

const checkValueOfSurroundCoords4d = (stateContainer, x, y, z, a) => {
    let activeCount = 0
    for (i = -1; i < 2; i++) {
        for (j = -1; j < 2; j++) {
            for (k = -1; k < 2; k++) {
                for (l = -1; l < 2; l++) {
                    if (!(i === 0 & j === 0 & k === 0 && l === 0)) {
                        try {
                            if (stateContainer[a + l][z + k][y + j][x + i] === '#') {
                                activeCount++
                            }
                        } catch (err) {
                            // do nothing, index doesn't exist so it's inactive
                        }
                    }
                }
            }
        }
    }

    return activeCount
}
// console.log(checkValueOfSurroundCoords4d([[['#..', '..#', '.#.'], ['#..', '..#', '.#.'], ['#..', '..#', '.#.']], [['#..', '..#', '.#.'], ['#.#', '.##', '.#.'], ['#..', '..#', '.#.']], [['#..', '..#', '.#.'], ['#..', '..#', '.#.'], ['#..', '..#', '.#.']]], 1,1,1,1))

const generateInactive3dGrid = (dim) => {
    const inactiveGrid = []
    for (i = 0; i < dim; i++) {
        let tmpGrid = []
        for (j = 0; j < dim; j++) {
            tmpGrid.push('.'.repeat(dim))
        }
        inactiveGrid.push(tmpGrid)
    }
    return inactiveGrid
}
// console.log(generateInactive3dGrid(4))

const generateInactiveGridXY = (dimX, dimY) => {
    const inactiveGrid = []
    for (i = 0; i < dimY; i++) {
        inactiveGrid.push('.'.repeat(dimX))
    }
    return inactiveGrid
}

const augmentGrid3d = (grid3d) => {
    const gridDim = grid3d[0][0].length
    const augmentedGrid = grid3d.map(grid => {
        const sideAugmentedGrid = grid.map(row => '.' + row + '.')
        return ['.'.repeat(gridDim + 2), ...sideAugmentedGrid, '.'.repeat(gridDim + 2)]
    })
    return [generateInactiveGridXY(gridDim + 2, gridDim + 2), generateInactiveGridXY(gridDim + 2, gridDim + 2), ...augmentedGrid, generateInactiveGridXY(gridDim + 2, gridDim + 2), generateInactiveGridXY(gridDim + 2, gridDim + 2)]
}

// console.log(generateInactive3dGrid(4))
// console.log(augmentGrid3d(generateInactive3dGrid(4)))

const filterGrid3d = (grid3d) => {
    const rowLength = grid3d[0][0].length
    let containsActive = false

    grid3d.forEach(grid => {
        grid.forEach(row => {
            for (i = 0; i < rowLength; i++) {
                if (!containsActive && row[i] === '#') containsActive = true 
            }
        })
    })

    return containsActive
}
// const testEmptyGrid = generateInactive3dGrid(4)
// testEmptyGrid[0][0] = '...#'
// console.log(filterGrid3d(testEmptyGrid))

const getNewGrid3d = (grid3d, aValue, stateContainer) => {
    let newGrid3d = []

    const grid3dLength = grid3d.length
    const zIdxOffset = Math.floor(grid3dLength / 2)
    console.log(aValue)
    for (gridZ = 0 - zIdxOffset; gridZ < grid3dLength - zIdxOffset; gridZ++) {
        const gridLength = grid3d[gridZ + zIdxOffset].length
        const idxOffset = Math.floor(gridLength / 2)
        let tmpGrid = []

        for (gridY = 0 - idxOffset; gridY < gridLength - idxOffset; gridY++) {
            let row = ''
            for (gridX = 0 - idxOffset; gridX < gridLength - idxOffset; gridX++) {      
                const activeCount = checkValueOfSurroundCoords4d(stateContainer, gridX + idxOffset, gridY + idxOffset, gridZ + zIdxOffset, aValue)
    
                const currentPointValue = stateContainer[aValue][gridZ + zIdxOffset][gridY + idxOffset][gridX + idxOffset]
    
                if (currentPointValue === '.') {
                    if (activeCount === 3) {
                        row += '#'
                    } else {
                        row += '.'
                    }
                }
    
                if (currentPointValue === '#') {
                    if (activeCount === 2 || activeCount === 3) {
                        row += '#'
                    } else {
                        row += '.'
                    }
                }
            }
            // console.log(row, zValue + zValueOffset, gridY + idxOffset)
            tmpGrid.push(row)
        }
        newGrid3d.push(tmpGrid)
    }

    return newGrid3d
}




const calculateState4d = (initialState, numRounds) => {
    let stateContainer = [[initialState]]
    for (round = 0; round < numRounds; round++) {
        console.log('round ', round)
        // augment state container
        const gridDim = stateContainer[0][0].length
        let tmpStateContainer = [augmentGrid3d(generateInactive3dGrid(gridDim)), ...(stateContainer.map(grid3d => augmentGrid3d(grid3d))), augmentGrid3d(generateInactive3dGrid(gridDim))]
        const augmentedStateContainer = [augmentGrid3d(generateInactive3dGrid(gridDim)), ...(stateContainer.map(grid3d => augmentGrid3d(grid3d))), augmentGrid3d(generateInactive3dGrid(gridDim))]

        for (idx = 0; idx < augmentedStateContainer.length; idx++) {
            tmpStateContainer[idx] = getNewGrid3d(augmentedStateContainer[idx], idx, augmentedStateContainer)
        }

        // after each round, cleanse the state container, and cleanse the grids in the state container
        stateContainer = tmpStateContainer.filter(grid => filterGrid3d(grid))
        stateContainer = tmpStateContainer
    }
    return stateContainer.filter(grid => filterGrid3d(grid))
}

const calculateActive4d = (finalState) => {
    let activeCount = 0;
    finalState.forEach(grid3d => {
        grid3d.forEach(grid => { 
            grid.forEach(row => {
                for (i = 0; i < row.length; i++) {
                    if (row[i] === '#') activeCount += 1
                }
            })
        })
    })
    return activeCount
}


// console.log(testInitState3By3)
// console.log(calculateActive4d(calculateState3d(testInitState3By3, 6)))

const finalState = calculateState4d(initialState, 6)
console.log(calculateActive4d(finalState))