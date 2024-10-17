const http = require('http');
const express = require('express');
const {Server: SocketServer} = require('socket.io');
const cors = require('cors');
const pty = require('node-pty');
const path = require('path');
const fs = require('fs/promises');

const ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: path.join(__dirname, 'client'),
    env: process.env
});

const app = express();
app.use(cors());
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

const io = new SocketServer({
    cors: '*',
});

io.attach(server);

ptyProcess.onData((data)=>{
    io.emit('terminal:output', data);
});

io.on('connection', (socket)=>{
    console.log('New connection', socket.id);

    socket.on('terminal:input', (data)=>{
        ptyProcess.write(data);
    })
})

server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});