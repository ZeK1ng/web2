
const server = require('http').createServer();
const io = require('socket.io')(server);
io.listen(8081);
console.log("listening");


const clients=[];
let connectedAmount = 0;

io.on('connection',(socket)=>{
    if(connectedAmount ===0 ){
        connectedAmount++;
        clients[0]=socket.id;
    }else if (connectedAmount ===1){
        connectedAmount++;
        clients[1]=socket.id;
    }else{
        socket.emit('spectating');
    }

    socket.on('playerEntered', (playerName)=>{
        socket.broadcast.emit('changeName',playerName);
    });

    socket.on('disconnect',()=>{
        if(socket.id === clients[0] || socket.id=== clients[1]){
            socket.emit('game over');
        }else{
            connectedAmount--;
            socket.emit('disconnected');
        }
    });


});