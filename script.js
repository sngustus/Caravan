import Deck from './deck.js'

document.getElementById("newGame").onclick = function() {startGame()}





function startGame() {
    const deck = new Deck()
    deck.shuffle()
    for (let i = 0; i < 10; i++) {
        document.getElementById("s".concat(i)).innerText = deck.cards[i].suit
        document.getElementById("s".concat(i)).dataset.value = deck.cards[i].value.concat(" ", deck.cards[i].suit) 
    }
}