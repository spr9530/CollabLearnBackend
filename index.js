const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Import Server from socket.io, not socketIo
const connectDB = require('./database/connectDB');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ExpressPeerServer } = require('peer');

// Connect to MongoDB or any other database
connectDB();

// Initialize Express app and create HTTP server
const app = express();
const server = http.createServer(app);

// Set up CORS options
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

// Body parser setup
app.use(bodyParser.json());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    },
     path: '/socket.io',
});
console.log(io)

// Initialize PeerJS server
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

// Middleware setup

app.use('/app/v1/room', require('./routes/RoomRoutes'));
app.use('/app/v1/task', require('./routes/TaskRoute'));
app.use('/app/v1/user', require('./routes/UserRoutes'));
app.use('/app/v1/room/meeting', peerServer);

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Debounced functions for emitting events
    const debounceEmit = (eventName, payload) => {
        socket.broadcast.emit(eventName, payload);
    };

    socket.on('codeEditor', ({ roomId, editorId, code }) => {
        debounceEmit('codeEditor', { roomId, editorId, code });
    });

    socket.on('textEditor', ({ roomId, editorId, content }) => {
        debounceEmit('textEditor', { roomId, editorId, content });
    });

    socket.on('roomCreate', (code) => {
        socket.join(code);
    });

    socket.on('joinRoom', (code) => {
        socket.join(code);
        console.log('User joined room:', code);
    });

    socket.on('connectEditor', (code) => {
        socket.join(code);
        console.log('User connected to editor in room:', code);
    });

    socket.on('updateNotification', (code) => {
        io.to(code).emit('updateNotification');
    });

    socket.on('userAllowed', ({ code, roomId }) => {
        io.to(code).emit('userAllowed', { code, roomId });
    });

    socket.on('updateRequests', (code) => {
        io.to(code).emit('updateRequests', code);
        console.log('Emitted updateRequests to room:', code);
    });

    socket.on('joinedMeet', ({ roomId, userId }) => {
        socket.join(roomId);
        socket.to(roomId).emit('newJoinee', userId);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Define the port to listen on
const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
