import Deck from './deck.js'
document.getElementById("newGame").onclick = function() {startGame()}

let cDeck = new Deck()
let pDeck = new Deck()
cDeck.shuffle()
pDeck.shuffle()

let cHand = deal(cDeck,0)
let pHand = deal(pDeck,5)

const draggables = document.querySelectorAll('.draggable')
const caravans = document.querySelectorAll('.caravan')
const disc = document.getElementById('discard')

//styles while dragging
draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
        
    })
})

//recieving caravan
caravans.forEach(caravan => {
    caravan.addEventListener('dragover', e => {
        e.preventDefault()
        caravan.classList.add('drugover')
        caravan.classList.remove('total')
    })

    caravan.addEventListener('drop', f => {
        let drag = document.querySelector('.dragging')

        f.stopImmediatePropagation()
        
        addToCaravan(caravan)

        caravan.classList.remove('drugover')
    })

    caravan.addEventListener('dragleave', () => {
        caravan.classList.remove('drugover')
    })

})

//discard styles
disc.addEventListener('dragover', ev => {
    ev.preventDefault()
    disc.classList.add('discardHov')
    disc.classList.remove('discardStd')
})

disc.addEventListener('dragleave', e => {
    e.preventDefault()
    disc.classList.remove('discardHov')
    disc.classList.add('discardStd')
})

//discard logic
disc.addEventListener('drop', e => {
    e.stopImmediatePropagation()
    disc.classList.remove('discardHov')
    disc.classList.add('discardStd')
    //discard logic
    let newcard = pDeck.cards.shift()
    let item = document.querySelector('.dragging')

    if (!item.id) {
        console.log('true')
        item.dataset.value = ""
        item.classList.add('pre-total')
        item.classList.add('total')
    } else {
        console.log('false')
        item.dataset.value = newcard.value.concat(' ',newcard.suit)
        item.innerText = newcard.suit
    }

    item.classList.remove('drugover')
    
})

//change screens on start
function startGame() {
    document.getElementById("title-screen").style.display = 'none'
    document.getElementById("play-area").style.visibility = 'visible'
}

//initiate cards
function deal(deck, start) {
    //start 0 for Computer and 5 for Player
    let hand = []
    for (let i = 0 ; i < 5; i++) {
        if (start==5) {
            document.getElementById("player-area").innerHTML += deck.cards[0].html
        }
        hand.push(deck.cards.shift())
    }
    return hand
}

//add card object as param here?
function addToCaravan (caravan) {
    let cardToAdd = document.querySelector('.dragging')
    caravan.innerHTML += cardToAdd.innerHTML        

    //replace with new card
    let newcard = pDeck.cards.shift()
    document.getElementById('player-area').innerHTML += (newcard.html)
}

// pass cards around, display by using html
// add totals
// worry about styles after





//4. cards in hands, caravans
//5. don't let it drag and drop on itself
//6. no drag and drop on other hands (or reorder)

//caravan logic
//winnning
//-compiling cards that have been played there
//-directions
//-no duplicates in a row
//- A = 1

//power ups
//-queen = reverses direction and changes suit
//-kings - played on a 9 adds 9 (4+K+K = 16)
//-jacks - removes that card, plus face cards attached to it
//-jokers on #s
//-jokers on As

//turns & computer moves

//fix:
//card color relative to suit
//tidy up code for pre-total vs total vs drugover vs sold vs overencumbered


