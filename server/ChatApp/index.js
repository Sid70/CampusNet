const express = require("express");
const app = express();
const { Server } = require("socket.io");
const cors = require("cors");
const http = require('http');

app.use(cors());

const ChatApp = async (req, res) => {
    const socketIo = require('socket.io');

    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('join-room', (data) => {
            socket.join(data.roomId);
            socket.to(data.roomId).emit('user-joined', { userId: data.userId });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}

module.exports = ChatApp;