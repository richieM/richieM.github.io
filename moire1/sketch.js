
/*
Richie Mendelsohn
Colorful moire patterns with lines
18/1/16
*/

function setup() {
  createCanvas(windowWidth,windowHeight);
  strokeWeight(1);
  numLinesSlider = createSlider(1,120,randNum(1,120));
  numLinesSlider.position(10,10);
  numLinesSlider.style('width', '80px');
  
  opacitySlider = createSlider(0,255,randNum(0,255));
  opacitySlider.position(10,30);
  opacitySlider.style('width', '80px');
  
  colorSlider = createSlider(0,255,randNum(0,255));
  colorSlider.position(10,50);
  colorSlider.style('width', '80px');
  
  colorButtonState = 0;
  button = createButton('click me plz <3');
  button.position(10,70);
  button.mousePressed(buttonPressed);
}

function draw() {

  /*
  Here's the idea. Take the mouse cursor position and just draw lines from the
  cursor to a predefined area along a line or something
  */

  currentX = 0;
  currentY = 0;
  background(255,255,255,opacitySlider.value()); // clean up background
  
  for (i = 0; i < numLinesSlider.value(); i+= 1) {
    if (colorButtonState == 3) { // fully automated
      /*
      Introduce automated properties for the screen
      Qualities that can be automated:
      -- the location of the cursor -- by tracing a mathematical function
      -- the number of lines
      -- the opacity
      -- if i wanna get crazy fancy, the locations of the lines

      Once I've done this, I could possibly refactor this into the line(...) code 
      below so it's not all redundant shit.
      */


    } else { // not automated
      if (colorButtonState == 0) {
        stroke(getRed(i/numLinesSlider.value()), getBlue(i/numLinesSlider.value()), getGreen(i/numLinesSlider.value()));
      } else if (colorButtonState == 1) {
        stroke(randNum(0,255), randNum(0,255), randNum(0,255));
      } else if (colorButtonState == 2) {
        stroke(0,0,0);
      }
      
      
      line(currentX, 0, mouseX, mouseY); // top of screen, follow cursor
      line(currentX, 0, map(mouseY, 0, windowHeight, 0, windowWidth), map(mouseX, 0, windowWidth, 0, windowHeight)); // top of screen, cursor flipped
      
      line(currentX, windowHeight, mouseX, mouseY); // bottom of screen, follow cursor
      line(currentX, windowHeight, map(mouseY, 0, windowHeight, 0, windowWidth), map(mouseX, 0, windowWidth, 0, windowHeight)); // bottom of screen, cursor flipped
      
      line(0, currentY, mouseX, mouseY); // left side of screen, follow cursor
      line(0, currentY, map(mouseY, 0, windowHeight, 0, windowWidth), map(mouseX, 0, windowWidth, 0, windowHeight)); // left side of screen, cursor flipped
      
      line(windowWidth, currentY, mouseX, mouseY); // right side of screen, follow cursor
      line(windowWidth, currentY, map(mouseY, 0, windowHeight, 0, windowWidth), map(mouseX, 0, windowWidth, 0, windowHeight)); // right side of screen, cursor flipped
      
      currentX += windowWidth / numLinesSlider.value();
      currentY += windowHeight / numLinesSlider.value();
    } 
  }
}

function moireVisualization() {
  currentX = 0;
  currentY = 0;
  background(0,0,0,opacity; // clean up background
  
  for (i = 0; i < numLinesSlider.value(); i+= 1) {
    if (colorButtonState == 3) { // fully automated
      /*
      Introduce automated properties for the screen
      Qualities that can be automated:
      -- the location of the cursor -- by tracing a mathematical function
      -- the number of lines
      -- the opacity
      -- if i wanna get crazy fancy, the locations of the lines

      Once I've done this, I could possibly refactor this into the line(...) code 
      below so it's not all redundant shit.
      */


    } else { // not automated
      if (colorButtonState == 0) {
        stroke(getRed(i/numLinesSlider.value()), getBlue(i/numLinesSlider.value()), getGreen(i/numLinesSlider.value()));
      } else if (colorButtonState == 1) {
        stroke(randNum(0,255), randNum(0,255), randNum(0,255));
      } else if (colorButtonState == 2) {
        stroke(0,0,0);
      }
      
      
      line(currentX, 0, mouseX, mouseY); // top of screen, follow cursor
      line(currentX, 0, map(mouseY, 0, windowHeight, 0, windowWidth), map(mouseX, 0, windowWidth, 0, windowHeight)); // top of screen, cursor flipped
      
      line(currentX, windowHeight, mouseX, mouseY); // bottom of screen, follow cursor
      line(currentX, windowHeight, map(mouseY, 0, windowHeight, 0, windowWidth), map(mouseX, 0, windowWidth, 0, windowHeight)); // bottom of screen, cursor flipped
      
      line(0, currentY, mouseX, mouseY); // left side of screen, follow cursor
      line(0, currentY, map(mouseY, 0, windowHeight, 0, windowWidth), map(mouseX, 0, windowWidth, 0, windowHeight)); // left side of screen, cursor flipped
      
      line(windowWidth, currentY, mouseX, mouseY); // right side of screen, follow cursor
      line(windowWidth, currentY, map(mouseY, 0, windowHeight, 0, windowWidth), map(mouseX, 0, windowWidth, 0, windowHeight)); // right side of screen, cursor flipped
      
      currentX += windowWidth / numLinesSlider.value();
      currentY += windowHeight / numLinesSlider.value();
    } 
  }
}

function randNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buttonPressed() {
  colorButtonState += 1;
  colorButtonState %= 3;
}

function getRed(percent) {
  sliderVal = colorSlider.value()
  if (sliderVal < 60) {
    return 255 - percent * sliderVal;
  } else if (sliderVal > 170) {
    return 168 + (255 - sliderVal) * percent;
  } else {
    return randNum(120,220);
  }
}

function getGreen(percent) {
  sliderVal = colorSlider.value()
  if (sliderVal < 128) {
    return sliderVal + percent * 128;
  } else {
    return sliderVal - percent * 128;
  }
}

function getBlue(percent) {
  sliderVal = colorSlider.value()
  if (sliderVal < 128) {
    return 255 - (sliderVal * percent * 2);
  } else {
    return sliderVal * percent;
  }
}