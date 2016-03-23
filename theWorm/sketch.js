/*
Richie Mendelsohn
Digiriddledoo - Makeymakey Moire magic Speed / Memory collab make friends game
3/21/16
*/

/*
TODO:)
- Memory
  - Visualizations when user is picking
  - Show letters during animations (for now)...
  - Speed up demo when there's more moves, and like slow the pace down as it gets to the end...
- Speed
  - Do I want it to be a countdown? or rather that it times you to finish and then shows your score
    so you can compete with your friends
- Overall
  - Leaderboards perhaps?
  - Doper visualizations brainstorming...
  - Test with actual makey makey :)
  - Reprogram makey makey for the buttons to not be o/p/q/v
  - Putting in basic sounds
  - Recording new sounds!
*/


// General game vars
var spotCodes = ['o', 'p', 'q', 'v'];
var currComputerPick;
var theFrameRate;
var currGameState = 'hanging_out'; // hanging_out, in_speed_game, in_memory_game, user_lost

// Speed game vars
var speedGuessingTimeMillis;
var millisSinceLastMove = 0;
var hourGlassCoeff; // for draining visuals
var lastGuess = '';

// Memory mode variables
var computerMoves = [];
var memoryGameState; // demo, user_guessing
var memoryGameDemoCounter;
var demoMoveLength = 1500;
var currMoveCounter = 0;

function setup() {
  createCanvas(windowWidth,windowHeight);
  speedGuessingTimeMillis = 4000;
  theFrameRate = 40;
  strokeWeight(1);
  frameRate(theFrameRate);
}

function draw() {
  background(0,0,0,30);

  if (currGameState == "in_speed_game") {
    
    //  If user just guessed, check his entry...
    if (lastGuess != '') { 
      if (lastGuess === currComputerPick) {
        console.log('w00t! Good job:', lastGuess);
        millisSinceLastMove = 0;
        currComputerPick = chooseASpot();
      } else {
        console.log('Incorrect!', lastGuess);
      }
      lastGuess = '';
    }

    // Update visuals based on the computer's pick
    if (currComputerPick === 'o') {
      fill(255,0,0);
      triangle(windowWidth/2, windowHeight, hourGlassCoeff*windowWidth/2, windowHeight, hourGlassCoeff*windowWidth/2, hourGlassCoeff*windowHeight);
    } else if (currComputerPick === 'p') {
      fill(0,255,0);
      triangle(windowWidth/2, windowHeight, hourGlassCoeff*windowWidth/2, hourGlassCoeff*windowHeight, windowWidth/2, hourGlassCoeff*windowHeight);
    } else if (currComputerPick === 'q') {
      fill(0,0,255);
      triangle(windowWidth/2, windowHeight, windowWidth/2, hourGlassCoeff*windowHeight, windowWidth - hourGlassCoeff * (windowWidth/2), hourGlassCoeff*windowHeight);
    } else if (currComputerPick === 'v') {
      fill(100,200,30);
      triangle(windowWidth/2, windowHeight, windowWidth - hourGlassCoeff * (windowWidth/2), hourGlassCoeff*windowHeight, windowWidth - hourGlassCoeff*windowWidth/2, windowHeight);
    }


    // Has user run out of time?
    millisSinceLastMove += ( 1 / theFrameRate * 1000);
    hourGlassCoeff = millisSinceLastMove / speedGuessingTimeMillis;
    console.log(millisSinceLastMove);

    // If user is out of time, they lose.
    if (millisSinceLastMove > speedGuessingTimeMillis) {
      currGameState = "user_lost";
      lastGuess = '';
      millisSinceLastMove = 0;
    }
  } else if (currGameState === "in_memory_game") {

    if (memoryGameState === "demo") { // Demo moves to user
      memoryGameDemoCounter += (1 / theFrameRate * 1000);
      console.log(memoryGameDemoCounter);
      if (memoryGameDemoCounter < demoMoveLength) {
        currMove = computerMoves[currMoveCounter];
        if (currMove === 'o') {
          fill(255,0,0);
          triangle(windowWidth/2, windowHeight, 0, windowHeight, 0, 0);

          fill(255);
          textSize(80);
          text("o", windowWidth/6, windowHeight/3);
        } else if (currMove === 'p') {
          fill(0,255,0);
          triangle(windowWidth/2, windowHeight, 0, 0, windowWidth/2, 0);

          fill(255);
          textSize(80);
          text("p", 2*windowWidth/6, windowHeight/3);
        } else if (currMove === 'q') {
          fill(0,0,255);
          triangle(windowWidth/2, windowHeight, windowWidth/2, 0, windowWidth, 0);

          fill(255);
          textSize(80);
          text("q", 4*windowWidth/6, windowHeight/3);
        } else if (currMove === 'v') {
          fill(100,200,30);
          triangle(windowWidth/2, windowHeight, windowWidth, 0, windowWidth, windowHeight);

          fill(255);
          textSize(80);
          text("v", 5*windowWidth/6, windowHeight/3);
        }
      } else { // curr move demo counter is over
        currMoveCounter++;
        if (currMoveCounter < computerMoves.length) {
          memoryGameDemoCounter = 0;
        } else {
          currMoveCounter = 0;
          memoryGameState = 'user_guessing';
          lastGuess = '';
        } 
      }
    } else if (memoryGameState == 'user_guessing') { // User is guessing now
      if (lastGuess != '') { 
        if (lastGuess === computerMoves[currMoveCounter]) {
          console.log('w00t! Good job:', lastGuess);
          currMoveCounter++;
          if (currMoveCounter == computerMoves.length) { // guessing round complete!
            console.log("adding a move");
            computerMoves.push(chooseASpot());
            memoryGameState = "demo";
            memoryGameDemoCounter = 0;
            currMoveCounter = 0;
          }
        } else {
          console.log('Incorrect!', lastGuess);
          currGameState = 'user_lost';
          computerMoves = [];
        }
        lastGuess = '';
      }
    } 
  } else if (currGameState == "not_playing") {
    background(200,100,30);
    textSize(32);
    text("Waiting for Player...Press z to play", windowWidth/6, windowHeight/2);
  } else if (currGameState == "user_lost") {
    background(200,100,30);
    textSize(32);
    text("Oops, you lose!!!!!!", windowWidth/6, windowHeight/3);
    text("Press z to play Speed, Press x to play Memory", windowWidth/6, windowHeight/2);
  } else if (currGameState == 'hanging_out') {
      background(140,40,200);
      textSize(40);
      text("Welcome!", windowWidth/6, windowHeight/3);
      text("Press z to play Speed, Press x to play Memory", windowWidth/6, windowHeight/2);
  }
}

// Play fun sounds in hurrr!!!
function keyTyped() {
  if (key === 'z') { // Let's play in_speed_game
    if (currGameState == "hanging_out" || currGameState == 'user_lost') {
      currGameState = "in_speed_game";
      currComputerPick = chooseASpot();
      // play a sound?
    }
  } else if (key === 'x') { // Let's play in_memory_game
    if (currGameState == "hanging_out" || currGameState == 'user_lost') {
      currGameState = "in_memory_game";
      computerMoves.push(chooseASpot());
      memoryGameState = "demo";
      memoryGameDemoCounter = 0;
      currMoveCounter = 0;
    }
  } else if (key === 'o') {
    lastGuess = key;
    // play a sound?
  } else if (key === 'p') {
    lastGuess = key;
    // play a sound?
  } if (key === 'q') {
    lastGuess = key;
    // play a sound?
  } if (key === 'v') {
    lastGuess = key;
    // play a sound?
  } else {
    lastGuess = key;
  }
}

function chooseASpot() {
  /* 
  Choose a spot amongst the x buttons
  Could be expanded with difficulty
    - dont choose the same spot twice
    - choose spots far away from each other
  */
  computerPick = spotCodes[Math.floor(Math.random() * spotCodes.length)];
  console.log("Computer picks", computerPick); 

  return computerPick;
}


// *****************
// UTILITY FUNCTIONS
