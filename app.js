const { Server } = require('socket.io');
const http = require('http'); // Import the http module

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

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

    const debouncedCodeEditor = debounce((code) => {
        io.to(room).emit('codeEditor', code); socket.broadcast.emit('codeEditor', code);
    }, 300);

    let room = ''
    socket.on('codeEditor', (code) => {
        debouncedCodeEditor(code);
    });

    socket.on('roomCreate', (code) => {
        console.log(code);
        room = code;
    })

    socket.on(`joinRoom`, (code) => {
        socket.join(code)
        socket.emit('roomJoined', (code) => {
            console.log(`user Joined at ${code}`)
        })
    })





    const debouncedWhiteBoard = debounce((data) => {
        socket.broadcast.emit('whiteBoard', data);
    }, 300);

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
