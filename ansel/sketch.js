// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 1-1: stroke and fill

/*
Basic idea here is to do lots of circles and 
squares that jsut float around

mm sounds complicated tho.  the movement stuff is
kinda hard, but would be good.

*/



function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(0);
  frameRate(15);
  background(random(0,255), random(0,255), random(0,255));
}

function draw() {
  //rect(x,y,width,height)
  //ellipse(x,y,width,height)

  numShapes = 100;

  textSize(50);
  fill(random(0,255), random(0,255), random(0,255));
  text("Have fun in the sauna, Ansel!", randNum(0, windowWidth), randNum(0, windowWidth));
}


function randNum(min, max) {
  return Math.random() * (max - min) + min;
}
