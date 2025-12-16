const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path'); // Import 'path' module
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const logger = require('./middleware/logger');
const db = require('./config/db');
const socketSetup = require('./sockets');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(logger);
app.use(express.static(path.join(__dirname, '../public')));

socketSetup(io);

db(process.env.MONGO_URI)
    .then(() => {
        console.log('Database connected successfully');
        server.listen(port, () => console.log("Server running on port", port));
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1);
    });
