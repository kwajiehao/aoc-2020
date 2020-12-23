// day twenty two

const fs = require('fs');
const _ = require('lodash');

let cardDeck
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day22Input.txt', 'utf8')
    cardDeck = data
        .toString()
        .split('\n')
        // .filter(elem => {
        //     if (elem) return true
        // })
} catch(e) {
    console.log('Error:', e.stack)
}

const breakIdx = cardDeck.indexOf('')
// const player1Deck = cardDeck.slice(1, breakIdx)
// const player2Deck = cardDeck.slice(breakIdx + 2).filter((elem) => elem !== '')

const testDeck1 = [9, 2, 6, 3, 1]
const testDeck2 = [5, 8, 4, 7, 10]

const player1Deck = [14,23,6,16,46,24,13,25,17,4,31,7,1,47,15,9,50,3,30,37,43,10,28,33,32]
const player2Deck = [29,49,11,42,35,18,39,40,36,19,48,22,2,20,26,8,12,44,45,21,38,41,34,5,27]

// part one
const determineGameResult = (deck1, deck2) => {
    let player1Deck = [...deck1]
    let player2Deck = [...deck2]

    // play the game while both players have at least one card
    while (player1Deck.length > 0 && player2Deck.length > 0) {
        const player1Card = player1Deck.shift()
        const player2Card = player2Deck.shift()


        // assume that one card will be higher than the other 
        if (player1Card > player2Card) {
            player1Deck = [...player1Deck, player1Card, player2Card]
        }

        if (player2Card > player1Card) {
            player2Deck = [...player2Deck, player2Card, player1Card]
        }
    }

    return {
        player1Deck,
        player2Deck,
    }
}

// const { player1Deck: player1FinalDeck, player2Deck: player2FinalDeck } = determineGameResult(testDeck1, testDeck2)
const { player1Deck: player1FinalDeck, player2Deck: player2FinalDeck } = determineGameResult(player1Deck, player2Deck)

const calculateScore = (deck) => {
    let result = 0

    deck.reverse().forEach((number, idx) => {
        result += (number * (idx + 1))
    })

    return result
}

// console.log(player1FinalDeck, player2FinalDeck)
// console.log(calculateScore(player1FinalDeck), calculateScore(player2FinalDeck))

// part 2 

// step 1 - check whether there was a previous round with exact same deck configuration. if so, player one wins
// step 2 - if remainingCards.length >= drawnCardValue for both players, play recursive combat. Otherwise, default to previous

const recursiveCombat = (deck1, deck2, gameNum) => {
    var player1Deck = [...deck1]
    var player2Deck = [...deck2]

    const deckConfigurations = {
        player1: {},
        player2: {},
    }

    var round = 0

    // play the game while both players have at least one card
    while (player1Deck.length > 0 && player2Deck.length > 0) {
        const player1DeckString = JSON.stringify(player1Deck)
        const player2DeckString = JSON.stringify(player2Deck)

        console.log('game', gameNum, 'round', round)
        // console.log(player1Deck)
        // console.log(player2Deck)

        // player 1 wins
        if (deckConfigurations.player1[player1DeckString] && deckConfigurations.player2[player2DeckString]) {

            // player 2 loses
            player2Deck = []

        // we play the game
        } else {
            // record the configurations
            deckConfigurations.player1[player1DeckString] = true
            deckConfigurations.player2[player2DeckString] = true

            // Get cards
            const player1Card = player1Deck.shift()
            const player2Card = player2Deck.shift()

            // check for recursive combat
            if (player1Deck.length >= player1Card && player2Deck.length >= player2Card) {
                
                // prepare recursive combat decks
                const player1RecursiveCombatDeck = player1Deck.slice(0, player1Card)
                const player2RecursiveCombatDeck = player2Deck.slice(0, player2Card)

                const {
                    player1Deck: player1RecursiveResult,
                    player2Deck: player2RecursiveResult,
                } = recursiveCombat(player1RecursiveCombatDeck, player2RecursiveCombatDeck, gameNum + 1)

                if (player1RecursiveResult.length > 0) {
                    player1Deck = [...player1Deck, player1Card, player2Card]
                }
    
                if (player2RecursiveResult.length > 0) {
                    player2Deck = [...player2Deck, player2Card, player1Card]
                }

            // play the normal game otherwise
            } else {
                // assume that one card will be higher than the other 
                if (player1Card > player2Card) {
                    player1Deck = [...player1Deck, player1Card, player2Card]
                }

                if (player2Card > player1Card) {
                    player2Deck = [...player2Deck, player2Card, player1Card]
                }
            }
        }

        round++
    }

    console.log(player1Deck, player2Deck)

    return {
        player1Deck,
        player2Deck,
    }
}

const testDeck5 = [9, 2, 6, 3, 1]
const testDeck6 = [5, 8, 4, 7, 10]


// const { player1Deck: testDeck5Recursive, player2Deck: testDeck6Recursive } = recursiveCombat(testDeck5, testDeck6, 1)
// console.log(testDeck5Recursive)
// console.log(calculateScore(testDeck5Recursive), calculateScore(testDeck6Recursive))
const { player1Deck: player1RecursiveResult, player2Deck: player2RecursiveResult } = recursiveCombat(player1Deck, player2Deck, 1) 
console.log(calculateScore(player1RecursiveResult), calculateScore(player2RecursiveResult))
