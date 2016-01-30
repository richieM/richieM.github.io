var numBubbles = 151;
var bubbles = [];

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);

  for (var i = 0; i < numBubbles; i++) {
    bubbles.push(new Bubble());
  }
}

function draw() {
  background(200,100,210,80);

  for (var i=0; i < bubbles.length; i++) {
    bubbles[i].display();
    bubbles[i].move();
  }

  for (var i = bubbles.length-1; i >= 0; i--) {
      var abubble = bubbles[i];
      if (abubble.cursorOverBubble()) {
        bubbles.splice(i, 1);
      }
      
    }

    if(bubbles.length <= numBubbles){
        bubbles.push(new Bubble());
    }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}