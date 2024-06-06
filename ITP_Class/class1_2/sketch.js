

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  dMax = 200;
  dMin = 100;
  theD = 100;
  dDir = 1;
}

function draw() {
  background(0);

  const offsetX = frameCount/25;

  for (let i=0; i<width; i++) {
    const r = map(sin(i/10+offsetX*2), -1, 1, 0, 255)
    const g = map(sin(i/13+offsetX*3), -1, 1, 0, 255)
    const b = map(sin(i/9+offsetX*4), -1, 1, 0, 255)
    const x = i;
    const amp = 100;
    const offsetY = amp*sin(i/50);
    const y = height/2 + offsetY;
    fill(r,g,b);
    noStroke();
    ellipse(x,y,randNum(100,200),randNum(75,225));

    /*
    if theD > dMax {
      dDir = -1
    }
    if theD < dMin {
      dDir = 1
    }

    theD += dDir
    */
  }
}

function keyPressed() {
  if (key === 'c') {
    background(0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function randNum(min, max) {
	return Math.random() * (max - min) + min;
}
