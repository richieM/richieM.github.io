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
  background(51, 0, 0);
}

function draw() {
  //rect(x,y,width,height)
  //ellipse(x,y,width,height)

  numShapes = 100;

  textSize(50);
  fill(random(0,255), random(0,255), random(0,255));
  text("Ain't nobody got time for their shit getting fucked fast", 0, 1*windowHeight/3);
  text("- Katie S", windowWidth/2, 2*windowHeight/3);

  text("Should all of our communication be through this website now?", 0, 5*windowHeight/6);

  text("DAYUM GIRL YOU FLY", random(0,windowWidth), random(0, windowHeight));

}


function randNum(min, max) {
	return Math.random() * (max - min) + min;
}
