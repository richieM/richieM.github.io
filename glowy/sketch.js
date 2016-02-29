/*
Author: Richie Mendelsohn
Date: 2/28/16

RGB Color Study 1: Simply navigating a color cube
Revolving up, right, down, left on an x-y-z cube

Axes:
x: red
y: green
z: blue
*/

var numLinesPerSide;
var currX;
var currY;
var currZ;
var direction;

var colorStep;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(0);

  numLinesPerSide = 30;
  currX = 0;
  currY = randNum(0,255); // start somewhere random on Y cuz it takes forever to cycle
  currZ = 0;
  direction = "up";

  frameRate(32);

  colorStepSlider = createSlider(.1,40,4);
  colorStepSlider.position(windowWidth-90,10);
  colorStepSlider.style('width', '80px');
}

function draw() {
  colorStep = colorStepSlider.value();

  currColor = getRGBFromColorSphere();
  background(currColor.red,currColor.green,currColor.blue);
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

  return {
    red: currX,
    green: currY,
    blue: currZ
  };
}
