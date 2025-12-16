const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'logs', 'server.log');

// timestamp
const getTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
};

// write to file
const writeToFile = (message) => {
    console.log(message);
    fs.appendFile(logFile, message + '\n', (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
};

// middleware function
const logger = (req, res, next) => {
    res.on('finish', () => {
        const logMessage = `${getTimestamp()} ${req.method} ${req.originalUrl}`;
        writeToFile(logMessage);
    });
    next();
};

// custom log function
logger.log = (...args) => {
    const logMessage = `${getTimestamp()} ${args.join(' ')}`;
    writeToFile(logMessage);
};

module.exports = logger;
