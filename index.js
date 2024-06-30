const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./database/connectDB');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ExpressPeerServer } = require('peer');

connectDB();

const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());

const io = new Server(server, {
    cors: corsOptions
});

const peerServer = ExpressPeerServer(server, {
    debug: true,
});

// Explicitly set headers middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/app/v1/room', require('./routes/RoomRoutes'));
app.use('/app/v1/task', require('./routes/TaskRoute'));
app.use('/app/v1/user', require('./routes/UserRoutes'));
app.use('/app/v1/room/meeting', peerServer);

function debounce(func, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

io.on('connection', (socket) => {
    console.log('A user connected');

    const debouncedCodeEditor = debounce(({ roomId, editorId, code }) => {
        socket.to(editorId).emit('codeEditor', { roomId, editorId, code });
    }, 200);

    const debouncedTextEditor = debounce(({ roomId, editorId, content }) => {
        socket.to(editorId).emit('textEditor', { roomId, editorId, content });
    }, 200);

    socket.on('codeEditor', ({ roomId, editorId, code }) => {
        debouncedCodeEditor({ roomId, editorId, code });
    });

    socket.on('textEditor', ({ roomId, editorId, content }) => {
        debouncedTextEditor({ roomId, editorId, content });
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
        console.log('User connected to editor:', code);
    });

    socket.on('updateNotification', (code) => {
        io.to(code).emit('updateNotification');
    });

    socket.on('userAllowed', ({ code, roomId }) => {
        io.to(code).emit('userAllowed', { code, roomId });
    });

    socket.on('updateRequests', (code) => {
        io.to(code).emit('updateRequests', code);
        console.log('Emitted server updateRequests for room:', code);
    });

    socket.on('joinedMeet', ({ roomId, userId }) => {
        socket.join(roomId);
        socket.to(roomId).emit('newJoinee', userId);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
