//STEP 2.
//Express
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log("Server is listening at: " + port);
});

//STEP 3. Socket connection
let io = require('socket.io');
io = new io.Server(server);

//Establish socket connection
io.sockets.on('connection', (socket) => {
  console.log("We have a new client: " + socket.id);

  //STEP 6. Listen for data
  socket.on("data", (data) =>{
    console.log(data);

    //send to all clients, including myself
    io.sockets.emit('draw-data', data);
  });

  socket.on('disconnect', () =>{
    console.log('Client disconnected: ' + socket.id);
  });
});

//private namespace connection
let private = io.of('/private'); //create private namespace

//Establish socket connection
private.on('connection', (socket) => {
  console.log("We have a new client: " + socket.id);

  //listen for room name
  socket.on('room-name', data=> {
    console.log(data);

    //add socket to room
    socket.join(data.room);

    //add room property to socket object
    socket.room = data.room;
    // console.log(socket);

    //send a welcome message to new clients
    let welcomeMessage = "Welcome to '" + data.room + "' room!"
    // private.to(socket.room).emit('joined', {msg: welcomeMessage}); //only sends message to those who joined the room
    socket.emit('joined', {msg: welcomeMessage}); //only sends message to new peopel who join room

  });

  //STEP 6. Listen for data
  socket.on("data", (data) =>{
    console.log(data);

    //send to only clients on private server in their specific room and not all private rooms
    private.to(socket.room).emit('draw-data', data);
    //private.emit('draw-data', data); sends data to all private rooms
  });

  socket.on('disconnect', () =>{
    // console.log('Client disconnected: ' + socket.id);
    console.log('Client: ' + socket.id + 'disconnected and left room: ' + socket.room);

    //es6 syntax
    console.log(`Client ${socket.id} disconnected and left room: ${socket.room}`);

    //also leave room 
    socket.leave(socket.room);
  });
});
