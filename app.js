const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./database/connectDB')





connectDB()

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(express.json())
app.use('/app/v1/room', require('./routes/RoomRoutes') )

function debounce(func, delay) {
    let timerId;
    return function(...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

io.on('connection', (socket) => {

    const debouncedCodeEditor = debounce((code) => {
        io.to(room).emit('codeEditor', code);
        socket.broadcast.emit('codeEditor', code);
    }, 300);
    const debouncedWhiteBoard = debounce((elements) => {
        io.to(room).emit('whiteBoard', elements);
        socket.broadcast.emit('whiteBoard', elements);
    }, 300);

    let room = '';
    socket.on('codeEditor', (code) => {
        debouncedCodeEditor(code);
    });

    socket.on('roomCreate', (code) => {
        console.log(code);
        room = code;
    });

    socket.on(`joinRoom`, (code) => {
        socket.join(code);
        socket.emit('roomJoined', (code) => {
            console.log(`user Joined at ${code}`);
        });
    });

    socket.on('whiteBoard', (elements)=>{
        debouncedWhiteBoard(elements)
    })

    socket.on('whiteBoard', (data) => {
        debouncedWhiteBoard(data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
