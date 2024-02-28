import {Deck} from './Objects.js';
import {Caravan} from './Objects.js';

//before Game - set global variables
let cpuDeck = new Deck();
let playerDeck = new Deck();
let cpuHand = [];
let playerHand = [];
let caravans = [];
let draggedItem = null;
const caravanElements = Array.from(document.querySelectorAll('.caravan'));
const discElement = document.getElementById('discard');

document.getElementById("newGame").onclick = function() {newGame()}

//test case
//addToCaravan(playerHand[1], caravans[4], playerHand, playerDeck);
//attachKing(playerHand[3],caravans[4].cards[0],caravans[4],playerHand, playerDeck);
//addToCaravan(playerHand[1], caravans[4], playerHand, playerDeck);
//attachQueen(playerHand[3],caravans[4].cards[1],caravans[4],playerHand, playerDeck);
//removeFromCaravan(playerHand[4],caravans[4].cards[0],caravans[4],playerHand,playerDeck);

//functions
function newGame() {
    document.getElementById("title-screen").style.display = 'none'
    document.getElementById("play-area").style.visibility = 'visible'

    resetDeck(cpuDeck);
    resetDeck(playerDeck);

    //deal 5 to both hands
    cpuHand = cpuDeck.cards.splice(0,5);
    playerHand = playerDeck.cards.splice(0,5);
    renderHand(playerHand);

    //reset the caravans
    caravans = [];
    for (let i = 0; i < 6; i++) {
        caravans.push(new Caravan(i,(i>2 ? "player" : "cpu")));//create 6 empty caravans
    }

    const draggables = Array.from(document.querySelectorAll('.draggable'));
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            draggable.classList.add('dragging');
            draggedItem = e.target;
        })

        draggable.addEventListener('dragend', (e) => {
            draggable.classList.remove('dragging');
            draggedItem = null;
            
        })
    })

    caravanElements.forEach(caravan => {
        caravan.addEventListener('dragover', e => {
            e.preventDefault()
            caravan.classList.add('drugover')
            caravan.classList.remove('total')
        })

        caravan.addEventListener('drop', e => {
            e.stopImmediatePropagation()
            
            let caravanIndex = caravanElements.indexOf(caravan)
            let cardIndex = draggables.indexOf(draggedItem) - 3
            addToCaravan(playerHand[cardIndex],caravans[caravanIndex],playerHand, playerDeck) //make work for cpu too
            renderCaravan(caravans[caravanIndex]);
            caravan.classList.remove('drugover');
            renderHand(playerHand);
            draggedItem = null;
        })

        caravan.addEventListener('dragleave', () => {
            caravan.classList.remove('drugover')
        })

})
}

function addToCaravan(card, caravan, hand, deck) { //only call w/ A-10
    //add card to caravan
    caravan.cards.push(card)
    caravan.suit = card.suit;
    caravan.evaluateCaravan(getEnemyTotal(caravan))

    //replace card in hand
    let index = hand.indexOf(card)
    hand[index] = deck.cards.shift()
}

function resetDeck(deck) {
    if (deck.cards.length !== 54) {
        deck = new Deck();
    }
    deck.shuffle()
}


function discardFromHand(card, hand, deck) { //takes turn
    //replace card in hand
    let index = hand.indexOf(card)
    hand[index] = deck.cards.shift()
}

function removeFromCaravan(cardPlayed, cardToRemove, caravan, hand, deck) { //Jack Played
    let i = caravan.cards.indexOf(cardToRemove);
    caravan.cards.splice(i,1);
    caravan.evaluateCaravan(getEnemyTotal(caravan));

    //replace card in hand
    let index = hand.indexOf(cardPlayed)
    hand[index] = deck.cards.shift()
}

function attachQueen(cardPlayed, cardToQueen, caravan, hand, deck) {
    cardToQueen.attached.push(cardPlayed)
    caravan.suit = cardPlayed.suit

    //if direction isn't '', swap it
    if (caravan.direction == '↑') {
        caravan.direction = '↓';
    } else if (caravan.direction == '↓') {
        caravan.direction = '↑';
    } else {}

    //replace card in hand
    let index = hand.indexOf(cardPlayed)
    hand[index] = deck.cards.shift()
}

function attachKing(cardPlayed, cardToDouble, caravan, hand, deck) {
    //add validation that it was a King played??
    //OR handle this when deciding what to call
    
    cardToDouble.attached.push(cardPlayed);
    cardToDouble.determineScore();
    caravan.evaluateCaravan(getEnemyTotal(caravan));

    //replace card in hand
    let index = hand.indexOf(cardPlayed)
    hand[index] = deck.cards.shift()
}

function checkForWin() {
    let cpuWins = caravans.reduce((a,b) => {
        return a + ((b.status=='sold' && b.owner =='cpu') ? 1 : 0);
    },0);
    let playerWins = caravans.reduce((a,b) => {
        return a + ((b.status=='sold' && b.owner =='player') ? 1 : 0);
    },0);

    if (cpuWins >= 2) {
        console.log('YOU LOSE!')
        //do stuff
    } else if (playerWins >= 2) {
        console.log('YOU WIN!')
        //do stuff
    }
}

function getEnemyTotal(caravan) {
    let enemyIndex = caravan.id > 2 ? (caravan.id-3) : (caravan.id+3);
    return caravans[enemyIndex].total;
}

function renderHand(hand) {
    let playerArea = document.getElementById('player-area')
    playerArea.innerHTML=''
    hand.forEach(card => {
        playerArea.innerHTML +=card.html
    })
}

function renderCaravan(caravan) {
    caravanElements[caravan.id].innerHTML = `${caravan.total} ${caravan.direction} <br /> ${caravan.suit}`
}

//TODO:
//replacing dragged element destroys event listener

//jokers - special rules
//validation for only attaching facecards, only adding A-10 cards, etc
//how does direction work if A or 10? also can you play same #?

//refactoring:
//move card replacement piece to new 

//note: until can render whole caravan, just display direction, suit, latest, total