// day twenty 

const fs = require('fs');
const { fill, first } = require('lodash');
const _ = require('lodash');

let tileData
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day20Input.txt', 'utf8')
    tileData = data
        .toString()
        .split('\n')
        // .filter(elem => {
        //     if (elem) return true
        // })
} catch(e) {
    console.log('Error:', e.stack)
}

let testTileData
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day20TestInput.txt', 'utf8')
    testTileData = data
        .toString()
        .split('\n')
        // .filter(elem => {
        //     if (elem) return true
        // })
} catch(e) {
    console.log('Error:', e.stack)
}

// part one - we just need to calculate the edges

// note: rotation does not change the edges
// note: horizontal flips change the vertical edge (reverses them)
// note: vertical flips change the horizontal edges (reverses them)

// therefore, we just need to check for the edges, plus the flipped version of the edges

// example: 2473
const tile2473 = [
    '#....####.',
    '#..#.##...',
    '#.##..#...',
    '######.#.#',
    '.#...#.#.#',
    '.#########',
    '.###.#..#.',
    '########.#',
    '##...##.#.',
    '..###.#.#.',
]

const flipUpsideDown = (grid) => {
    const gridLength = grid.length
    let newGrid = []
    for (var i = 0; i < gridLength; i++) {
        newGrid.push(grid[gridLength - i - 1])
    }
    return newGrid
}

const flipLeftRight = (grid) => {
    const gridLength = grid.length
    let newGrid = []
    for (var i = 0; i < gridLength; i++) {
        newGrid.push(grid[i].split('').reverse().join(''))
    }
    return newGrid
}

function fillArray(value, len) {
    const arr = [];
    for (var i = 0; i < len; i++) {
      arr.push(value);
    }
    return arr;
}

// assuming that all grids are squares
const rotateClockwise = (grid) => {
    const gridLength = grid.length
    let newGrid = []
    for (var i = 0; i < gridLength; i++) {
        newGrid.push(fillArray('', gridLength))
    }

    for (var i = 0; i < gridLength; i++) {
        for (var j = 0; j < gridLength; j++) {
            newGrid[i][j] = grid[gridLength - 1 - j][i]
        }
    }

    return newGrid.map(row => row.join(''))
}

const getTopBorder = (grid) => {
    return grid[0]
}

const getBottomBorder = (grid) => {
    return grid[grid.length - 1]
}

const getRightEdge = (grid) => {
    let rightEdge = ''
    for (var i = 0; i < grid.length; i++) {
        rightEdge += grid[i][grid.length - 1]
    }
    return rightEdge
}

const getLeftEdge = (grid) => {
    let leftEdge = ''
    for (var i = 0; i < grid.length; i++) {
        leftEdge += grid[i][0]
    }
    return leftEdge
}

const reverseStr = (str) => {
    return str.split('').reverse().join('')
}

// console.log(tile2473)
// console.log(getTopBorder(tile2473))
// console.log(getBottomBorder(tile2473))
// console.log(getLeftEdge(tile2473))
// console.log(getRightEdge(tile2473))

// parse tiles
const generateTileOrientationData = (currentTile) => {
    const topEdge = getTopBorder(currentTile)
    const rightEdge = getRightEdge(currentTile)
    const bottomEdge = getBottomBorder(currentTile)
    const leftEdge = getLeftEdge(currentTile)

    return {
        // there are four possible sets of edges
        default: {
            topEdge,
            bottomEdge,
            leftEdge,
            rightEdge,
        },
        flipHorizontal: {
            topEdge: reverseStr(topEdge), 
            bottomEdge: reverseStr(bottomEdge),
            leftEdge: rightEdge,
            rightEdge: leftEdge,
        },

        flipVertical: {
            topEdge: bottomEdge,
            bottomEdge: topEdge,
            leftEdge: reverseStr(leftEdge),
            rightEdge: reverseStr(rightEdge),
        },
        flipBoth: {
            topEdge: reverseStr(bottomEdge),
            bottomEdge: reverseStr(topEdge),
            leftEdge: reverseStr(rightEdge),
            rightEdge: reverseStr(leftEdge),
        }
    }
}

const parseTileData = (tileData) => {
    const tileDataObj = {}
    const tileDataLength = tileData.length

    let currentTileNo
    let currentTile = []
    tileData.forEach((elem) => {
        if (elem.includes('Tile')) {
            currentTileNo = elem.split(' ')[1].replace(':', '')
        } else if (elem === '') {
            tileDataObj[currentTileNo] = generateTileOrientationData(currentTile)
            currentTile = []
        } else {
            currentTile.push(elem)
        }
    })

    if (!tileDataObj[currentTileNo]) tileDataObj[currentTileNo] = generateTileOrientationData(currentTile)

    return tileDataObj
}

const tileDataObj = parseTileData(tileData)
const testTileDataObj = parseTileData(testTileData)
// console.log(testTileDataObj)

// console.log('total number of tiles', Object.keys(tileDataObj).length) // there are 144 tiles, so a 12 x 12 grid

// calculate the expected number of matching edges
// each corner tile has only 2 matching edges
// each regular edge tile has only 3 matching edges
// the rest have 4 matching edges

// const totalMatchingEdges = 100 * 4 + 40 * 3 + 4 *2
// const nonMatchingEdges = 144 * 4 - totalMatchingEdges
// console.log('expected number of matching edges', totalMatchingEdges)
// console.log('number of non matching edges', nonMatchingEdges)

const findCornerTiles = (tileDataObj) => {
    const tileNums = Object.keys(tileDataObj)
    const numOfTiles = tileNums.length
    
    const orientations = ['default', 'flipHorizontal', 'flipVertical', 'flipBoth']

    const cornerTiles = []

    // pairwise search
    for (var i = 0; i < numOfTiles; i++) {
        const currentTileNo = tileNums[i]
        const currentTileData = tileDataObj[currentTileNo]
        // console.log('Comparing tile number', currentTileNo)
    
        let edgeCount = 0
        let edges = []
        for (var j = 0; j < numOfTiles; j++) {
            if (i !== j) {
                const comparisonTileNo = tileNums[j]
                const comparisonTileData = tileDataObj[comparisonTileNo]

                for (var k = 0; k < orientations.length; k++) {
                    const orientation = orientations[k]
                    const comparisonTileEdgeValues = Object.values(comparisonTileData['default'])
                    if (comparisonTileEdgeValues.includes(currentTileData[orientation]['topEdge'])) {
                        // console.log(currentTileNo, comparisonTileNo, orientation, 'includes topEdge')
                        edgeCount++
                        edges.push('topEdge')
                        break
                    }
                    if (comparisonTileEdgeValues.includes(currentTileData[orientation]['bottomEdge'])) {
                        // console.log(currentTileNo, comparisonTileNo, orientation, 'includes bottomEdge')
                        edgeCount++
                        edges.push('bottomEdge')
                        break
                    }
                    if (comparisonTileEdgeValues.includes(currentTileData[orientation]['leftEdge'])) {
                        // console.log(currentTileNo, comparisonTileNo, orientation, 'includes leftEdge')
                        edgeCount++
                        edges.push('leftEdge')
                        break
                    }
                    if (comparisonTileEdgeValues.includes(currentTileData[orientation]['rightEdge'])) {
                        // console.log(currentTileNo, comparisonTileNo, orientation, 'includes rightEdge')
                        edgeCount++
                        edges.push('rightEdge')
                        break
                    }
                }
            }
        }
        if (edgeCount === 2) {
            cornerTiles.push({
                tileNo: currentTileNo,
                filledEdges: edges,
            })
        }
        // console.log(currentTileNo, edgeCount)
    }

    return cornerTiles
}

// console.log(findCornerTiles(testTileDataObj))
// console.log(findCornerTiles(tileDataObj).reduce((a,b) => a * b, 1))
// console.log(findCornerTiles(tileDataObj).reduce((a,b) => a * b, 1))

// part two

const getDetailedTileData = (tileData) => {
    const tileDataObj = {}

    let currentTileNo
    let currentTile = []
    tileData.forEach((elem) => {
        if (elem.includes('Tile')) {
            currentTileNo = elem.split(' ')[1].replace(':', '')
        } else if (elem === '') {
            tileDataObj[currentTileNo] = currentTile
            currentTile = []
        } else {
            currentTile.push(elem)
        }
    })

    if (!tileDataObj[currentTileNo]) tileDataObj[currentTileNo] = currentTile

    return tileDataObj
}

const detailedTestTileData = getDetailedTileData(testTileData)
const detailedTileData = getDetailedTileData(tileData)


const calculateAdjacentTiles = (tileDataObj) => {
    const tileNums = Object.keys(tileDataObj)
    const numOfTiles = tileNums.length
    
    const orientations = ['default', 'flipHorizontal', 'flipVertical', 'flipBoth']

    const cornerTiles = []
    const tiles = {}

    // pairwise search
    for (var i = 0; i < numOfTiles; i++) {
        const currentTileNo = tileNums[i]
        const currentTileData = tileDataObj[currentTileNo]
        // console.log('Comparing tile number', currentTileNo)

        tiles[currentTileNo] = { neighbors: [] }
    
        let edgeCount = 0
        for (var j = 0; j < numOfTiles; j++) {
            if (i !== j) {
                const comparisonTileNo = tileNums[j]
                const comparisonTileData = tileDataObj[comparisonTileNo]

                for (var k = 0; k < orientations.length; k++) {
                    const orientation = orientations[k]
                    const comparisonTileEdgeValues = Object.values(comparisonTileData['default'])
                    if (comparisonTileEdgeValues.includes(currentTileData[orientation]['topEdge'])) {
                        // console.log(currentTileNo, comparisonTileNo, orientation, 'includes topEdge')
                        edgeCount++
                        tiles[currentTileNo].neighbors.push({
                            tileNo: comparisonTileNo,
                            orientation,
                        })
                        break
                    }
                    if (comparisonTileEdgeValues.includes(currentTileData[orientation]['bottomEdge'])) {
                        // console.log(currentTileNo, comparisonTileNo, orientation, 'includes bottomEdge')
                        edgeCount++
                        tiles[currentTileNo].neighbors.push({
                            tileNo: comparisonTileNo,
                            orientation,
                        })
                        break
                    }
                    if (comparisonTileEdgeValues.includes(currentTileData[orientation]['leftEdge'])) {
                        // console.log(currentTileNo, comparisonTileNo, orientation, 'includes leftEdge')
                        edgeCount++
                        tiles[currentTileNo].neighbors.push({
                            tileNo: comparisonTileNo,
                            orientation,
                        })
                        break
                    }
                    if (comparisonTileEdgeValues.includes(currentTileData[orientation]['rightEdge'])) {
                        // console.log(currentTileNo, comparisonTileNo, orientation, 'includes rightEdge')
                        edgeCount++
                        tiles[currentTileNo].neighbors.push({
                            tileNo: comparisonTileNo,
                            orientation,
                        })
                        break
                    }
                }
            }
        }
        if (edgeCount === 2) {
            cornerTiles.push(currentTileNo)
            tiles[currentTileNo] = {
                ...tiles[currentTileNo],
                isCornerTile: true,
                edgeCount,
            }
        }
        // console.log(currentTileNo, edgeCount)
    }

    return tiles
}

const buildMap = (layout) => {
    const tileNums = Object.keys(layout)
    const cornerTiles = tileNums.filter(tileNum => layout[tileNum].isCornerTile)

    // generate neighbors object
    const tileNeighbors = {}
    tileNums.forEach(tileNum => {
        tileNeighbors[tileNum] = layout[tileNum].neighbors
    })

    // construct map
    let tileMap = []
    const gridLength = Math.sqrt(tileNums.length)
    for (var i = 0; i < gridLength; i++) {
        tileMap.push(fillArray('', gridLength))
    }    

    let currentTile
    let nextTile
    const filledTiles = {}
    const startingTile = cornerTiles[0]

    // fill in the map row by row
    for (var i = 0; i < gridLength; i++) {
        for (var j = 0; j < gridLength; j++) {

            // first row
            if (i === 0) {
                // start from the top left corner
                if (j === 0) {
                    // fill in the map
                    tileMap[i][j] = startingTile

                    // record filled tile
                    filledTiles[startingTile] = true

                    // track next tile - just choose the first neighbor you see
                    nextTile = tileNeighbors[startingTile][0].tileNo

                // last tile in the row - set up the next row
                } else if (j === gridLength - 1) {
                    currentTile = nextTile

                    // fill in the map
                    tileMap[i][j] = currentTile

                    // record filled tile
                    filledTiles[currentTile] = true

                    // choose the next tile for the next row
                    const firstTileInRow = tileMap[i][0]
                    for (var k = 0; k < tileNeighbors[firstTileInRow].length; k++) {
                        const { tileNo: neighborTileNo } = tileNeighbors[firstTileInRow][k]

                        // choose the neighbor which has the tile above it as a neighbor and is not a filled tile
                        if (!filledTiles[neighborTileNo]) {
                            nextTile = neighborTileNo
                            break
                        }
                    }
                    

                // use the tile on the left as a reference
                } else if (j > 0) {
                    currentTile = nextTile

                    // fill in the map
                    tileMap[i][j] = currentTile

                    // record filled tile
                    filledTiles[currentTile] = true

                    // choose the next tile
                    for (var k = 0; k < tileNeighbors[currentTile].length; k++) {
                        const { tileNo: neighborTileNo } = tileNeighbors[currentTile][k]

                        // choose the neighbor which has 3 neighbors, except for the second last tile
                        // in the row (for that, choose the one which has a corner tile as a neighbor)
                        if (j === gridLength - 2) {
                            // neigbor is a corner tile and not already filled in
                            if (cornerTiles.includes(neighborTileNo) && !filledTiles[neighborTileNo]) {
                                nextTile = neighborTileNo
                                break
                            }
                        } else {
                            // all tiles on the top edge, which are not corner tiles, have 3 neighbors
                            if (tileNeighbors[neighborTileNo].length === 3 && !filledTiles[neighborTileNo]) {
                                nextTile = neighborTileNo
                                break
                            }   
                        }
                    }

                }
            
            } else {
                
                if (j === 0) {
                    currentTile = nextTile
                
                    // fill in the map
                    tileMap[i][j] = currentTile

                    // record filled tile
                    filledTiles[currentTile] = true

                    // choose the next tile
                    for (var k = 0; k < tileNeighbors[currentTile].length; k++) {
                        const { tileNo: neighborTileNo } = tileNeighbors[currentTile][k]

                        // choose the neighbor which has the tile diagonally above as a neighbor
                        const diagonallyAboveTile = tileMap[i-1][1]
                        const neighborTileNeighbors = tileNeighbors[neighborTileNo].map(tileObj => tileObj.tileNo)

                        if (neighborTileNeighbors.includes(diagonallyAboveTile) && !filledTiles[neighborTileNo]) {
                            nextTile = neighborTileNo
                            // break
                        }
                    }
                    
                } else if (j === gridLength - 1) {
                    currentTile = nextTile

                    // fill in the map
                    tileMap[i][j] = currentTile

                    // record filled tile
                    filledTiles[currentTile] = true

                    // choose the next tile for the next row
                    const firstTileInRow = tileMap[i][0]

                    for (var k = 0; k < tileNeighbors[firstTileInRow].length; k++) {
                        const { tileNo: neighborTileNo } = tileNeighbors[firstTileInRow][k]

                        const neighborTileNeighbors = tileNeighbors[neighborTileNo].map(tileObj => tileObj.tileNo)
                        
                        // choose the neighbor which has the first tile in row as a neighbor and is not a filled tile
                        if (neighborTileNeighbors.includes(firstTileInRow) && !filledTiles[neighborTileNo]) {
                            nextTile = neighborTileNo
                            break
                        }
                    }

                } else {
                    currentTile = nextTile

                    // fill in the map
                    tileMap[i][j] = currentTile

                    // record filled tile
                    filledTiles[currentTile] = true

                    // choose the next tile
                    for (var k = 0; k < tileNeighbors[currentTile].length; k++) {
                        const { tileNo: neighborTileNo } = tileNeighbors[currentTile][k]

                        // tile of diagonally above neighbor
                        const diagonallyAboveTile = tileMap[i-1][j+1]
                        let neighborTileNeighbors = tileNeighbors[neighborTileNo].map(tileObj => tileObj.tileNo)
                        


                        // choose the neighbor which has the diagonally above tile as neighbor, except for the second last tile
                        // in the row (for that, choose the one which has a corner tile as a neighbor)
                        if (neighborTileNeighbors.includes(diagonallyAboveTile) && !filledTiles[neighborTileNo]) {
                            nextTile = neighborTileNo
                            break
                        }
                    }
                }


            }
        }
    }

    // console.log(tileNeighbors, 'after')

    return tileMap
}

const testLayout = calculateAdjacentTiles(testTileDataObj)
const layout = calculateAdjacentTiles(tileDataObj)
const testTileMap = buildMap(testLayout)
const tileMap = buildMap(layout)

const stripBorderFromGrid = (grid) => {
    const gridLength = grid.length
    const strippedGrid = grid.slice(1, gridLength - 1).map(row => {
        return row.slice(1, gridLength - 1)
    })
    return strippedGrid
}

const parseRotationAndFlips = (rotation, flip, map) => {
    let mapToReturn = map

    // if (rotation === 'default') // do nothing
    if (rotation === 'right') {
        mapToReturn = rotateClockwise(mapToReturn)
    }
    if (rotation === 'down') {
        mapToReturn = rotateClockwise(rotateClockwise(mapToReturn))
    }
    if (rotation === 'left') {
        mapToReturn = rotateClockwise(rotateClockwise(rotateClockwise(mapToReturn)))
    }

    // if (flip === 'default') // do nothing
    if (flip === 'flipHorizontal') {
        mapToReturn = flipLeftRight(mapToReturn)
    }
    if (flip === 'flipVertical') {
        mapToReturn = flipUpsideDown(mapToReturn)
    }
    if (flip === 'flipBoth') {
        mapToReturn = flipUpsideDown(flipLeftRight(mapToReturn))
    }

    return mapToReturn
}

const applyFlipDirection = (flip, applyDirection) => {
    let flipDirection
    if (applyDirection === 'vertical') {
        // apply a vertical flip to the current flip direction
        if (flip === 'default') {
            flipDirection = 'flipVertical'
        }

        if (flip === 'flipVertical') {
            flipDirection = 'default'
        }

        if (flip === 'flipHorizontal') {
            flipDirection = 'flipBoth'
        }

        if (flip === 'flipBoth') {
            flipDirection = 'flipHorizontal'
        } 
    }

    if (applyDirection === 'horizontal') {
        // apply a horizontal flip to the current flip direction
        if (flip === 'default') {
            flipDirection = 'flipHorizontal'
        }

        if (flip === 'flipVertical') {
            flipDirection = 'flipBoth'
        }

        if (flip === 'flipHorizontal') {
            flipDirection = 'default'
        }

        if (flip === 'flipBoth') {
            flipDirection = 'flipVertical'
        }
    }

    return flipDirection
}

// finds the corresponding rotation given an edge
const convertEdgeToRotation = (edge, flip, reverseState, matchingEdge) => {
    const edges = ['leftEdge', 'topEdge', 'rightEdge', 'bottomEdge']
    const matchingEdgeIndex = _.findIndex(edges, (elem) => elem === matchingEdge)

    const verticalEdges = ['topEdge', 'bottomEdge']

    let rotation, flipDirection
    
    if (edge === edges[matchingEdgeIndex % 4]) {
        if (reverseState === 'default') {
            // no need to rotate or flip
            rotation = 'default'
            flipDirection = flip
        }

        if (reverseState === 'reverse') {
            rotation = 'default'
            flipDirection =  verticalEdges.includes(matchingEdge) ? applyFlipDirection(flip, 'horizontal') : applyFlipDirection(flip, 'vertical')
        }
    }

    if (edge === edges[(matchingEdgeIndex+1) % 4]) {
        if (reverseState === 'default') {
            rotation = 'left'
            flipDirection = verticalEdges.includes(matchingEdge) ? flip : applyFlipDirection(flip, 'vertical')
        }

        if (reverseState === 'reverse') {
            rotation = 'left'
            flipDirection = verticalEdges.includes(matchingEdge) ? applyFlipDirection(flip, 'horizontal') : flip
        }
    }

    if (edge === edges[(matchingEdgeIndex+2) % 4]) {
        if (reverseState === 'default') {
            // no rotation needed
            rotation = 'default'
            flipDirection = verticalEdges.includes(matchingEdge) ? applyFlipDirection(flip, 'vertical') : applyFlipDirection(flip, 'horizontal')
        }

        if (reverseState === 'reverse') {
            rotation = 'default'
            flipDirection = applyFlipDirection(applyFlipDirection(flip, 'vertical'), 'horizontal')
        }
    }

    if (edge === edges[(matchingEdgeIndex+3) % 4]) {
        if (reverseState === 'default') {
            rotation = 'right'
            flipDirection = verticalEdges.includes(matchingEdge) ? applyFlipDirection(flip, 'horizontal') : flip
        }

        if (reverseState === 'reverse') {
            rotation = 'right'
            flipDirection = verticalEdges.includes(matchingEdge) ? flip : applyFlipDirection(flip, 'vertical')        
        }
    }

    return {
        rotation,
        flipDirection
    }
}

const findTopLeftEdge = (tileDataObj, tileNum, neighborTileNo) => {
    const orientations = ['default', 'flipHorizontal', 'flipVertical', 'flipBoth']
    const edges = ['leftEdge', 'topEdge', 'rightEdge', 'bottomEdge']

    const tileEdgeData = tileDataObj[tileNum]
    const neighboringTileEdgeData = tileDataObj[neighborTileNo]

    let matchingData = {}

    // pairwise comparison - assume that edge matches are unique
    for (var i = 0; i < orientations.length; i++) {
        const orientation = orientations[i]
        const comparisonTileEdgeKeys = Object.keys(tileEdgeData['default'])
        const comparisonTileEdgeValues = Object.values(tileEdgeData['default'])

        if (comparisonTileEdgeValues.includes(neighboringTileEdgeData[orientation]['topEdge'])) {
            // identify the edge which matched with the neighbor
            for (var j = 0; j < comparisonTileEdgeKeys.length; j++) {
                const key = comparisonTileEdgeKeys[j]
                if (tileEdgeData['default'][key] === neighboringTileEdgeData[orientation]['topEdge']) {
                    matchingData.edge = key
                    break
                }
            }

            matchingData.neighborEdge = 'topEdge'
            matchingData.neighborOrientation = orientation
            break
        }
        if (comparisonTileEdgeValues.includes(neighboringTileEdgeData[orientation]['bottomEdge'])) {
            // identify the edge which matched with the neighbor
            for (var j = 0; j < comparisonTileEdgeKeys.length; j++) {
                const key = comparisonTileEdgeKeys[j]
                if (tileEdgeData['default'][key] === neighboringTileEdgeData[orientation]['bottomEdge']) {
                    matchingData.edge = key
                    break
                }
            }

            matchingData.neighborEdge = 'bottomEdge'
            matchingData.neighborOrientation = orientation
            break
        }
        if (comparisonTileEdgeValues.includes(neighboringTileEdgeData[orientation]['leftEdge'])) {
            // identify the edge which matched with the neighbor
            for (var j = 0; j < comparisonTileEdgeKeys.length; j++) {
                const key = comparisonTileEdgeKeys[j]
                if (tileEdgeData['default'][key] === neighboringTileEdgeData[orientation]['leftEdge']) {
                    matchingData.edge = key
                    break
                }
            }
            
            matchingData.neighborEdge = 'leftEdge'
            matchingData.neighborOrientation = orientation
            break
        }
        if (comparisonTileEdgeValues.includes(neighboringTileEdgeData[orientation]['rightEdge'])) {
            // identify the edge which matched with the neighbor
            for (var j = 0; j < comparisonTileEdgeKeys.length; j++) {
                const key = comparisonTileEdgeKeys[j]
                if (tileEdgeData['default'][key] === neighboringTileEdgeData[orientation]['rightEdge']) {
                    matchingData.edge = key
                    break
                }
            }

            matchingData.neighborEdge = 'rightEdge'
            matchingData.neighborOrientation = orientation
            break
        }
    }

    return matchingData
}

const retrieveMapDataFromRotation = (tileDataObj, tileNum, edgeToCompare, targetEdge) => {

    const flips = ['default', 'flipHorizontal', 'flipVertical', 'flipBoth']
    const edges = ['topEdge', 'bottomEdge', 'leftEdge', 'rightEdge']
    const reverseStates = ['default', 'reverse']

    let targetRotation
    let targetFlipDirection

    let foundEdge = false
    for (var k = 0; k < flips.length; k++) {

        if (foundEdge) break
        const flip = flips[k]

        for (var l = 0; l < edges.length; l++) {
            if (foundEdge) break
            const edge = edges[l]

            for (var m = 0; m < reverseStates.length; m++) {
                const reverseState = reverseStates[m]

                let currentEdge =  tileDataObj[tileNum][flip][edge]

                if (reverseState === 'reverse') {
                    currentEdge = reverseStr(currentEdge)
                } 

                if (currentEdge === edgeToCompare) {
                    const { rotation, flipDirection } = convertEdgeToRotation(edge, flip, reverseState, targetEdge)
                    targetRotation = rotation
                    targetFlipDirection = flipDirection

                    foundEdge = true
                    break
                }
            }
        }
    }

    return {
        targetRotation,
        targetFlipDirection,
    }
}


// next - create the actual map. NOTE: THIS CODE IS ERRONEOUS AND DOES NOT CONSTRUCT THE RIGHT MAP
const constructMap = (tileMap, detailedTileData, tileDataObj) => {
    // again, we build from left to right, up to down
    // and again, we assume the map is a square
    const mapDim = tileMap.length

    // construct map
    let detailedMap = []
    for (var i = 0; i < mapDim; i++) {
        detailedMap.push(fillArray('', mapDim))
    }

    // reconstruct map from tile map
    for (var i = 0; i < mapDim; i++) {
        for (var j = 0; j < mapDim; j++) {
            const tileNum = tileMap[i][j]

            // first row
            if (i === 0) {
                if (j == 0) {                    
                    // identify the correct rotation of the starting block, by identifying the two corners which do not have matching edges
                    const rightBlock = tileMap[i][j+1]
                    const bottomBlock = tileMap[i+1][j]

                    const matchingDataRight = findTopLeftEdge(tileDataObj, tileNum, rightBlock)
                    // console.log('rightEdge', matchingDataRight, tileNum, rightBlock)

                    const matchingDataBottom = findTopLeftEdge(tileDataObj, tileNum, bottomBlock)
                    // console.log('bottomEdge', matchingDataBottom, tileNum, bottomBlock)


                    // set the top left corner, and then work around it (let's just hardcode this part, i'm lazy)
                    detailedMap[i][j] = parseRotationAndFlips('default', 'flipVertical', detailedTileData[tileNum])

                } else if (j > 0) {
                    // compare with the right edge of the previous tile
                    const prevRightEdge = getRightEdge(detailedMap[i][j-1])

                    const { targetRotation, targetFlipDirection } = retrieveMapDataFromRotation(tileDataObj, tileNum, prevRightEdge, 'leftEdge')
                    detailedMap[i][j] = parseRotationAndFlips(targetRotation, targetFlipDirection, detailedTileData[tileNum])
                }

            } else if (i > 0) {
                // compare with the tile above
                if (j == 0) {
                    const aboveBottomEdge = getBottomBorder(detailedMap[i-1][j])
                    const { targetRotation, targetFlipDirection } = retrieveMapDataFromRotation(tileDataObj, tileNum, aboveBottomEdge, 'topEdge')

                    detailedMap[i][j] = parseRotationAndFlips(targetRotation, targetFlipDirection, detailedTileData[tileNum])


                } else if (j > 0) {
                    // compare with the right edge of the previous tile
                    const prevRightEdge = getRightEdge(detailedMap[i][j-1])

                    const { targetRotation, targetFlipDirection } = retrieveMapDataFromRotation(tileDataObj, tileNum, prevRightEdge, 'leftEdge')
                    detailedMap[i][j] = parseRotationAndFlips(targetRotation, targetFlipDirection, detailedTileData[tileNum])
                }
            }
        }
    }

    // strip borders from tiles and combine rows
    const strippedMap = detailedMap.map((row) => {
        return row.map((tile) => {
            return stripBorderFromGrid(tile)
        })
    })

    const flattenedMap = strippedMap.map((row) => {
        return row.reduce((acc, curr, idx) => {
            if (idx === 0) {
                acc = curr
            } else {
                acc = acc.map((line, lineIdx) => {
                    return line + curr[lineIdx]
                })
            }
            return acc
        }, [])
    }).reduce((acc, curr) => {
        acc = [...acc, ...curr]
        return acc
    }, [])

    return flattenedMap
}

// console.log(testTileMap)
// console.log(testTileDataObj)
const testMap = constructMap(testTileMap, detailedTestTileData, testTileDataObj)
const map = constructMap(tileMap, detailedTileData, tileDataObj)
console.log(testMap)


// finally - parse the map for the sea monster
const testImage = [
    '.#.#..#.##...#.##..#####',
    '###....#.#....#..#......',
    '##.##.###.#.#..######...',
    '###.#####...#.#####.#..#',
    '##.#....#.##.####...#.##',
    '...########.#....#####.#',
    '....#..#...##..#.#.###..',
    '.####...#..#.....#......',
    '#..#.##..#..###.#.##....',
    '#.####..#.####.#.#.###..',
    '###.#.#...#.######.#..##',
    '#.####....##..########.#',
    '##..##.#...#...#.#.#.#..',
    '...#..#..#.#.##..###.###',
    '.#.#....#.##.#...###.##.',
    '###.#...#..#.##.######..',
    '.#.#.###.##.##.#..#.##..',
    '.####.###.#...###.#..#.#',
    '..#.#..#..#.#.#.####.###',
    '#..####...#.#.#.###.###.',
    '#####..#####...###....##',
    '#.##..#..#...#..####...#',
    '.#.###..##..##..####.##.',
    '...###...##...#...#..###',
]

const countHashes = (map) => {
    let hashCount = 0
    map.forEach(row => {
        for (var i = 0; i < row.length; i++) {
            if (row[i] === '#') {
                hashCount++
            }
        }
    })
    return hashCount
}

// const firstRowPattern = '                  # ' // length 20
// const middleRowPattern = '#    ##    ##    ###' 
// const lastRowPattern = ' #  #  #  #  #  #   '

// first row index to check: 18
// second row index to check: 0, 5, 6, 11, 12, 17, 18, 19
// last row index to check: 1, 4, 7, 10, 13, 16

const parseMap = (map) => {
    const numRows = map.length
    const rowLength = map[0].length

    const firstRowCheck = 18
    const secondRowCheck = [0, 5, 6, 11, 12, 17, 18, 19]
    const thirdRowCheck = [1, 4, 7, 10, 13, 16]

    let seaMonsterCount = 0
    let seaMonsterIdx = []

    const orientations = ['default', 'right', 'down', 'left']
    const flips = ['default', 'flipHorizontal', 'flipVertical', 'flipBoth']

    for (var orientationIdx = 0; orientationIdx < orientations.length; orientationIdx++) {
        if (seaMonsterCount > 0) break
        for (var flipIdx = 0; flipIdx < flips.length; flipIdx++) {
            // flip map
            const orientedMap = parseRotationAndFlips(orientations[orientationIdx], flips[flipIdx], map)

            // execute main logic chunk
            // there are three rows in the pattern
            for (var i = 0; i < (numRows + 1) - 3; i++) {

                //  there are twnety columns in the pattern
                for (var j = 0; j < (rowLength + 1) - 20; j++) {
                    let monsterExists = true

                    // retrieve rows
                    const firstRow = orientedMap[i].slice(j, j + 20)
                    const secondRow = orientedMap[i+1].slice(j, j + 20)
                    const thirdRow = orientedMap[i+2].slice(j, j + 20)

                    // first row check
                    if (firstRow[firstRowCheck] !== '#') {
                        monsterExists = false
                    }

                    // second row check
                    secondRowCheck.forEach(monsterIdx => {
                        if (secondRow[monsterIdx] !== '#') {
                            monsterExists = false
                        }
                    })

                    // third row check
                    thirdRowCheck.forEach(monsterIdx => {
                        if (thirdRow[monsterIdx] !== '#') {
                            monsterExists = false
                        }   
                    })

                    if (monsterExists) {
                        // mutate the existing map
                        
                        // first row
                        orientedMap[i] = orientedMap[i].slice(0, j + firstRowCheck) + 'O' + orientedMap[i].slice(j + firstRowCheck + 1)
                        
                        // second row
                        secondRowCheck.forEach(monsterIdx => {
                            orientedMap[i+1] = orientedMap[i+1].slice(0, j + monsterIdx) + 'O' + orientedMap[i+1].slice(j + monsterIdx + 1)
                        })

                        // third row
                        thirdRowCheck.forEach(monsterIdx => {
                            orientedMap[i+2] = orientedMap[i+2].slice(0, j + monsterIdx) + 'O' + orientedMap[i+2].slice(j + monsterIdx + 1)
                        })

                        let newFirstRow = ''
                        let newSecondRow = ''
                        let newThirdRow = ''
                        for (var rowPos = 0; rowPos < orientedMap[0].length; rowPos++) {
                            // inside dragon
                            if (rowPos >= j && rowPos <= j + 19) {
                                if (orientedMap[i][rowPos] !== 'O') {
                                    newFirstRow += '_'
                                } else {
                                    newFirstRow += orientedMap[i][rowPos]
                                }

                                if (orientedMap[i+1][rowPos] !== 'O') {
                                    newSecondRow += '_'
                                } else {
                                    newSecondRow += orientedMap[i+1][rowPos]
                                }

                                if (orientedMap[i+2][rowPos] !== 'O') {
                                    newThirdRow += '_'
                                } else {
                                    newThirdRow += orientedMap[i+2][rowPos]
                                }

                            } else {
                                newFirstRow += orientedMap[i][rowPos]
                                newSecondRow += orientedMap[i+1][rowPos]
                                newThirdRow += orientedMap[i+2][rowPos]
                            }
                        }
                        orientedMap[i] = newFirstRow
                        orientedMap[i+1] = newSecondRow
                        orientedMap[i+2] = newThirdRow

                        // increment count
                        seaMonsterCount++
                        seaMonsterIdx.push([i, j])

                    }
                }


            }

            if (seaMonsterCount > 0) {
                console.log(orientedMap)
                console.log(orientations[orientationIdx], flips[flipIdx])
                // break
            }


        }
    }

    return {
        seaMonsterCount,
        seaMonsterIdx,
    }
}

// console.log(parseMap(testImage))
// console.log(countHashes(testImage)) // there are 15 hashes per monster
console.log(parseMap(map))
// console.log(countHashes(map))
// console.log(map.length)

// const vincentMap = [
//     '..#......#.#...#..#..........#.##...#..............#...#......#.#......#...#.....#...#.........#',
//     '##.....#....#.#......###.##.......#....#...#...##...#....#..#...#...#.##.......#.#..#..#....##.#',
//     '.......##...#.......#.#.#.#.##...##........#..#...............#...##............#####...........',
//     '.#...##...#.##....#...#..#.#.....###..######.#..#..#........#...#..................#...#...#.#.#',
//     '....#..#....#.#........#.#.....#.##...#..#.....#..................#..#..#......#..##.......#....',
//     '.#..#...#.....................#.#....#.........#..........#...##..#.......#.#........#.#........',
//     '....#.........#..............##..........#..#....#..........#................#.#.....#..#.####..',
//     '.......#.......#...........#...#...#..#.#.............#.#..###.#......#.......###.#...##..#.....',
//     '.............###...#..#...#..#..##....###....##.............##..##.......#...#.##...##..#....#..',
//     '..#.#.....#.#.......#..#....#...##...#....##.#..#..#..#..#....##.....#.#...#...#.#..#....#.#....',
//     '#.....###..##.........#.#.........#...####.##.###.#.##....#.#.......#.###.#..##.#..##..##.#...#.',
//     '#...#.#......#...#....##....##.#.##.#...###....#..#..###.........###..#.###...##....#.#...#.#...',
//     '.###...#........#...#........##.#....#..#........###.....#...#....#.......#.#.......#.....#.#.#.',
//     '.....#..##.....#...##.#......#............####.#.....##..#............##.##.....###.......##....',
//     '..#.#...#..#..##.##.#..#....##.....##.....#...###.........#....#.#...........##..##..#..........',
//     '.....####.#.##..#.##..#.###...#.##....#..##.#.#..#.#...............#.#.....#...#...##..#.......#',
//     '......#..#.##.........#....#.#.......##.##.........##...........##...##.....#......#.......#..#.',
//     '.#.....#.....#....#..........#...#..#.#...#...#....#.#.......#.....#..#.......#...........#..##.',
//     '..#.#......................#.##....##....#.#......#.....#..##.##...#......#..#..#.#....#....#...',
//     '.#.....#......#..##..........#....#......##....#...#.........#........##............###.........',
//     '.#.#......#.#..##.....#..............#..##......#...#..#..#..#..##.#..#........#.......#....##..',
//     '.....#..#.##..####.###....##...#....#..........#....###..#.##....##....#..#....................#',
//     '.#####...##....##...###........#.....##....##....#####.#...#...#...#..#..###..#..##....###....#.',
//     '#..#......#.##..........#..#.##...#.....#.#....#...#...#.#........#.......#.#.......#.....#.#...',
//     '...#...#...#..#...#...##....#..#.#.#...#.....#...#.#.##....##.#.........#......#.##.............',
//     '........#..#......##........##....#......#..#.#..#.#...##.........##.....##......#..#....#......',
//     '.####....##...#....###....##...#...#.......#......#....#.#.##..#.#...............##.#.##..#..#..',
//     '.#.....#.##.#..#..#..#.##..#..###.##....#.###...#..........#......#....##....#..#.#....#..##...#',
//     '..###.#..###.#####..#.##...##..#............#.....#....#.#....#..............#.#........#...##.#',
//     '.#.#.###..#...#...#....##......#..##...##..#.....#.....#.#.#.....#.#..........#..##.####......#.',
//     '###..#...#..##....#.##.#..#...#.#...##..#..#.##..#..##.##......#.....###..#......#....#.#..##.##',
//     '....#.##.#....##..#...#...........###.#####.#..##....#....#..#.##.#....##....#......#.#..#.##...',
//     '.....#...............#.##..#.#.##.#####..#.....##....#...###...#..#.##.....#.#..................',
//     '.....#.........#.#.#.......#.#..............#...#.#.#...#..#.....#......#.....#.........#.......',
//     '##..#.#.......##........#..##...#.............##....#.#..##..#....##..#...............###.####.#',
//     '.##.#....#......#...#.........##..###..#....#.....##....#..#..#.....#..#..##.##.#..###...#..#.#.',
//     '.#...##......#.##.#..#..#.###.##.#..##..#.##...###.#..##..#..#.#.####.#.##....##....#.##.#.....#',
//     '..#......##.####...##....##.#..#.#..##.....#..........#....#.#..#.#.#.......................#.##',
//     '..#.....##...###.#......#.....#......#................#.#..##...#.....#...#.....#.#...#..#......',
//     '......#...#......####....#...#.#..#............#.#...............#..##...#..#.#...#...#..#...###',
//     '#...........#.#....#.#..####..#.........#...#....#...#.#.#.##....#........#........#....#..##.##',
//     '.#........#..###.##.....##..#......#..##.....#....##...##....#.....#.........#.........#......#.',
//     '##...##.#.#....##....#..##...#.#..##.........#.#...#...##.#..............#.#..........#...#..#..',
//     '...##.....#..#.........###..#......##..#.#...##....##....#........#..#....##.#....#......##..#..',
//     '..###...#.........##............#.#........#.....#..#.....###.#..........#......#...##..#.......',
//     '#.#....#.##..#............##.#........#.........##.....##....#..#...#..##.#..........#......#.##',
//     '...............##.....#...............##....#.#......##.....#..#.....#.#..#.....##..#.#...#.#...',
//     '..##.....#......#.....#........#......#...#......#.#....#..##............#.#.#..#.#.......##....',
//     '..#..............#....##.#..........#......#...#..##..#.#....#.....#..........##..#.....#....#..',
//     '##...#......##....##......#.....#......#.#..#.......##..#..............#...###.#.#.#........#...',
//     '.#............#..#.#..#####..#.#..#.....#......#.#.......##.#..#..#..#.##.#......##......#..#...',
//     '...#.#..##..#..#..#.#.....###..........#.###..#.#.#...####...###..######.#.###........#.#...#..#',
//     '..#........#......#...###.#..#.#####..#..#.....#...##.##............#......#..##.#.....#.#....#.',
//     '#...##....#.........######....##...###....#...#..#..#.....##........#....#.#....................',
//     '##.....#..#...#.#.......##.....#......#....#.#.#......#..........#...........#.#..#.....####....',
//     '.....##.........#..#.....##.......##.##...........#.....#.....#.##..#..#..##.#........#.........',
//     '...........#.....#..#..#...#.....###.#..#..#..##.#..##.#...###....##....##...###....#..##.......',
//     '......##.#..##..#..##..#....#.####....##....##....#..##..#.##......#..#.............#.#.#.......',
//     '.........#...#..###...#..#..#..##....##....#.#...#......#....#...#...##........#.#.#..#..###....',
//     '..#..#.##.#.......##.#....#...#.......#..#.#.........#...##.#............#.##.#...#............#',
//     '.#..............#......#...#..#.#......#........#....#.#....#......#.##.........................',
//     '....#..#...#.....#...#.#.....#...#...#.........#..#............##....#......##.#.....#...#..##.#',
//     '.#.#...#......#.......#..##.#.##..##.#..#...##.#..#...#...........##...#....#.#......#....#.....',
//     '#.......##.......#....###.#.###....##.#..#.................#......#####.....##......#.....###...',
//     '......#............#...##..#..#...##......#.##.#.#......#.#.#..#..#..#.......#.....##.....#.....',
//     '.....#..#.....#.#..##....####..#...#....#..#.......##.....#..............#..###.#..###...#..#...',
//     '......#..#........................##........#.#.#.#........#.##..##.##..##.#..##.##.#...........',
//     '#.....#....#.#..###....#.#..#.......#....#.....#..........#....###.#..##....##.#..#.#.....#....#',
//     '##.#.....#......#..#......#..#....#..#...#.#...#....#...#..#..#.#......##...#............#..#.#.',
//     '.#....#.#.#.##.#.#.##....#................#.##...#............##.#..#.....#.#.#......##.....#...',
//     '........#................#...#.##........##....##....#.......#..#....##...#....#....#.....#.#..#',
//     '..#.#.....#............#.....#......#.##...#...#......##...#.....#....#.........##.##...........',
//     '.#...#....##....#.#.#.#..........#........#..#..#.#...#.....#..#..............##...#.#......#...',
//     '####...#.....#..........#.#..#.......#..#..........#...##...####...#.#....#...#...#........#...#',
//     '...#.#.#......#.#.......#....#.#..#...###.#...#...#...#..##.#..#..#..#..#..#...#......##.#......',
//     '#.....#.#..#......#.#...#............#.#..#....##...#.####.#.##...####..##..#..##........#..#...',
//     '..##............##....#......##....#...#....#.#..#..#..#..#..###...##....#..#..##..#..##.#...##.',
//     '....#...#..##..##..##.....#...........###......##...##.......#..#.#.....##....#.#..#.....###.##.',
//     '.#.............................#.#.##..#....#....#...##....##..#...#...##..#.....#.....#.......#',
//     '#...#...#..#...#....#............#...#.#....#....#..###...#.....#..#.##...........###.#.#..#....',
//     '..##......###.#..#.....##........#..#...........#..##.......#.##........#..#..#.##..#..#.......#',
//     '.........................#...#.......#...##..#...#....#..............####...##....##....#....#..',
//     '#.#................#......#.##.#.#....#..#..#......#...#.####..#...##.#......#....#........#....',
//     '#.....##....#.....#....#..#..#..#..#..#.#..#...#.......#..#...#.....#...#.###..#.#...#..........',
//     '...##......#...#...####...###...###....##.##......##.....#.#....#...........###.#....#.##....#..',
//     '...##...#.#...#..#...#.....#......##..###...#.#..##...#.#.....###.#......##..#..#..####.###.....',
//     '.#.###.#....#...#......#...#.#...#.............##......#......###.#....###..#.##....##.#..#.#.##',
//     '..#.##..##.#.........#...............#......##.#.#.#.#.....####....##.#.##..##...##....#...#.#..',
//     '#....##.#..........#.#........#..#..#.........#.#..#...#.......##...#...##..#....#.#.......##...',
//     '#.#...#.###...#.#.....#..........................#....#.#.##..##....#.....#...#....###...#..##..',
//     '.........##............#..##..#.#...#..#..##.......#..#....####....##.###...................#...',
//     '...#.#.#...#........#..#.##..####..##....#....##..#..#.###.#..#........#..####..#..##.##...#..##',
//     '#..............#####....##....####..#..#.#..###..#.#####.##.####..#.####...##...###....##.......',
//     '..........#..##...#.#...##.....#.#...........#.........#....##.#.....##.......#.#......#....#.##',
//     '..........##......##..#.#.....#........##.#....####.#.#...#......###.....##.#.#..#.#.......#....',
//     '#.##...........#.....#...#.#....#.....................###.#....##.........##...##.....#.#....#.#',
// ]