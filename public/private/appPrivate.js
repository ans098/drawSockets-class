//STEP 4. Client-side socket connection
let socket = io('/private');
let r;
let g;
let b;

window.addEventListener('load', () => {
  let roomName = window.prompt('Enter room name');
  console.log(roomName);

  //send room name to server
  socket.emit('room-name', { room: roomName });
});

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('joined', (data) => {
  console.log(data.msg);
})

//STEP 8. Listen for data from the server
socket.on('draw-data', (data) => {
  console.log(data);
  drawObj(data);
});

//STEP 1. Set up basic app functionality
function setup() {
  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("canvas-container");
  background(255);

  r = random(255);
  g = random(255);
  b = random(255);
}

function mouseMoved() {
  //data object
  let mousePos = {
    x: mouseX,
    y: mouseY,
    "red": r,
    "green": g,
    "blue": b
  }
  //console.log(mousePos);
  //STEP 5. emit the data
  socket.emit('data', mousePos);
}

function drawObj(pos) {
  fill(pos.red, pos.green, pos.blue);
  ellipse(pos.x, pos.y, 30);
}
