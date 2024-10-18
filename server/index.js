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

async function getFileStructure(directory){
    const tree = {};

    async function readDir(dir, tree){
        const files = await fs.readdir(dir);

        for(const file of files){
            const filepath = path.join(dir, file);
            const stat = await fs.stat(filepath);

            if(stat.isDirectory()){
                tree[file] = {};
                await readDir(filepath, tree[file]);
            } else{
                tree[file] = null;
            }
        }
    }

    await readDir(directory, tree);
    return tree;
}

app.get('/files', async(req, res)=>{
    const tree = await getFileStructure('./client');
    return res.json(tree);
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