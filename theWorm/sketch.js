/*
Richie Mendelsohn
Remember Your Friends - Makeymakey Moire magic Speed / Memory collab make friends game
3/21/16
*/

/*
INTRO WORDS:



Make this game / activities unique ...
Separating this from any other game with the point to bomb wiht your teammate

Opening Text: 
  msg = "Grab a new friend and hold hands, with one of you touching the <orange> and one of you touching the <banana>. (PRESS X)";

- Remember Your Friends... - [Text on screen?] Grab a new
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


TODO / Ideas:
- having the intro explanation be a Song :) ... I can always revert to text if need be
  - just time box a 30 minute jingle
- Figure out what the 5 objects are.  Color code them??
- Focus on the Moire!
  - Moire for friendship Prompts...
  - Moire as background for when user is guessing
  - Moire ideas to explore
    - dark lines going in a circle, like a subtle Loading Icon
    - Moire starting chill and eventually blowing up thats a symbol that the Friendship Prompt round is about over and you ened to pay attention.  Combine this with audio cues
- Get some audio down!
- Get the basic intro flow down...
- More prompt ideas



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
    - BACKGROUND MOIRE
  - ** Partner activity screens
    - BACKGROUND MOIRE
  - **Loser screen
    - ??

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

// Game over counter
var userLost = new Object();


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
var friendPrompts = new Object();

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
  resetUserLostVars();
  initializeFriendPrompts();
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
          resetMoireVars();
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
        // play a sound here the first time?
      }
    } else if (memoryGameState == 'user_just_guessed_right') {
      // Show what they just guessed...
          userGuessVisualCounter += (1 / theFrameRate * 1000);
          console.log(userGuessVisualCounter);

          /// lastGuess could change if user hits something else, which would be sooo confusing for them
          theGuess = computerMoves[currMoveCounter];

          if (userGuessVisualCounter < userGuessMoveVisualLength) {
            if (theGuess === spotCodes[0]) {
              visualizeMoire(0, spotColors[0]);
              // play audio
            } else if (theGuess === spotCodes[1]) {
              visualizeMoire(1, spotColors[1]);
              // play audio
            } else if (theGuess === spotCodes[2]) {
              visualizeMoire(2, spotColors[2]);
              // play audio
            } else if (theGuess === spotCodes[3]) {
              visualizeMoire(3, spotColors[3]);
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

      if (str(computerMoves.length - 1) in friendPrompts) {
        waitTime = friendPrompts[str(computerMoves.length-1)][0];
      } else {
        waitTime = friendPrompts["general"][0];
      }
      
      if (roundCompleteCongratsCounter < waitTime) {
        visualizeTextPrompt(str(computerMoves.length-1)); /// show a text prompt
      } else {
        timeIsUp = true;
        resetMoireVars();
      }
      
      if (timeIsUp) {
          roundCompleteCongratsCounter = 0;
          memoryGameState = 'demo';
      }
    }
  } else if (currGameState == "user_lost") {
    // TODO maybe demo really fast what the correct answer was?
    magicNum = "-42"
    userLost.timer += (1 / theFrameRate * 1000);
    waitTime = friendPrompts[magicNum][0];
    
    // Hackily inject move length in there...
    msg = "Oooo, incorrect! You got " + computerMoves.length + "moves though! Enjoy your new friend!";
    friendPrompts[magicNum][1] = [msg];
    
    if (magicNum < waitTime) {
      visualizeTextPrompt(magicNum);
    } else {
      resetIntroVars();
      resetMoireVars();
      resetUserLostVars();
      currGameState = "hanging_out";
    }
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
    visualizeMoire(homeScreen.quadrant, [homeScreen.red, homeScreen.green, homeScreen.blue]);
    homeScreen.timer += (1 / theFrameRate * 1000);
  } else {
    resetMoireVars();
  }
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
      visualizeMoire(introViz.quadrant, spotColors[introViz.quadrant]);
      introViz.moireCounter += (1 / theFrameRate * 1000);
    } else {
      resetMoireVars();
    }

    /*
    textSize(60);
    msg = "W00000t welcome";
    text(msg, windowWidth/6, windowHeight/6, 2*windowWidth/3, 2*windowHeight/3)
    */
    }
  else if (introViz.overallCounter < 13000) { // TODO lengthen
    visualizeTextPrompt(-1);
  } else { // let' get ready to play
    visualizeTextPrompt(0);
  }
}

function visualizeTextPrompt(moveNums) {
  // TODO maybe audio triggers here with time...)
  
  moveNums = str(moveNums);

  // New prompt
  if (moveNums != friendPrompts.currNumber) {
    friendPrompts.currNumber = moveNums;
    if (moveNums in friendPrompts) {
      allMsgs = friendPrompts[moveNums][1]; // TODO convert to string
    } else {
      allMsgs = friendPrompts["general"][1];
    }
    friendPrompts.currMsg = allMsgs[Math.floor(random(0,allMsgs.length))]; 
    resetMoireVars();
  }

  colors = [weightedRandom(30,10,0,60), weightedRandom(30,10,0,60), weightedRandom(30,10,0,60)];
  visualizeMoire(-1, colors);
  fill(random(0,256), random(0,256), random(0,256));
  textSize(60);
  textFont('Verdana');
  noStroke();
  text(friendPrompts.currMsg, windowWidth/6, windowHeight/6, 2*windowWidth/3, 2*windowHeight/3);
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

  if (quadrant == -1) { // use the whole screen
    minX = 0;
    maxX = windowWidth;
    width = maxX - minX;
    numLinesPerSide = 10;
  } else { // actually pick a quadrant
    minX = quadrant * windowWidth / 4;
    maxX = (quadrant + 1) * windowWidth / 4;
    width = maxX - minX;
    numLinesPerSide = 20;
  }

  background(0,0,0,opacity);

  for (m = 0; m < moire.points.length; m++) {
    moire.points[m].move();

    currentX = minX;
    currentY = 0;

    background(0,0,0,opacity); // clean up background
    
    
    for (i = 0; i < numLinesPerSide; i+= 1) {
      stroke(weightedRandom(colors[0],40,0,255),
             weightedRandom(colors[1],40,0,255),
             weightedRandom(colors[2],40,0,255));
        
      line(currentX, 0, moire.points[m].x, moire.points[m].y); // top of screen
      line(currentX, 0, map(moire.points[m].x, minX, maxX, maxX, minX),
          map(moire.points[m].y, 0, windowHeight, windowHeight, 0)); // top of screen, flipped

      line(currentX, windowHeight, moire.points[m].x, moire.points[m].y); // bottom of screen
      line(currentX, windowHeight, map(moire.points[m].x, minX, maxX, maxX, minX),
          map(moire.points[m].y, 0, windowHeight, windowHeight, 0)); // bottom of screen, flipped;

      line(minX, currentY, moire.points[m].x, moire.points[m].y); // left side of screen
      line(minX, currentY, map(moire.points[m].x, minX, maxX, maxX, minX),
          map(moire.points[m].y, 0, windowHeight, windowHeight, 0)); // left side of screen, flipped

      line(maxX, currentY, moire.points[m].x, moire.points[m].y); // right side of screen
      line(maxX, currentY, map(moire.points[m].x, minX, maxX, maxX, minX),
          map(moire.points[m].y, 0, windowHeight, windowHeight, 0)); // right side of screen, flipped
      
      currentX += width / numLinesPerSide;
      currentY += windowHeight / numLinesPerSide;
    }
  }

  // TODO letters showing code...
  /*
  if (quadrant != -1) {
    textSize(60);
    text(spotCodes[quadrant], windowWidth/8 + (minX), windowHeight/3);
  }
  */
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
// Resetting stuff

function resetIntroVars() {
  introViz.lengthOfTime  = 15000;
  introViz.overallCounter = 0;

  introViz.moireCounter = 0;
  introViz.moireLength = 2000;
  introViz.quadrant = -1;
}

function resetMoireVars() {
  moire.points = [];
}

function resetFriendPromptVars() {
  promptVar.msg = "";
}

function resetUserLostVars() {
  userLost.timer = 0;
}

function initializeFriendPrompts() {
  
  // Initial icebreaker
  friendPrompts["-1"] = [30000, ["Learn your new friend's name!"]];

  // Initial icebreaker
  friendPrompts["0"] = [3000, ["Great, let's get started. Remember to pay attention."]];
  
  // Good job, let's keep going
  friendPrompts["1"] = [3000, ["Great job! Let's add another"]];
  
  // First break ...
  friendPrompts["3"] = [35000, ["Make up a secret handshake",
                                 "Make up a synchronized dance",
                                 "Find out the best part of your friend's day",
                                  "Find out the worst part of your friend's day"]];
  // Emotional
  friendPrompts["6"] = [35000, ["What's something your parents don't know about you?",
                                "What's something your best friend doesn't know about you?",
                                "Have you ever been in love?"]];

  spiritualPsychological = ["Do you believe in God?",
                            "What is the meaning of life?"];

  // Spiritual / Psychological
  friendPrompts["9"] = [35000, spiritualPsychological];
  friendPrompts["12"] = [35000, spiritualPsychological];
  friendPrompts["15"] = [35000, spiritualPsychological];
  friendPrompts["18"] = [35000, spiritualPsychological];
  friendPrompts["21"] = [35000, spiritualPsychological];

  friendPrompts["general"] = [3000, ["Great job! Let's add another"]];

  friendPrompts["-42"] = [5000, ["Good work though! Enjoy your new friend"]];

  friendPrompts.currMsg;
  friendPrompts.currNumber = "-9"; // choose something invalid...
}
