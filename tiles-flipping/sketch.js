var numTilesX = 5;
var numTilesY = 5;
var rotationRate = 30;
var timer;
var wasThereAClick = false; // TODO this only allows one click


var grid; // x by y 2d array of Tiles
var rotatingTiles; // array of Tiles that are rotating!


// We call this once at initialization to set stuff up
function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  // Initialize all the tiles -- nested for loops
  // new Tile(x, y, rotationRate)
}

// this is called like 60x / second
function draw() {
  background(200,100,210,80);

  // On first mouse click, initialize clicked tile
  if (mousePressed && (wasThereAClick == false)) {
    /*
    Figure out which tile was clicked:

    mousePressedX
    mousePressedY
    mousemap(mouseClickedX, windowWidth, windowHeight, numTilesX, numtilesY);
    map(mouseClickedX, windowWidth, windowHeight, numTilesX, numtilesY);
    
    x is something
    y is something

    clickedTile = grid[x][y]);

    */

    clickedTile.amIRotating = true;

    rotatingTiles.push(grid[x][y]); // add clicked tile
    wasThereAClick = true; // we had our one click!

    startTimer();
  }

  // Do we want to rotate new tiles?
  if (timer == 0) {
    /* tell next tiles to rotate
    3,3 -> 3,4   2,4   2,3   4,3
  
    this.amIRotating = true;
    if (specificTile.haveIRotted == false) {
      specificTile.amIRotating = true;
    }
    */    
  }

  if (wholeGridHasRotated()) {
    wasThereAClick = false;
  }

  // Draw The Grid
  for (var i = 0; i < numTilesX; i++) {
    for (var j = 0; j < numTilesY; j++) {
      grid[i][j].draw();
    }
  }

}

function startTimer() {
  // TODO how to do timing in javascript
  timer = rotationRate;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}