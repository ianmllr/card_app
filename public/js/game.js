const socket = io();

const handContainer = document.getElementById('hand-container');
const lobbyTitle = document.getElementById('lobby-title');

// get session data
const lobbyId = sessionStorage.getItem('lobbyId');
const username = sessionStorage.getItem('username');

// join same game
if (lobbyId && username) {
    lobbyTitle.innerText = `Lobby: ${sessionStorage.getItem('lobbyName')}`;
    // Tell server we are ready/reconnected (optional, depending on your logic)
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

// updates from server
socket.on('game_update', (gameState) => {
    const myPlayer = gameState.players[socket.id];

    if (myPlayer && myPlayer.hand) {
        renderHand(myPlayer.hand);
    }
});

socket.on('game_started', (gameState) => {
    const myPlayer = gameState.players[socket.id];
    if (myPlayer) renderHand(myPlayer.hand);
});
