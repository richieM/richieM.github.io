var numBubbles = 100;
var bubbles = [];

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);

  for (var i = 0; i < numBubbles; i++) {
    bubbles.push(new Bubble());
  }
}

function draw() {
  background(200,100,210);

  for (var i=0; i < bubbles.length; i++) {
    bubbles[i].display();
    bubbles[i].move();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}