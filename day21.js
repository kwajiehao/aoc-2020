// day twenty one

const fs = require('fs');
const _ = require('lodash');

let ingredients
try {  
    const data = fs.readFileSync('/Users/jiehaokwa/Desktop/Advent \of \Code/day21Input.txt', 'utf8')
    ingredients = data
        .toString()
        .split('\n')
        .filter(elem => {
            if (elem) return true
        })
} catch(e) {
    console.log('Error:', e.stack)
}

const testInput = [
    'mxmxvkd kfcds sqjhc nhms (contains dairy, fish)',
    'trh fvjkl sbzzf mxmxvkd (contains dairy)',
    'sqjhc fvjkl (contains soy)',
    'sqjhc mxmxvkd sbzzf (contains fish)',
]


// rules
// - each allergen is found in exactly one ingredient (meaning, the same allergen cannot appear in 2 different ingredients)
// - each ingredient contains 0 or 1 allergen
// - allergens aren't always marked
// - however, if they are marked, it means that the ingredient they belong to is necessarily in the ingredient list

// part one
const getIngredientsAndAllergens = (ingredients) => {
    return ingredients.map((line) => {
        const [ingredients, allergens] = line.split(' (contains ')
        const ingredientArr = ingredients.split(' ').map((elem) => elem.trim())
        const allergenArr = allergens.replace(')', '').split(',').map((elem) => elem.trim())
        return {
            ingredients: ingredientArr,
            allergens: allergenArr,
        }
    })
}

const ingredientsAndAllergens = getIngredientsAndAllergens(ingredients)
const testIngredientsAndAllergens = getIngredientsAndAllergens(testInput)
// console.log(testIngredientsAndAllergens)

const getAllIngredients = (ingredientsAndAllergens) => {
    const allIngredients = []
    ingredientsAndAllergens.forEach((product) => {
        allIngredients.push(...product.ingredients)
    })
    return [...new Set(allIngredients)]
}
// console.log(getAllIngredients(testIngredientsAndAllergens))

const getAllAllergens = (ingredientsAndAllergens) => {
    const allAllergens = []
    ingredientsAndAllergens.forEach((product) => {
        allAllergens.push(...product.allergens)
    })
    return [...new Set(allAllergens)]
}
// console.log(getAllAllergens(testIngredientsAndAllergens))

const extractAllergenRules = (ingredientsAndAllergens) => {
    const allergenRules = {}

    ingredientsAndAllergens.forEach((product) => {
        product.allergens.forEach((allergen) => {
            if (allergenRules[allergen]) {
                allergenRules[allergen] = [...allergenRules[allergen], product.ingredients]
            } else {
                allergenRules[allergen] = [product.ingredients]
            }
        })
    })

    return allergenRules
}
// console.log(extractAllergenRules(testIngredientsAndAllergens))

const matchIngredientsWithAllergens = (ingredientsAndAllergens) => {
    const allIngredients = getAllIngredients(ingredientsAndAllergens)
    const allAllergens = getAllAllergens(ingredientsAndAllergens)
    const allergenRules = extractAllergenRules(ingredientsAndAllergens)

    // sort allergens in decreasing order of products they appear in
    const sortedAllergens = allAllergens.sort((a, b) => allergenRules[b].length - allergenRules[a].length)

    // track ingredient and matching allergen
    const ingredientAllergenMap = {}
    
    sortedAllergens.forEach((allergen) => {
        const matchingIngrLists = allergenRules[allergen]

        const flattenedIngrLists = _.flattenDeep(matchingIngrLists)
        const allAssociatedIngredients = [...new Set(flattenedIngrLists)]


        for (var i = 0; i < allAssociatedIngredients.length; i++) {
            const currIngredient = allAssociatedIngredients[i]
            const flattenedIngrListWithoutCurrIngr = flattenedIngrLists.filter((elem) => elem !== currIngredient)

            // if there is a single ingredient which is present everytime the allergen is present, we assume it contains the allergen
            if (flattenedIngrListWithoutCurrIngr.length === (flattenedIngrLists.length - matchingIngrLists.length)) {
                if (!ingredientAllergenMap[allergen]) {
                    ingredientAllergenMap[allergen] = [currIngredient]
                } else {
                    ingredientAllergenMap[allergen] = [...ingredientAllergenMap[allergen], currIngredient]
                }
            }
        }
    })

    // prune the map
    const allergensMatched = []
    const matchedIngredients = []
    while (allergensMatched.length !== allAllergens.length) {
        for (var i = 0; i < allAllergens.length; i++) {
            if (allergensMatched.length === allAllergens.length) break

            const allergen = allAllergens[i]
            if (allergensMatched.includes(allergen)) continue

            // filter out already matched ingredients
            const filteredCandidates = [...ingredientAllergenMap[allergen]].filter((elem) => !matchedIngredients.includes(elem))

            if (filteredCandidates.length === 1) {
                allergensMatched.push(allergen)
                matchedIngredients.push(filteredCandidates[0])
            }

            // update the allergen map
            ingredientAllergenMap[allergen] = filteredCandidates
        }
    }

    // count remaining ingredients
    const remainingIngredients = allIngredients.filter((elem) => !matchedIngredients.includes(elem))
    let count = 0
    const flattenedAllIngredientList = _.flattenDeep(Object.values(ingredientsAndAllergens).map((product) => product.ingredients))
    flattenedAllIngredientList.forEach((ingredient) => {
        if (remainingIngredients.includes(ingredient)) {
            count++
        }
    })
    return {
        count,
        ingredientAllergenMap,
    }
}
// console.log(matchIngredientsWithAllergens(testIngredientsAndAllergens))
// console.log(matchIngredientsWithAllergens(ingredientsAndAllergens))

// part two
const { ingredientAllergenMap } = matchIngredientsWithAllergens(ingredientsAndAllergens)

const allergensAlphabetical = Object.keys(ingredientAllergenMap).sort((a, b) => a.localeCompare(b))

let allergenList = ''

allergensAlphabetical.forEach((allergen, idx) => {
    if (idx === 0) {
        allergenList += ingredientAllergenMap[allergen]
    } else {
        allergenList += `,${ingredientAllergenMap[allergen]}`
    }
})

console.log(allergenList)