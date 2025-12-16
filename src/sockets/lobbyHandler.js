const Lobby = require('../model/Lobby');
const User = require('../model/User');
const logger = require('../middleware/logger');

module.exports = (io, socket) => {

    // Create Lobby
    socket.on('create_lobby', async (data) => {
        try {
            const { lobbyName, username, isPrivate, password } = data;

            let user = await User.findOne({ username });
            if (!user) user = await User.create({ username, role: 'user' });

            const newLobby = await Lobby.create({
                name: lobbyName,
                maxPlayers: 8,
                isPrivate: isPrivate || false,
                password: isPrivate ? password : null,
                players: [user._id]
            });

            socket.join(newLobby.name);
            socket.data.username = username;

            socket.emit('lobby_created', { lobbyId: newLobby._id, name: newLobby.name });
            console.log(`Lobby ${lobbyName} created by ${username}`);
            logger.log(`Lobby ${lobbyName} created by ${username}`);
        } catch (err) {
            socket.emit('error', { message: err.message });
        }
    });

    // Join Lobby
    socket.on('join_lobby', async (data) => {
        try {
            const { lobbyName, username } = data;

            const lobby = await Lobby.findOne({ name: lobbyName });
            if (!lobby) throw new Error('Lobby not found');

            let user = await User.findOne({ username });
            if (!user) user = await User.create({ username, role: 'user' });

            if (!lobby.players.includes(user._id)) {
                lobby.players.push(user._id);
                await lobby.save();
            }

            socket.join(lobbyName);
            socket.data.username = username;


            io.to(lobbyName).emit('player_joined', { username });
            socket.emit('joined_success', { lobbyName });

        } catch (err) {
            socket.emit('error', { message: err.message });
        }
    });
};
