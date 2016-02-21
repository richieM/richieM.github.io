
/*
Richie Mendelsohn
Pick a random spot to put a sticker on your laptop!
*/

function setup() {
  createCanvas(windowWidth,windowHeight);
  strokeWeight(1);
  background(randNum(20,255),randNum(20,255),randNum(20,255),255);
  
  stickerSize = 75;
  doneYet = false; 
  textSize(32);
  text("Sticker Picker", windowWidth/3, windowHeight/10);
}

function draw() {
  if (doneYet == false){
    fill(randNum(0,255),randNum(0,255),randNum(0,255),255);
    ellipse(randNum(0,windowWidth), randNum(0,windowHeight), stickerSize, stickerSize);
    doneYet = true;
  }
}

function randNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}