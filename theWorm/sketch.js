/*
Richie Mendelsohn
Remember Your Friends - Makeymakey Moire magic Speed / Memory collab make friends game
3/21/16
*/

/*
INTRO WORDS:
Make this game / activities unique ...
Separating this from any other game with the point to bomb wiht your teammate

Opening Text: - Remember Your Friends... - [Text on screen?] Grab a new
[friend / stranger / cutie / date / parent], hold hands,    with one of you
touching [the orange] and one of you touching [the apple]   (alternate text)
and form a human chain from the <orange> to the <banana>

- <Woot!!> [Audio with some text] Great job! Remember Your Friends is a teamwork memory game.  You'll see a series of choices 
  which you'll need to guess in order.  Always for a human-chain from the <orange> to the next item on the screen...

- Before we get started, take 30 seconds and introduce yourself to your partner...
- [Countdown timer sound thingy...]
- Great, let's get started.  Remember to pay attention!
- [Flash selection]
- [Special First Round instructions] ... Form a human chain with your partner from the orange to the item that was shown.
- !!!WOOOOOTT!!! AWESOME JOB. So you can remember one, let's add another, be sure to remember the order...

WORDS OF WISDOM:
- Keep it simple, stupid...


TODOS:
  - [P0] Clear instructions!!
    - ** Beginning flow, instructions and how you activate the game?
  - [P0] ** Developing a strong theme or aesthetic around the Game, and allowing that to influence
    the visual design decisions.
      - Connection...
      - [P0] What will the actual buttons be?

  Different Screens:
  - **Home Screen
    - TODO fix the text, it looks janky
  - ** Instructions -> First friendship prompt
    - Screen where rules are read...
       - Moire?
    - Screen for first friendship prompt...
      - Camera...??
      - What can I do that's not Camera, a chill Moire?
      - Countdown timer screen or something?
  - Demo screen [DONE]
  - User guessing screens
    - camera as background?
  - ** Partner activity screens
    - Camera as background?
  - **Loser screen
    - ??

  - [P1] Get camera stuff working
    - When User Is Guessing -- A background sketch for Memory mode when you're waiting to guess
    - Something with camera? The Edge Detection / Frame Difference sketch but fancied up
  - [P2] Leaderboard? Take a pic?
  - Brain dump ...  Doper visualizations brainstorming...
    - 4 Sketches for each station...?
      - Moire
      - Some bubbles thingy?
      - Hearts / Love
  - [P2] Speed up demo when there's more moves, and like slow the pace down as it gets to the end...
  - [P0] Better activity prompts for every 3rd guess...
    - Or Maybe like 3rd, 5th, 7th ...?
  - [P0] Putting in basic sounds
  - [P1] Do a timeout???

  - Physical / Tuesday
    - [P0] Buy longer wire and actually test out
    - [P1] Reprogram makey makey for the buttons to not be o/p/q/v
    - [P1] Recording new sounds!
    - [P0] Making sure speakers work / getting a new speaker wire
    - [P1] Can I get P5 working with a webcam?!
*/

// Debug
var debug = true;

// General game vars
var spotCodes = ['a', 's', 'd', 'f'];
var spotColors = [[255,0,0], [0,255,0], [0,0,255], [255,255,0]]
var currComputerPick;
var theFrameRate = 40;
var currGameState = 'hanging_out'; // hanging_out, in_memory_game, user_lost

// Visual vars
var opacity = 12;
var w;
var h;

// Memory mode variables
var computerMoves = [];
var memoryGameState; // demo, user_guessing, user_just_guessed_right, round_complete
var lastGuess = '';

// Home Screen
var homeScreen = new Object();

// Intro counters
var introViz = new Object();

// Moire vars
var moire = new Object();

// Demo counters
var memoryGameDemoCounter;
var demoMoveLength = 1000;

// Guess counters
var userGuessVisualCounter = 0; // counter for showing user's guess
var userGuessMoveVisualLength = demoMoveLength/2;

// Round complete counters
var roundCompleteCongratsCounter = 0;
var roundCompleteChallengeLength = 10000; // How long for the prompt?
var currMoveCounter = 0;

// Friendship questions
var friendPrompts = ["Make up a secret handshake",
                     "What's something you've never told your parents?",
                     "What was the worst part of your day?",
                     "What was the best part of your day?"];

var initialFriendPrompts = ["Learn your new friend's name!"];
var currFriendPrompt = '';

// Computer Vision stuff
var capture;
var buffer;
var result;

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(windowWidth,windowHeight);
  strokeWeight(1);
  frameRate(theFrameRate);

  resetIntroVars();
  resetMoireVars();
  //cameraSetup();
}

// Main function
function draw() {
  background(0,0,0,opacity);

  if (currGameState == 'hanging_out') {
      visualizeHomeScreen();
  } else if (currGameState === "in_memory_game") {
    if (memoryGameState === "intro") {
      introViz.overallCounter += (1 / theFrameRate * 1000);
      if (introViz.overallCounter < introViz.lengthOfTime) {
        visualizeIntro(); // handle specific screens in here
      } else {
        resetIntroVars();
        resetMoireVars();

        // Move to next game state
        memoryGameState = "demo";
      }
    } else if (memoryGameState === "demo") { // Demo moves to user
      memoryGameDemoCounter += (1 / theFrameRate * 1000);
      console.log(memoryGameDemoCounter);
      if (memoryGameDemoCounter < demoMoveLength) {
        currMove = computerMoves[currMoveCounter];
        if (currMove === spotCodes[0]) {
          visualizeMoire(0, spotColors[0]);
        } else if (currMove === spotCodes[1]) {
          visualizeMoire(1, spotColors[1]);
        } else if (currMove === spotCodes[2]) {
          visualizeMoire(2, spotColors[2]);
        } else if (currMove === spotCodes[3]) {
          visualizeMoire(3, spotColors[3]);
        }
      } else { // Current move demo is done, go to next move
        currMoveCounter++;
        resetMoireVars();
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

            resetMoireVars();

            // TODO: consider this logic.
            // Reset move here, so that anything typed during the user_just_guessed_right is wipped
            // Designed to prevent errant keystrokes or tweaky keystrokes or anything...
            lastGuess = ''; 

            if (currMoveCounter == computerMoves.length) { // guessing round complete!
              console.log("adding a move");
              computerMoves.push(chooseASpot(computerMoves[computerMoves.length-1]));
              memoryGameState = 'round_complete';
              memoryGameDemoCounter = 0;
              currMoveCounter = 0;
            } else { // Not done guessing yet...
              memoryGameState = 'user_guessing';
            }
        }
    } else if (memoryGameState == 'round_complete') { // Successful round! Challenge or congrats
      roundCompleteCongratsCounter += (1 / theFrameRate * 1000);
      timeIsUp = false;

      if (currFriendPrompt.length == 0) {
        currFriendPrompt = friendPrompts[Math.floor(random(0,friendPrompts.length))];
      }

      if (((computerMoves.length - 1) % 3) == 0) { // if every 3rd move
        if (roundCompleteCongratsCounter < roundCompleteChallengeLength) {
          visualizeRoundComplete(currFriendPrompt); // TODO spruce this up!!
        } else {
          timeIsUp = true;
        }
      } else {
        if (roundCompleteCongratsCounter < demoMoveLength) {
          visualizeRoundComplete('');
        } else {
          timeIsUp = true;
        }
      }

      if (timeIsUp) {
          roundCompleteCongratsCounter = 0;
          memoryGameState = 'demo';
          currFriendPrompt = '';
      }
    }
  } else if (currGameState == "user_lost") {
    // TODO maybe demo really fast what the correct answer was?
    visualizeUserLost(computerMoves.length);
  }
}

// ********************
// VISUALIZATION SCREENS
function visualizeHomeScreen() {
  background(0,0,0,opacity);

  if (moire.points.length == 0) {
    homeScreen.quadrant = Math.floor(random(0,4));
    homeScreen.currMoireLength = weightedRandom(1, .3, .1, 2) * 1000;
    homeScreen.timer = 0;

    homeScreen.red = Math.floor(random(0,256));
    homeScreen.green = Math.floor(random(0,256));
    homeScreen.blue = Math.floor(random(0,256));

    homeScreen.textR = weightedRandom(200,30,0,255);
    homeScreen.textG = weightedRandom(200,30,0,255);
    homeScreen.textB = weightedRandom(2000,30,0,255);
  }

  if (homeScreen.timer < homeScreen.currMoireLength) {
    visualizeMoire(homeScreen.quadrant, [homeScreen.red, homeScreen.green, homeScreen.blue], homeScreen.timer/homeScreen.currMoireLength);
    homeScreen.timer += (1 / theFrameRate * 1000);
  } else {
    resetMoireVars();
  }

  // TODO fix msg text
  // TODO this text looks hacky...
  textSize(60);
  msg = "Grab a new friend and hold hands, with one of you touching the <orange> and one of you touching the <banana>. (PRESS X)";
  noStroke();
  //fill(homeScreen.textR, homeScreen.textG, homeScreen.textB);
  fill(255,255,255);
  textFont('Verdana');
  text(msg, windowWidth/6, windowHeight/6, 2*windowWidth/3, 2*windowHeight/3);
}

function visualizeIntro() {


  /*
  <*WOOT*> Audio is being read:
   - Awesome! Welcome to Remember Your Friends, a teamwork memory game.  Work as a team to remember the order of spots selected.

   To play the game, form a human-chain like you just did, with one person's hand on the <orange> and one on your guess."

- Before we get started, take 30 seconds and introduce yourself to your partner...
- [Countdown timer sound thingy...]
- Great, let's get started.  Remember to pay attention!
  */

  // TODO possible secret hack here where if you hit a few keys, you can skip right to the game ;)
  if (introViz.overallCounter < 8000) { // TODO lengthen to ... 15000?
    // Moire stuff with voice overdubs
    // TODO audio cues...

    if (moire.points.length == 0) {
      introViz.quadrant += 1;
      introViz.quadrant %= 4;

      introViz.moireCounter = 0;
    }

    background(0,0,0,opacity);
    if (introViz.moireCounter < introViz.moireLength) {
      visualizeMoire(introViz.quadrant, spotColors[introViz.quadrant], introViz.moireCounter / introViz.moireLength);
      introViz.moireCounter += (1 / theFrameRate * 1000);
    } else {
      resetMoireVars();
    }

    textSize(60);
    msg = "W00000t welcome";
    text(msg, windowWidth/6, windowHeight/6, 2*windowWidth/3, 2*windowHeight/3)
    }
  else if (introViz.overallCounter < 13000) { // TODO lengthen
    if (introViz.newFriendPrompt.length == 0) {
      introViz.newFriendPrompt = initialFriendPrompts[Math.floor(random(0,initialFriendPrompts.length))];
    }
    visualizeTextPrompt(introViz.newFriendPrompt);
  } else { // let' get ready to play
    visualizeTextPrompt("Great, let's get started. Remember to pay attention");
  }
}

function visualizeTextPrompt(friendshipPrompt) {
  // TODO maybe audio triggers here with time...
  fill(random(0,256), random(0,256), random(0,256));
  textSize(60);
  textFont('Verdana');
  noStroke();
  text(friendshipPrompt, windowWidth/6, windowHeight/6, 2*windowWidth/3, 2*windowHeight/3)
}

// TODO maybe only supply one point, and the other is a mirror?
function visualizeMoire(quadrant, colors) {
  // Moire patterns for the positions
  // quadrant is from 0-3
  // colors is RGB array of length 3
  if (moire.points.length == 0) {
    moire.points.push(new MoirePoint(quadrant));
    //moire.points.push(new MoirePoint(quadrant));
  }

  background(0,0,0,opacity);

  for (m = 0; m < moire.points.length; m++) {
    moire.points[m].move();

    currentX = quadrant * windowWidth/4;
    currentY = 0;

    background(0,0,0,opacity); // clean up background
    numLinesPerSide = 20;
    
    for (i = 0; i < numLinesPerSide; i+= 1) {
      stroke(weightedRandom(colors[0],40,0,255),
             weightedRandom(colors[1],40,0,255),
             weightedRandom(colors[2],40,0,255));
        
      line(currentX, 0, moire.points[m].x, moire.points[m].y); // top of screen
      line(currentX, 0, 
          map(moire.points[m].x, quadrant*windowWidth/4, (quadrant+1)*windowWidth/4, (quadrant+1)*windowWidth/4, quadrant*windowWidth/4),
          map(moire.points[m].y, 0, windowHeight, windowHeight, 0)); // top of screen, flipped

      line(currentX, windowHeight, moire.points[m].x, moire.points[m].y); // bottom of screen
      line(currentX, windowHeight,
          map(moire.points[m].x, quadrant*windowWidth/4, (quadrant+1)*windowWidth/4, (quadrant+1)*windowWidth/4, quadrant*windowWidth/4),
          map(moire.points[m].y, 0, windowHeight, windowHeight, 0)); // bottom of screen, flipped;

      line(quadrant*windowWidth/4, currentY, moire.points[m].x, moire.points[m].y); // left side of screen
      line(quadrant*windowWidth/4, currentY, 
          map(moire.points[m].x, quadrant*windowWidth/4, (quadrant+1)*windowWidth/4, (quadrant+1)*windowWidth/4, quadrant*windowWidth/4),
          map(moire.points[m].y, 0, windowHeight, windowHeight, 0)); // left side of screen, flipped

      line((quadrant+1)*windowWidth/4, currentY, moire.points[m].x, moire.points[m].y); // right side of screen
      line((quadrant+1)*windowWidth/4, currentY,
          map(moire.points[m].x, quadrant*windowWidth/4, (quadrant+1)*windowWidth/4, (quadrant+1)*windowWidth/4, quadrant*windowWidth/4),
          map(moire.points[m].y, 0, windowHeight, windowHeight, 0)); // right side of screen, flipped
      
      currentX += (windowWidth/4) / numLinesPerSide;
      currentY += windowHeight / numLinesPerSide;
    }
  }

  textSize(60);
  text(spotCodes[quadrant], windowWidth/8 + (quadrant * (windowWidth/4)), windowHeight/3);
}

function visualizeRoundComplete(friendShipPrompt) {
  // TODO spruce this up
  background(0);
  textSize(40);
  fill(random(0,255), random(0,255), random(0,255));
  numMovesComplete = computerMoves.length -1;

  if (friendShipPrompt.length > 0) {
    console.log("in");
    text(friendShipPrompt, windowWidth/6, windowHeight/3);
  } else {
    console.log('out');
    msg = "Awesome job! " + (computerMoves.length - 1) + "!!!! Adding a move :)"
    text(msg, windowWidth/6, windowHeight/3);
  }
}

function visualizeUserLost(numMoves) {
    background(200,100,30);
    textSize(32);
    msg = ""
    text("Oops, wrong guess!", windowWidth/6, windowHeight/3);
    text("You and your friend made " + numMoves + " moves!", windowWidth/6, 2*windowHeight/5);
    text("Press x to play Memory", windowWidth/6, windowHeight/2);
}


// Play fun sounds in hurrr!!!
function keyTyped() {
  if (key === 'x') { // Let's play in_memory_game
    if (currGameState == "hanging_out" || currGameState == 'user_lost') {
      // Move to next game state
      currGameState = "in_memory_game";
      memoryGameState = "intro";

      // Reset for next game play...
      resetMoireVars();

      // TODO This is for demo mode and game starting ... move this shit somewhere else?
      // Possibly move to in 'intro' block...
      // But to be fair, it works here :)
      computerMoves = [];
      computerMoves.push(chooseASpot(-1)); // -1 default value for chooseASpot
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

// TODO I added logic so you never get the same spot twice
// This was forced by how crazy the visuals are now, and it's hard to tell
// When a spot was chosen 2x in a row.   Hmmm
// I think my options are
// -- dont allow same option 2x in a row
// -- make the visuals chiller for the demo ;(
function chooseASpot(lastGuess) {
  /* 
  Choose a spot amongst the x buttons
  Could be expanded with difficulty
    - dont choose the same spot twice
    - choose spots far away from each other
  */
  computerPick = lastGuess;
  while (computerPick == lastGuess) {
    computerPick = spotCodes[Math.floor(Math.random() * spotCodes.length)];
  }
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

// *****************
// CAMERA STUFF

function cameraSetup() {
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  buffer = new jsfeat.matrix_t(w, h, jsfeat.U8C1_t);
}

// *****************
// Resetting stuff

function resetIntroVars() {
  introViz.lengthOfTime  = 15000;
  introViz.overallCounter = 0;

  introViz.moireCounter = 0;
  introViz.moireLength = 2000;
  introViz.quadrant = -1;

  introViz.newFriendPrompt = "";
}

function resetMoireVars() {
  moire.points = [];
}
