//STEP 4. Client-side socket connection
let socket = io();
let r;
let g;
let b;

socket.on('connect', () =>{
  console.log('Connected');
});

//STEP 8. Listen for data from the server
socket.on('draw-data', (data) => {
  console.log(data);
  drawObj(data);
});

//STEP 1. Set up basic app functionality
function setup(){
  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("canvas-container");
  background(255);

  r = random(255);
  g = random(255);
  b = random(255);
}

function mouseMoved(){
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

function drawObj(pos){
  fill(pos.red, pos.green, pos.blue);
  ellipse(pos.x, pos.y, 30);
}
