const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./database/connectDB')
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');





connectDB()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use('/app/v1/room', require('./routes/RoomRoutes'))
app.use('/app/v1/user', require('./routes/UserRoutes'))


function debounce(func, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

let rooms = {}

io.on('connection', (socket) => {

    const debouncedCodeEditor = debounce(({id, code}) => {
        socket.to(id).emit('codeEditor', code);
    },0);
    const debouncedWhiteBoard = debounce((elements) => {
        io.to(room).emit('whiteBoard', elements);
        socket.broadcast.emit('whiteBoard', elements);
    }, 300);

    let room = null;
    socket.on('codeEditor', (code) => {
        debouncedCodeEditor(code);
    });

    socket.on('roomCreate', (code) => {
        socket.join(code);
    });

    socket.on('userAllowed', ({code, user})=>{
        console.log(user)
        io.to(code).emit('userAllowed',code)
    })

    socket.on('whiteBoard', (elements) => {
        debouncedWhiteBoard(elements)
    })

    socket.on('whiteBoard', (data) => {
        debouncedWhiteBoard(data);
    });
    socket.on('permissionToJoin', ({code, userInfo}) => {
        io.to(code).emit('permissionToJoin', userInfo);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
