
/*
Richie Mendelsohn
Pick a random spot to put a sticker on your laptop!
*/

var randomText;

function setup() {
  createCanvas(windowWidth,windowHeight);
  strokeWeight(1);
  background(randNum(20,255),randNum(20,255),randNum(20,255),255);
  
  stickerSize = 75;
  doneYet = false; 
  textSize(50);
  //text("Sticker Picker", randNum(20,windowWidth-300), randNum(32,windowHeight-32));
  randomText = ["I'm a nasty mofo",
                "I sometimes like the smell of my own farts",
                "I hate salads.",
                "You smell.",
                "I lose interest in girls if they like me",
                "I'm not sure I like you so much",
                "I put sriracha on everything",
                "I eat too much ramen."];
}

function draw() {

  if (doneYet == false){
    fill(randNum(0,255),randNum(0,255),randNum(0,255),255);
    // 
    text(randomText[randNum(0,randomText.length-1)], randNum(20,windowWidth/3), randNum(32,4*windowHeight/5));
    doneYet = true;
  }
}

function randNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}