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
  //noLoop();
}

function draw() {
  // TODO Idea 1: save the color states and then make them revolve?

  // TODO Idea 2: do a color rainbow, just make the RGB flip from 0 to 255 over that chunk value

  //rect(x,y,width,height)
  //ellipse(x,y,width,height)
  //triangle(x1,y1,x2,y2,x3,y3)
  numShapes = 30;

  background(randNum(0,255),randNum(0,255),randNum(0,255));
  fill(randNum(0,255),randNum(0,255),randNum(0,255));
  //quad(20,20,40,40,20,40,40,20);
  lastX=0;
  widthChunk = windowWidth/numShapes;


  lastY=0;
  heightChunk = windowHeight/numShapes;
  for (i = 0; i < numShapes; i++) {
  	fill(randNum(0,255),randNum(0,255),randNum(0,255));
  	// along bottom edge
  	triangle(0,0,lastX,windowHeight,lastX+widthChunk,windowHeight);
  	// along right side
  	triangle(0,0,windowWidth,lastY,windowWidth,lastY+heightChunk);

  	lastX += widthChunk;
  	lastY += heightChunk;
  }
}


function randNum(min, max) {
	return Math.random() * (max - min) + min;
}
