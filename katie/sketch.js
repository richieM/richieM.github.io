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
}

function draw() {
  //rect(x,y,width,height)
  //ellipse(x,y,width,height)
  background(randNum(12,35), randNum(240,255), randNum(120,140))
  numShapes = 100;

  textSize(50);
  fill(random(120,140),random(120,140),random(120,140));
  text("Ain't nobody got time for their shit getting fucked fast", 0, 1*windowHeight/3);
  text("- Katie S", windowWidth/2, 2*windowHeight/3);

}


function randNum(min, max) {
	return Math.random() * (max - min) + min;
}
