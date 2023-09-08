import Deck from './deck.js'

document.getElementById("newGame").onclick = function() {startGame()}





function startGame() {
    document.getElementById("title-screen").style.display = 'none'
    document.getElementById("play-area").style.visibility = 'visible'
    const cDeck = new Deck()
    const pDeck = new Deck()
    cDeck.shuffle()
    pDeck.shuffle()

    let cHand = deal(cDeck,0)
    let pHand = deal(pDeck,5)

    console.log(cDeck.cards)
    console.log(pHand)

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


// click - select card or track (highlight)
// next click determines action - move, discard, etc