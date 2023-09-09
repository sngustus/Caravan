import Deck from './deck.js'
const draggables = document.querySelectorAll('.draggable')
const disc = document.getElementById('discard')

document.getElementById("newGame").onclick = function() {startGame()}

let cDeck = new Deck()
let pDeck = new Deck()
cDeck.shuffle()
pDeck.shuffle()

let cHand = deal(cDeck,0)
let pHand = deal(pDeck,5)

//--->
console.log(pHand.length)
console.log(pDeck.length)

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
        draggable.classList.remove('drugover')
    })
})

draggables.forEach(draggable => {
    draggable.addEventListener('dragover', e => {
        e.preventDefault()
        draggable.classList.add('drugover')
        draggable.classList.remove('total')

        draggable.addEventListener('drop', f => {
            var val = parseInt((document.querySelector('.dragging').dataset.value).substring(0,2))
            f.stopImmediatePropagation()
            console.log('dragg')

            draggable.innerText = parseInt(draggable.innerText) + val
            
            if (draggable.innerText > 26) {
                draggable.classList.add('overencumbered')
                draggable.classList.remove('sold')
            } else if (draggable.innerText <=26 && draggable.innerText >= 21) {
                draggable.classList.add('sold')
                draggable.classList.remove('overencumbered')
            } else {
                draggable.classList.add('total')
                draggable.classList.remove('pre-total')
            }

            //here vvv
            if (document.querySelector('.dragging').id) {
                let newcard = pDeck.cards.shift()
                document.querySelector('.dragging').dataset.value = newcard.value.concat(' ',newcard.suit)
                document.querySelector('.dragging').innerText = newcard.suit
            }

            draggable.classList.remove('drugover')
        })

        draggable.addEventListener('dragleave', () => {
            draggable.classList.remove('drugover')
        })

    })
})


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
        item.innerText = "0"
        item.classList.add('pre-total')
        item.classList.add('total')
    } else {
        console.log('false')
        item.dataset.value = newcard.value.concat(' ',newcard.suit)
        item.innerText = newcard.suit
    }

    item.classList.remove('drugover')
    
})

function startGame() {
    document.getElementById("title-screen").style.display = 'none'
    document.getElementById("play-area").style.visibility = 'visible'
}

function deal(deck, start) {
    //start 0 for Computer and 5 for Player
    let hand = []
    for (let i = 0 ; i < 5; i++) {
        if (start==5) {
            document.getElementById("s".concat(i+start)).innerText = deck.cards[0].suit
            document.getElementById("s".concat(i+start)).dataset.value = deck.cards[0].value.concat(" ", deck.cards[0].suit)
        }
        hand.push(deck.cards.shift())
    }
    return hand
}

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


