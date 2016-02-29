/*
Author: Richie Mendelsohn

lines-emanating combined with glowy!

RGB Color playing with different ways of navigating a color space
Think of a color cube.

Axes:
x: green
y: red
z: blue
*/

var numLinesPerSide;
var currX;
var currY;
var currZ;
var direction;

var colorBuffer;
var currBufferIndex;

var colorStep;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  numLinesPerSide = 60;
  currX = 0;
  currY = randNum(0,255); // start somewhere random on Y cuz it takes forever to cycle
  currZ = 0;
  colorStep = 2;
  direction = "up";

  colorBuffer = new Array(numLinesPerSide*2);
  currBufferIndex = numLinesPerSide*2 - 1;

  // Fill up buffer w initial colors
  for (var i = numLinesPerSide*2 - 1; i >= 0; i--) {
    colorBuffer[i] = getRGBFromColorSphere();
  }

  frameRate(30);

  colorStepSlider = createSlider(1,20,2);
  colorStepSlider.position(windowWidth-90,10);
  colorStepSlider.style('width', '80px');
}

function draw() {
  //rect(x,y,width,height)
  //ellipse(x,y,width,height)
  //triangle(x1,y1,x2,y2,x3,y3)
  //quad(20,20,40,40,20,40,40,20);

  colorStep = colorStepSlider.value(); 

  lastX=0;
  widthChunk = windowWidth/numLinesPerSide;

  lastY=windowHeight;
  heightChunk = windowHeight/numLinesPerSide;

  colorBuffer[currBufferIndex] = getRGBFromColorSphere();

  currCount = currBufferIndex;

  for (i = 0; i < numLinesPerSide*2; i++) {
    currColor = colorBuffer[currCount];
  	fill(currColor.red, currColor.green, currColor.blue);
    
    if (i < numLinesPerSide) { // along bottom edge
    	triangle(0,0,lastX,windowHeight,lastX+widthChunk,windowHeight);
      lastX += widthChunk;
    } else { // along right side
    	triangle(0,0,windowWidth,lastY,windowWidth,lastY-heightChunk);
      lastY -= heightChunk;
    }

    currCount = (currCount + 1) % (numLinesPerSide*2);
  }

  // update the circular buffer spot
  if (currBufferIndex == 0) {
    currBufferIndex = numLinesPerSide*2 - 1;
  } else {
    currBufferIndex--;
  }
}


function randNum(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function getRGBFromColorSphere() {
  switch (direction) {
    case "up":
      currZ = currZ + colorStep;
      if (currZ >= 255) {
        direction = "right";
        currZ = 255;
      }
      break;
    case "right":
      currX = currX + colorStep;
      if (currX >= 255) {
        direction = "down";
        currX = 255;
      }
      break;
    case "down":
      currZ = currZ - colorStep;
      if (currZ <= 0) {
        direction = "left";
        currZ = 0;
      }
      break;
    case "left":
      currX = currX - colorStep;
      if (currX <= 0) {
        direction = "up";
        currX = 0;
        currY = currY + colorStep; // move the Y over
        if (currY >= 255) {
          currY = 0; // reset the Y if we somehow get this far
        }
      }
      break;
  }
  console.log("currX: " + currX + " currY: " + currY + " currZ: " + currZ);

  // Switched this up here!
  return {
    green: currX,
    red: currY,
    blue: currZ
  };
}
