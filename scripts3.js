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
const disc= document.getElementById('discard');

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
        caravans.push(new Caravan(i,(i<3 ? "player" : "cpu")));//create 6 empty caravans
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
            if (playerHand[cardIndex].value !== 0) {
                addToCaravan(playerHand[cardIndex],caravans[caravanIndex],playerHand, playerDeck) //make work for cpu too
            } else if (playerHand[cardIndex].text == 'Q') {
                attachQueen(playerHand[cardIndex],caravans[caravanIndex].cards[(caravans[caravanIndex].cards.length)-1],caravans[caravanIndex],playerHand, playerDeck)
            } else if (playerHand[cardIndex].text == 'K' || playerHand[cardIndex].text == 'J') {
                //select which card to apply to
                //run the applicable function
            } else if (playerHand[cardIndex].text == 'Joker') {
                //joker()
            }

            renderCaravan(caravans[caravanIndex]);
            caravan.classList.remove('drugover');
            renderHand(playerHand);
            draggedItem = null;
            checkForWin();
        })

        caravan.addEventListener('dragleave', () => {
            caravan.classList.remove('drugover')
        })

   

    })

    disc.addEventListener('dragover', e => {
        e.preventDefault()
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
        disc.classList.remove('drugover')
    
        let dragIndex = draggables.indexOf(draggedItem);
        if (dragIndex < 3) {
            caravans[dragIndex].discardCaravan();
            renderCaravan(caravans[dragIndex]);
        } else {
            discardFromHand(playerHand[dragIndex-3],playerHand, playerDeck);
            renderHand(playerHand);
        }

        draggedItem = null;
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
    cardToQueen.attached.push(cardPlayed);
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
        let isCPUWin = (b.status=='sold' && b.owner =='cpu');
        return a + (isCPUWin ? 1 : 0);
    },0);
    let playerWins = caravans.reduce((a,b) => {
        let isPlayerWin = (b.status=='sold' && b.owner =='player');
        return a + (isPlayerWin ? 1 : 0);
    },0);

    if (playerWins >= 2) {
        if (confirm('YOU WIN! \n New Game?')) {
            newGame()
            caravans.forEach(caravan => renderCaravan(caravan));        }
    } else if (cpuWins >= 2) {
        if (confirm('YOU LOSE! \n New Game?')) {
            newGame()
            caravans.forEach(caravan => renderCaravan(caravan));
        }
    }
}

function getEnemyTotal(caravan) {
    let enemyIndex = caravan.id > 2 ? (caravan.id-3) : (caravan.id+3);
    return caravans[enemyIndex].total;
}

function renderHand(hand) {
    let cardslots = document.querySelectorAll('.pl')
    for (let i=0;i<5;i++) {
        cardslots[i].innerHTML = hand[i].suit;
        cardslots[i].classList.add(hand[i].color);
        cardslots[i].dataset.value = (hand[i].text.concat(' ',hand[i].suit));
    }
}

function renderCaravan(caravan) {
    if (caravan.total > 0) {
        caravanElements[caravan.id].innerHTML = `<p class="caravan-text">${caravan.total} ${caravan.direction} <br /> ${caravan.suit}</p>`
    } else {
        caravanElements[caravan.id].innerHTML = `<div class="pre-total total card draggable caravan" draggable="true"></div>`
    }

    if (caravan.status == 'sold') {
        caravanElements[caravan.id].classList.add('sold');
        caravanElements[caravan.id].classList.remove('overencumbered');
    } else if (caravan.status == 'overencumbered') {
        caravanElements[caravan.id].classList.add('overencumbered');
        caravanElements[caravan.id].classList.remove('sold');
    } else {
        caravanElements[caravan.id].classList.remove('sold');
        caravanElements[caravan.id].classList.remove('overencumbered');
    }
}

function joker(cardJokered) {
    let playedOnAce = (cardJokered.text=='A');
    caravans.forEach((caravan) => {
        caravan.cards.forEach((card) => {
            if (playedOnAce) {
                if (card.suit==cardJokered.suit) {
                    //remove card
                }
            } else {
                if (card.value == cardJokered.value) {
                    //remove card
                }
            }
        })
    })
}

//TODO:
//attaching J,K,Joker / card select
//implement jokers
//how does direction work if A or 10? also can you play same #?
//error when rendering caravans after Win->NewGame()
//turns / computer/player2 moves

//refactoring:
//move card replacement piece to new 

//note: until can render whole caravan, just display direction, suit, latest, total






//computer move logic:
//for cards -> for caravans 
    //if card.val + caravan.tot -> sold, do it
//


//[1 2 3 4 5] [10 11 12]