const logger = require('../middleware/logger');
const gameHandler = require('./gameHandler');
const lobbyHandler = require('./lobbyHandler'); // Import the new handler

const activeGames = {}; // Shared state for games

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id);
        logger.log('A user connected: ' + socket.id);

        // other handlers
        lobbyHandler(io, socket);
        gameHandler(io, socket, activeGames);

        // disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected: ' + socket.id);
            logger.log('User disconnected: ' + socket.id);
        });
    });
};
