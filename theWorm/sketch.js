/*
Richie Mendelsohn
Remember Your Friends - Makeymakey Moire magic Speed / Memory collab make friends game
3/21/16
*/

/*
TODO:)

- Keep it simple, stupid! <KISS>
- [P0] Memory
  - [P2[ Speed up demo when there's more moves, and like slow the pace down as it gets to the end...?
- Overall
  - Clear instructions
  - [P0] ** Developing a strong theme or aesthetic around the Game, and allowing that to influence
    the visual design decisions.
      - Connection...
  - [P1] Home screen
    - Leaderboards perhaps?
  - [P0] Doper visualizations brainstorming...
    - 4 Sketches for each station...?
      - Moire
      - Some bubbles thingy?
      - Hearts / Love
    - Visualizations when user is guessing can be Frame Difference or Line outline or both...
    - During the area visualizations, what can I do with the rest of the black space thats more exciting?
      Some sort of subtle line visualization or something, maybe Moire with like black grey lines or something...
      Or camera stuff ... Frame difference!!!!
    - Do I want a camera!?
    - A background sketch for Memory mode when you're waiting to guess
      - Something with camera? The Edge Detection sketch but fancied up?
      - Bubbles floating around
      - Lightning or something...
    - A home screen visualization that could maybe just be cycling through the 4 station viz's
  - [P0] Test with actual makey makey :)
  - [P0] Every 3rd(??) guess, pause for an activity...
  - [P1] Reprogram makey makey for the buttons to not be o/p/q/v
  - [P0] Putting in basic sounds
  - [P1] Recording new sounds!
*/

// Debug
var debug = true;

// General game vars
var spotCodes = ['a', 's', 'd', 'f'];
var spotColors = [[255,0,0], [0,255,0], [0,0,255], [100,200,230]]
var currComputerPick;
var theFrameRate;
var currGameState = 'hanging_out'; // hanging_out, in_memory_game, user_lost

// Visual vars
var opacity = 30;

// Speed game vars
var speedGuessingTimeMillis;
var millisSinceLastMove = 0;
var hourGlassCoeff; // for draining visuals
var lastGuess = '';

// Memory mode variables
var computerMoves = [];
var memoryGameState; // demo, user_guessing, user_just_guessed_right, round_complete

var memoryGameDemoCounter;
var demoMoveLength = 1000;

var userGuessVisualCounter = 0; // counter for showing user's guess
var userGuessMoveVisualLength = demoMoveLength/2;

var roundCompleteCongratsCounter = 0;
var roundCompleteCongratsLength = demoMoveLength;
var currMoveCounter = 0;

function setup() {
  createCanvas(windowWidth,windowHeight);
  speedGuessingTimeMillis = 4000;
  theFrameRate = 40;
  strokeWeight(1);
  frameRate(theFrameRate);
}

function draw() {
  background(0,0,0,opacity);

  if (currGameState == 'hanging_out') {
      background(140,40,200);
      textSize(40);
      text("Welcome!", windowWidth/6, windowHeight/3);
      text("Press z to play Speed, Press x to play Memory", windowWidth/6, windowHeight/2);
  } else if (currGameState === "in_memory_game") {
    if (memoryGameState === "demo") { // Demo moves to user
      memoryGameDemoCounter += (1 / theFrameRate * 1000);
      console.log(memoryGameDemoCounter);
      if (memoryGameDemoCounter < demoMoveLength) {
        currMove = computerMoves[currMoveCounter];
        if (currMove === spotCodes[0]) {
          visualizeMoire(0, spotColors[0], memoryGameDemoCounter/demoMoveLength);
        } else if (currMove === spotCodes[1]) {
          visualizeMoire(1, spotColors[1], memoryGameDemoCounter/demoMoveLength);
        } else if (currMove === spotCodes[2]) {
          visualizeMoire(2, spotColors[2], memoryGameDemoCounter/demoMoveLength);
        } else if (currMove === spotCodes[3]) {
          visualizeMoire(3, spotColors[3], memoryGameDemoCounter/demoMoveLength);
        }
      } else { // Current move demo is done, go to next move
        currMoveCounter++;
        if (currMoveCounter < computerMoves.length) {
          memoryGameDemoCounter = 0;
        } else {
          currMoveCounter = 0;
          memoryGameState = 'user_guessing';
          lastGuess = ''; // Clean the guess slate for any errant button presses
        } 
      }
    } else if (memoryGameState == 'user_guessing') { // Time for user to guess
      console.log('in user_guessing');
      if (lastGuess != '') { // If they just guessed...
        if (lastGuess === computerMoves[currMoveCounter]) {
          console.log('w00t! Good job:', lastGuess);
          memoryGameState = 'user_just_guessed_right'
        } else {
          console.log('Incorrect!', lastGuess);
          currGameState = 'user_lost';
          computerMoves = [];
        }
      } else {
        // TODO show something here...
        // Maybe show camera visualizations here?
        // Or at least say, your turn to guess...
      }
    } else if (memoryGameState == 'user_just_guessed_right') {
      // Show what they just guessed...
          userGuessVisualCounter += (1 / theFrameRate * 1000);
          console.log(userGuessVisualCounter);

          /// lastGuess could change if user hits something else, which would be sooo confusing for them
          theGuess = computerMoves[currMoveCounter];

          if (userGuessVisualCounter < userGuessMoveVisualLength) {
            if (theGuess === spotCodes[0]) {
              visualizeMoire(0, spotColors[0], userGuessVisualCounter/userGuessMoveVisualLength);
              // play audio
            } else if (theGuess === spotCodes[1]) {
              visualizeMoire(1, spotColors[1], userGuessVisualCounter/userGuessMoveVisualLength);
              // play audio
            } else if (theGuess === spotCodes[2]) {
              visualizeMoire(2, spotColors[2], userGuessVisualCounter/userGuessMoveVisualLength);
              // play audio
            } else if (theGuess === spotCodes[3]) {
              visualizeMoire(3, spotColors[3], userGuessVisualCounter/userGuessMoveVisualLength);
              // play audio
            }
          } else { // User Guess visualization is over... Go to next move
            userGuessVisualCounter = 0; // reset
            currMoveCounter++;

            // TODO: consider this logic.
            // Reset move here, so that anything typed during the user_just_guessed_right is wipped
            // Designed to prevent errant keystrokes or tweaky keystrokes or anything...
            lastGuess = ''; 

            if (currMoveCounter == computerMoves.length) { // guessing round complete!
              console.log("adding a move");
              computerMoves.push(chooseASpot());
              memoryGameState = 'round_complete';
              memoryGameDemoCounter = 0;
              currMoveCounter = 0;
            } else { // Not done guessing yet...
              memoryGameState = 'user_guessing';
            }
        }
    }
      else if (memoryGameState == 'round_complete') { // Successful round! Challenge or congrats
      roundCompleteCongratsCounter += (1 / theFrameRate * 1000);
      console.log(roundCompleteCongratsCounter)

      if (roundCompleteCongratsCounter < roundCompleteCongratsLength) {
        visualizeRoundComplete(); // TODO spruce this up!!
      } else {
        roundCompleteCongratsCounter = 0;
        memoryGameState = 'demo';
      }
    }
  } else if (currGameState == "user_lost") {
    background(200,100,30);
    textSize(32);
    text("Oops, you lose!!!!!!", windowWidth/6, windowHeight/3);
    text("Press z to play Speed, Press x to play Memory", windowWidth/6, windowHeight/2);
  }
}

function visualizeMoire(quadrant, colors, timeCoeff) {
  // Moire patterns for the positions
  // quadrant is from 0-3
  // colors is RGB array of length 3
  // TODO: make this dynamic and have the time passed in which affects a fxn which is cursor
  if (debug) {
    console.log('visualizeMoire');
  }

  currentX = quadrant * windowWidth/4;
  currentY = 0;

  posX = windowWidth/8 + (quadrant * (windowWidth/4));
  posY = timeCoeff * windowHeight; // Sweeps down screen
  background(0,0,0,opacity); // clean up background
  numLinesPerSide = 30;
  
  for (i = 0; i < numLinesPerSide; i+= 1) {
    stroke(weightedRandom(colors[0],40,0,255),
           weightedRandom(colors[1],40,0,255),
           weightedRandom(colors[2],40,0,255));
      
    line(currentX, 0, posX, posY); // top of screen, follow cursor   
    line(currentX, windowHeight, posX, posY); // bottom of screen, follow cursor
    line(quadrant*windowWidth/4, currentY, posX, posY); // left side of screen, follow cursor
    line((quadrant+1)*windowWidth/4, currentY, posX, posY); // right side of screen, follow cursor
    
    currentX += (windowWidth/4) / numLinesPerSide;
    currentY += windowHeight / numLinesPerSide;
  }

  textSize(60);
  text(spotCodes[quadrant], windowWidth/8 + (quadrant * (windowWidth/4)), windowHeight/3);
}

function visualizeRoundComplete() {
  // TODO spruce this up
  // TODO this doesn't work...
  background(0);
  textSize(40);
  fill(random(0,255), random(0,255), random(0,255));
  msg = "Awesome job! " + (computerMoves.length - 1) + "!!!! Adding a move :)"
  text(msg, windowWidth/6, windowHeight/3);
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
  } else if (spotCodes.indexOf(key) > -1) { // if 'key' is in spotCodes
    lastGuess = key;
    // play a sound
  } else {
    //lastGuess = key;
    // wtf key did you press?
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
