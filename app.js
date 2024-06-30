const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./database/connectDB')
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { ExpressPeerServer } = require('peer');





connectDB()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
    origin: "*",
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use('/app/v1/room', require('./routes/RoomRoutes'))
app.use('/app/v1/task', require('./routes/TaskRoute'))
app.use('/app/v1/user', require('./routes/UserRoutes'))
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

    // Debounced functions for emitting events
    const debouncedCodeEditor = debounce(({ roomId, editorId, code }) => {
        socket.to(editorId).emit('codeEditor', { roomId, editorId, code });
    }, 200);

    const debouncedTextEditor = debounce(({ roomId, editorId, content }) => {
        socket.to(editorId).emit('textEditor', { roomId, editorId, content });
    }, 200);

    // Socket event listeners
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
        console.log('user joined')
    });
    socket.on('connectEditor', (code) => {
        socket.join(code);
        console.log('user conected')
    });

    socket.on('updateNotification', (code) => {
        io.to(code).emit('updateNotification')
    })

    socket.on('userAllowed', ({ code, roomId }) => {
        io.to(code).emit('userAllowed', { code, roomId })
    })

    socket.on('updateRequests', (code) => {
        io.to(code).emit('updateRequests', code);
        console.log('emmited server')
    })

    socket.on('joinedMeet', ({roomId, userId})=>{
        socket.join(roomId)
        socket.to(roomId).emit('newJoinee', userId)
    })


    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
