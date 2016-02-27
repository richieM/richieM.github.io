/*
Author: Richie Mendelsohn

Lines emanating down like a magic rainbow

TODO:
- something cool with RGB, where its like a magic rainbow slider coming thru the
happy color land
*/



function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(0);

  frameRateSlider = createSlider(.2,60,12);
  frameRateSlider.position(windowWidth-90,10);
  frameRateSlider.style('width', '80px');
}

function draw() {
  // TODO Idea 1: save the color states and then make them revolve?

  // TODO Idea 2: do a color rainbow, just make the RGB flip from 0 to 255 over that chunk value

  //rect(x,y,width,height)
  //ellipse(x,y,width,height)
  //triangle(x1,y1,x2,y2,x3,y3)
  frameRate(frameRateSlider.value());

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
