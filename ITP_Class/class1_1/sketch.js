var maxRadius = 300
var radiusChange = 5
var radius = 100
function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  background(0,0,0,150);
}

function draw() {
  r = randNum(0,255);
  g = randNum(0,255);
  b = randNum(0,255);

  x = mouseX;
  y = mouseY;
  d = radius;

  if (mouseIsPressed){
    fill(r,g,b);
    ellipse(x,y,d,d);
  }


  radius += radiusChange

  if (radius > maxRadius) {
    radiusChange *= -1
  }
  if (radius < 0) {
    radiusChange *= -1
  }
}

function keyPressed() {
  if (key === 'c') {
    background(0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function randNum(min, max) {
	return Math.random() * (max - min) + min;
}
