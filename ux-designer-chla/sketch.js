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

let img;
const chlaFile = "CHLA_PIC_local_v0.png";

function preload() {
  img = loadImage(chlaFile);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(0);
  frameRate(4);
}

function draw() {
  //rect(x,y,width,height)
  //ellipse(x,y,width,height)
  numShapes = 100;

  background(randNum(0,255),randNum(0,255),randNum(0,255));
  fill(randNum(0,255),randNum(0,255),randNum(0,255));
  //quad(20,20,40,40,20,40,40,20);
  for (i = 0; i < numShapes; i++) {
  	rect(randNum(0,windowWidth), randNum(0,windowHeight),
  		 randNum(0,100), randNum(0,100));
  	ellipse(randNum(0,windowWidth), randNum(0,windowHeight),
  		 randNum(0,100), randNum(0,100));
  	fill(randNum(0,255),randNum(0,255),randNum(0,255));
  }

  num_chlas = 100;
  for (i = 0; i < num_chlas; i++) {
      imageMode(CENTER);

    push();
    translate(randNum(0, width), randNum(0, height));
    rotate(randNum(0, TWO_PI));
    image(img, 0, 0, randNum(50,350), randNum(50,350));
    pop();
  }


  textSize(80);
  fill(0,0,0);
  text('Richie Mendelsohn', 0, windowHeight/3);
  text('Successful UX Designer', 0, 2*windowHeight/3);
  text('HI KAILEY!!!!', 0, 5*windowHeight/6);
}


function randNum(min, max) {
	return Math.random() * (max - min) + min;
}
