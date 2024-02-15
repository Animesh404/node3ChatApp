import express from 'express';
import { createServer } from 'http'; 
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateMessage, generateLocationMessage } from './utils/messages.js';
import { addUser, removeUser, getUser, getUsersInRoom } from './utils/users.js';
import Filter from 'bad-words';

const app = express();
const server = createServer(app); // Create HTTP server
const io = new Server(server, { // Attach WebSocket server to HTTP server
    cors: {
        origin: "*",
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });
        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        // Emit roomData event when a user joins
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        // Emit welcome message
        socket.emit('message', generateMessage('Admin', 'Welcome!'));
        // Broadcast message to others in the room
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));

        callback();
    });

    // Handle other events like sendMessage, sendLocation, and disconnect
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        if (!user) {
            return callback('User not found. Please join a room first.');
        }

        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!');
        }

        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        if (!user) {
            return callback('User not found. Please join a room first.');
        }

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}!`);
});