import Deck from './deck.js'

//figure out how to do this in HTML
document.getElementById("newGame").onclick = function() {startGame()}
let draggedItem

let cDeck = new Deck()
let pDeck = new Deck()
cDeck.shuffle()
pDeck.shuffle()

let cHand = cDeck.cards.splice(0,5);
let pHand = pDeck.cards.splice(0,5);

//elements
const caravans = document.querySelectorAll('.caravan');
const disc = document.getElementById('discard');
const pHandArea = document.getElementById('player-area');

//event listeners - styles

//styles when recieving caravan
caravans.forEach(caravan => {
    caravan.addEventListener('dragover', e => {
        e.preventDefault()
        caravan.classList.add('drugover')
        caravan.classList.remove('total')
    })

    caravan.addEventListener('drop', f => {
        f.stopImmediatePropagation()
        
        addToCaravan(f) //calls logic function

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

disc.addEventListener('drop', e => {
    e.stopImmediatePropagation()
    disc.classList.remove('discardHov')
    disc.classList.add('discardStd')
    item.classList.remove('drugover')

    handleDiscard()
})





//functions
function handleDiscard() { //STILL TO UPDATE
    //discard old card
    let item = document.querySelector('.dragging')

    //get new card
    let newcard = pDeck.cards.shift()
    pHand.push(newcard)
    renderHand(pHand)

}

function renderHand(hand) {
    pHandArea.innerHTML=''
    hand.forEach(card => {
        pHandArea.innerHTML +=card.html
    })
}

function startGame() {
    document.getElementById("title-screen").style.display = 'none'
    document.getElementById("play-area").style.visibility = 'visible'
   
    renderHand(pHand)

    //styles while dragging  
    const draggables = document.querySelectorAll('.draggable')
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            draggable.classList.add('dragging')
            draggedItem = e.target
        })

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
            
        })
    })
}

function addToCaravan(e) {
    const caravanElement = e.target
    caravanElement.innerHTML = draggedItem.innerHTML
    caravanElement.dataset.value = draggedItem.dataset.value
    
    let newcard = pDeck.cards.shift()
    draggedItem.innerHTML = newcard.html
}


/*if starting over:
        X X X X X

         X  X  X

         X  X  X
    
        X X X X X

    -hand is object
    -deck is object
    -each caravan is object
        -caravan data-total
    -probably want react for this

    -wait to do styles til after
*/