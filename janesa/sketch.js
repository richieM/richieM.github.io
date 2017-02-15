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
  frameRate(8);
  background(233,65,171);
}

function draw() {
  textSize(randNum(15,70));
  fill(randNum(0,255), randNum(0,255), randNum(0,255))
  text("JANESA how'd you get so fly?", random(0,windowWidth), random(0, windowHeight));
  text("JANESA MMMhmmmmMMM GET DAT TAT", random(0,windowWidth), random(0, windowHeight));
  text("JANESA Happy Valentine's Day JANESA!", random(0,windowWidth), random(0, windowHeight));
  text("<3 janesa <3 richie <3 janesa <3", random(0,windowWidth), random(0, windowHeight));
}


function randNum(min, max) {
	return Math.random() * (max - min) + min;
}
