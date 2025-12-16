const mongoose = require('mongoose');

const lobbySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, minLength: 3 },
    maxPlayers: { type: Number, required: true, min: 2, max: 10 },
    isPrivate: { type: Boolean, default: false },
    password: { type: String, required: false },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.models.Lobby || mongoose.model('Lobby', lobbySchema);