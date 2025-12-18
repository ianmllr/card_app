const socket = io();

const lobbyTitle = document.getElementById('lobby-title');
const tableContainer = document.getElementById('table-container');
const handContainer = document.getElementById('hand-container');

const startGameBtn = document.getElementById('start-game-btn');
const drawCardBtn = document.getElementById('draw-card-btn');


// get session data
const lobbyId = sessionStorage.getItem('lobbyId');
const username = sessionStorage.getItem('username');

// join same game
if (lobbyId && username) {
    lobbyTitle.innerText = `Lobby: ${sessionStorage.getItem('lobbyName')}`;
    // Tell server we are connected to this game page
    socket.emit('join_game_page', { lobbyId, username });
}

// --- RENDERING LOGIC ---

// Helper function to render an array of cards
function renderHand(cards) {
    // Clear previous cards
    handContainer.innerHTML = '';

    cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        // color based on suit
        const isRed = card.suit === 'H' || card.suit === 'D';
        cardDiv.classList.add(isRed ? 'red' : 'black');

        // suit symbols
        const suitSymbols = { 'H': '♥', 'D': '♦', 'C': '♣', 'S': '♠' };

        // set the content (eg "10 ♥")
        cardDiv.innerText = `${card.value}\n${suitSymbols[card.suit]}`;

        // append to container
        handContainer.appendChild(cardDiv);
    });
}

function renderTable(players, deckCount) {
    tableContainer.innerHTML = '';

    // Create deck display section
    const deckSection = document.createElement('div');
    deckSection.style.display = 'flex';
    deckSection.style.flexDirection = 'column';
    deckSection.style.alignItems = 'center';
    deckSection.style.marginBottom = '20px';
    deckSection.style.padding = '10px';

    const deckLabel = document.createElement('div');
    deckLabel.innerText = `Deck (${deckCount} cards)`;
    deckLabel.style.color = 'white';
    deckLabel.style.marginBottom = '10px';
    deckSection.appendChild(deckLabel);

    // Render deck as stacked card backs
    const deckContainer = document.createElement('div');
    deckContainer.style.position = 'relative';
    deckContainer.style.width = '80px';
    deckContainer.style.height = '120px';

    // Show up to 15 cards stacked with offset for depth effect
    const visibleCards = Math.min(deckCount, 15);
    for (let i = 0; i < visibleCards; i++) {
        const cardBack = document.createElement('div');
        cardBack.classList.add('card', 'card-back');
        cardBack.style.position = 'absolute';
        cardBack.style.left = `${i * 2}px`;
        cardBack.style.top = `${i * 2}px`;
        deckContainer.appendChild(cardBack);
    }

    deckSection.appendChild(deckContainer);
    tableContainer.appendChild(deckSection);

    // Render players
    for (const playerId in players) {
        const player = players[playerId];
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player-info');

        const nameSpan = document.createElement('div');
        nameSpan.innerText = player.username;
        nameSpan.style.marginBottom = '10px';
        playerDiv.appendChild(nameSpan);

        // Container for all stacks
        const stacksContainer = document.createElement('div');
        stacksContainer.style.display = 'flex';
        stacksContainer.style.gap = '10px';

        // Calculate number of stacks needed (5 cards per stack)
        const totalCards = player.hand.length;
        const numStacks = Math.ceil(totalCards / 5);

        for (let stackIndex = 0; stackIndex < numStacks; stackIndex++) {
            const cardsInThisStack = Math.min(5, totalCards - (stackIndex * 5));

            // Individual stack container
            const stackDiv = document.createElement('div');
            stackDiv.style.position = 'relative';
            stackDiv.style.width = '80px';
            stackDiv.style.height = '120px';

            // Render cards in this stack
            for (let i = 0; i < cardsInThisStack; i++) {
                const cardBack = document.createElement('div');
                cardBack.classList.add('card', 'card-back');
                cardBack.style.position = 'absolute';
                cardBack.style.left = `${i * 2}px`;
                cardBack.style.top = `${i * 2}px`;
                stackDiv.appendChild(cardBack);
            }

            stacksContainer.appendChild(stackDiv);
        }

        playerDiv.appendChild(stacksContainer);
        tableContainer.appendChild(playerDiv);
    }
}




// updates table and hand when game state changes
socket.on('game_update', (gameState) => {
    const myPlayer = gameState.players[socket.id];
    // update hand
    if (myPlayer && myPlayer.hand) {
        renderHand(myPlayer.hand);
    }
    // update table
    renderTable(gameState.players, gameState.deckCount);
});

socket.on('game_started', (gameState) => {
    const myPlayer = gameState.players[socket.id];
    if (myPlayer) renderHand(myPlayer.hand);
    renderTable(gameState.players, gameState.deckCount);
});


socket.on('game_started', (gameState) => {
    const myPlayer = gameState.players[socket.id];
    if (myPlayer) renderHand(myPlayer.hand);
});


// EVENT LISTENERS
// draw card button
drawCardBtn.addEventListener('click', () => {
    socket.emit('draw_card', { lobbyId });
});

startGameBtn.addEventListener('click', () => {
    socket.emit('start_game', lobbyId);
});

