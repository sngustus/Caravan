const SUITS = ["♠",	"♥", "♦", "♣"]
const VALUES = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
]

export class Deck {
    constructor(cards = newDeck()) {
        this.cards = cards
    }

    get numberOfCards() {
        return this.cards.length
    }

    shuffle() {
        for (let i = this.numberOfCards - 1; i > 0; i--) {
        const newIndex = Math.floor(Math.random() * (i + 1))
        const oldValue = this.cards[newIndex]
        this.cards[newIndex] = this.cards[i]
        this.cards[i] = oldValue
        }
    }
}

export class Card {
    constructor(suit, text) {
        this.suit = suit;
        this.text = text;
        this.value = 0;
        if (this.suit == "♠" || this.suit == "♣") {
            this.color = "black"
        } else if (this.suit == "♥" || this.suit == "♦") {
            this.color = "red"
        }
        this.attached = [];
        this.score = 0;
        this.determineScore()
    }

    determineScore() {
        this.value = parseInt(this.text) || 0;
        if (this.text == 'A') {this.value = 1};
        let numKings = this.attached.reduce((a,b) => {
            return a + (b.value=='K' ? 1 : 0);
        },0);
        
        this.score = this.value * (1 + numKings);
    }
}

export class Caravan {
    constructor(id,owner) {
        this.id = id;
        this.owner = owner;
        this.cards = [];
        this.total = 0;
        this.status = 'unsold';
        this.direction = '';
        this.suit = '';
    }

    evaluateCaravan(enemyTotal) {
        this.total = this.cards.reduce((a,b) => {
            return a + b.score;
        }, 0)
        
        //sold status
        if (this.total < 21) {
            this.status = 'unsold';
        } else if (this.total > 26) {
            this.status = 'overencumbered';
        } else {
            if (this.total < enemyTotal) {
                this.status = 'outbid';
            } else if (this.total == enemyTotal) {
                this.status = 'bidding war';
            } else { this.status = 'sold'}
        }
        //determine direction
        if (this.cards.length>=2) {
            let a = this.cards[(this.cards.length-2)].value
            let b = this.cards[(this.cards.length-1)].value
            if (a < b) {
                this.direction = '↑';
            } else if (a > b) {
                this.direction = '↓'
            } else {}
        }
    }

    discardCaravan() {
        this.cards = [];
        this.total = 0;
        this.status = 'unsold';
        this.direction = '';
        this.suit = '';
    }

}

function newDeck() {
    const deck = SUITS.flatMap(suit => {
        return VALUES.map(text => {
            return new Card(suit, text)
        })
    })

    deck.push(new Card("🃟","Joker"))//black joker
    deck.push(new Card("🃟","Joker"))//red joker

    return deck

}


