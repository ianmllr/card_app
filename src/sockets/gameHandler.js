const logger = require('../middleware/logger');
const Lobby = require('../model/Lobby');
const User = require('../model/User');
const Game = require('../game/Game');

module.exports = (io, socket, activeGames) => {
    // called when a player opens the game page
    socket.on('join_game_page', (data) => {
        const { lobbyId, username } = data;
        socket.join(lobbyId);
        socket.data.username = username;
        console.log(`${username} joined game page for lobby ${lobbyId}`);
    });

    // called by host pressing "Start Game"
    socket.on('start_game', async (lobbyId) => {
        if (!activeGames[lobbyId]) {
            const game = new Game(lobbyId);
            const socketsInRoom = await io.in(lobbyId).fetchSockets();

            socketsInRoom.forEach((playerSocket) => {
                const username = playerSocket.data.username || 'Unknown';
                game.addPlayer(playerSocket.id, username);
            });

            activeGames[lobbyId] = game;
        }
        io.to(lobbyId).emit('game_started', activeGames[lobbyId].getState());
    });

    // called when a player presses "Draw Card"
    socket.on('draw_card', (data) => {
        const { lobbyId } = data;
        const game = activeGames[lobbyId];

        if (game) {
            try {
                game.drawCard(socket.id);
                io.to(lobbyId).emit('game_update', game.getState());
            } catch (err) {
                socket.emit('error', { message: err.message });
            }
        }
    });
};
