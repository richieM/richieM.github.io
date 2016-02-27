// Crazy pixel shit
// Richie Mendelsohn 2/26/16 after a yoga nap

// Color Theory Stuff:
// consider the different Color Schemes here
// I could circle through the X related colors
// then randomly generate a new color and move from there
// http://www.colorpicker.com/db4c25

var done = false;
var increment = 6;
// var initialColors = [[153, 255, 104],
//                      [0, 102, 255],
//                      [255, 51, 204],
//                      [255,204,0],
//                      [204,0,0],
//                      [153,204,255]];
var initialColors = [[219, 76, 37],
                      [89, 219, 37],
                      [37, 180, 219],
                      [167,37,219]];
var currColors;


function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  strokeWeight(0);
  frameRate(2);
  currColors = initialColors[Math.floor(random(0,initialColors.length))];
}

function draw() {
  background(255,255,255,0);

  for (var x=0; x < windowWidth; x+=increment) {
    for (var y=0; y < windowHeight; y+=increment) {
      fill(weightedRandom(currColors[0],30,0,255), weightedRandom(currColors[1],30,0,255), weightedRandom(currColors[2],30,0,255));
      rect(x,y,increment,increment)
    }
  }
  console.log("done!");
  if (2*increment > windowWidth || 2*increment > windowHeight) {
    increment = 6;
    currColors = initialColors[Math.floor(random(0,initialColors.length))];
  } else {
    increment = Math.floor(increment*1.5);
  }
}

function weightedRandom(mean, stDev, min, max) {
    num = randomGaussian(mean, stDev);
    if (num < min) {
      return min;
    } else if (num > max) {
      return max;
    } else {
      return num;
    }
  }



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}