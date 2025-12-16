const logger = require('../middleware/logger');
const Lobby = require('../model/Lobby');
const User = require('../model/User');
const Game = require('../game/Game');

module.exports = (io, socket, activeGames) => {
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
