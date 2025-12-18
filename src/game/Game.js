class Game {
    constructor(lobbyId) {
    this.lobbyId = lobbyId;
    this.deck = [];
    this.players = {};
    this.currentTurn = null;

    this.initializeDeck();
    }

    initializeDeck() {
        const suits = ['H', 'D', 'C', 'S'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        this.deck = [];
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({ suit, value });
            }
        }
        this.shuffleDeck();
    }

    shuffleDeck() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    addPlayer(socketId, username) {
        if (!this.players[socketId]) {
            this.players[socketId] = { username, hand: [] };
        }
    }


    drawCard(socketId) {
        if (this.deck.length === 0) { // cant pull card if deck is empty
            throw new Error("Deck is empty");
        }

        // removes card from shared deck
        const card = this.deck.pop();

        // adds to player's hand
        this.players[socketId].hand.push(card);

        return card;
    }

    getState() {
        return {
            deckCount: this.deck.length,
            players: this.players
        };
    }
}

module.exports = Game;