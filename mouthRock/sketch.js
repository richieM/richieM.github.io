import {
  createFaceLandmarker,
  createHandLandmarker,
  invertFaceLandmarks,
  FaceLandmarker,
} from "./boilerplate.js";

//import * as Tone from "./tone.js";

// import {
//   BubbleMP,
// } from "./bubbles.js";

//let W = 1280;
//let H = 720;
// let W = 2000;
// let H = 1400;

let cam;
let canv;

let faceLandmarker;
let faceLandmarkResults;
let lastVideoTime = 0;

let handLandmarker;
let handLandmarkResults;

let mouthClosedState = true;
let leftEyeClosedState = false;
let rightEyeClosedState = false;
let browInnerUpAlready = false;

let bubbles = [];

let kick;
let snare;
let openHiHat;
let breakBeat;
let eye_chord_1;
let eye_chord_2;
let eye_chord_3;
let eye_chord_4;

let chord3;

let eyebrowSound;

let mouthStartKey = 78
let leftEyeStartKey = 263;
let rightEyeStartKey = 33;
let browsStartKey = 151;

let startPointX;
let startPointY;

let howManyBubbles = 30;
let bubbleFrameLife = 60;

let TRANS_LOWER_INCR = 5;
let W, H;
const mainSketchRichie = (p) => {
  p.setup = async () => {
    canv = p.createCanvas(p.windowWidth, p.windowHeight);
    cam = p.createCapture(p.VIDEO, false, () => {
      let w = p.windowWidth;
      let h = (cam.elt.videoHeight / cam.elt.videoWidth) * w;
      cam.size(w, h);
      canv.width = w;
      canv.height = h;
      cam.hide();
      // FIXME adjust aspect ratio
      // p.resizeCanvas(w, h);
      W = w;
      H = h;
    });
    p.angleMode(p.RADIANS);

    kick = p.loadSound('oneShots/kick.wav');
    snare = p.loadSound('oneShots/snare.wav');
    openHiHat = p.loadSound('oneShots/openHiHat.wav');
    breakBeat = p.loadSound('breaks/james_brown.wav');
    eye_chord_1  = p.loadSound('chords/Perfume_Cm9.wav');
    eye_chord_2 = p.loadSound('chords/Perfume_Bm9.wav');
    eye_chord_3 = p.loadSound('chords/Old_tape_FsharpMaj9.wav');
    eye_chord_4 = p.loadSound('chords/Hypothesis_DMaj9.wav');
    chord3 = p.loadSound('chords/85892__sandyrb__brass-end-in-a-001.wav')
    eyebrowSound = p.loadSound('chords/cowbell.wav')

    p.frameRate(120);

    //const synth = new Tone.Synth().toDestination();
  };

  p.draw = () => {
    p.background(220);
    p.push();
    p.translate(W, 0);
    p.scale(-1, 1);
    p.image(cam, cam.width, 0, -cam.width, cam.height);
    p.pop();

    p.textSize(100);
    p.fill(0);
    p.text("MOUTH ROCK!", 50, 100)
    p.text('Open mouth! Blink each eye! Raise eyebrows!', 50, 300);

    let startTimeMs = performance.now();
    if (lastVideoTime !== cam.elt.currentTime) {
      lastVideoTime = cam.elt.currentTime;

      faceLandmarkResults = faceLandmarker.detectForVideo(cam.elt, startTimeMs);
      faceLandmarkResults = invertFaceLandmarks({
        faceLandmarkResults,
      });



      // handLandmarkerResults = handLandmarker.detectForVideo(
      //   cam.elt,
      //   startTimeMs
      // );
      // print(handLandmarkerResults);
    }

    if (faceLandmarkResults?.facialTransformationMatrixes?.[0]) {
      let mat = faceLandmarkResults.facialTransformationMatrixes[0].data;
      let landmarks = faceLandmarkResults.faceLandmarks[0];

      let jawOpen = faceLandmarkResults.faceBlendshapes[0].categories.find(
        (s) => s.categoryName === "jawOpen"
      );
      let eyeBlinkLeft = faceLandmarkResults.faceBlendshapes[0].categories.find(
        (s) => s.categoryName === "eyeBlinkLeft"
      );
      let eyeBlinkRight = faceLandmarkResults.faceBlendshapes[0].categories.find(
        (s) => s.categoryName === "eyeBlinkRight"
      );
      let mouthSmileRight = faceLandmarkResults.faceBlendshapes[0].categories.find(
        (s) => s.categoryName === "mouthSmileRight"
      );
      let browDownLeft = faceLandmarkResults.faceBlendshapes[0].categories.find(
        (s) => s.categoryName === "browDownLeft"
      );
      let browDownRight = faceLandmarkResults.faceBlendshapes[0].categories.find(
        (s) => s.categoryName === "browDownRight"
      );
      let browInnerUp = faceLandmarkResults.faceBlendshapes[0].categories.find(
        (s) => s.categoryName === "browInnerUp"
      );
      let browOuterUpLeft = faceLandmarkResults.faceBlendshapes[0].categories.find(
        (s) => s.categoryName === "browOuterUpLeft"
      );
      let browOuterUpRight = faceLandmarkResults.faceBlendshapes[0].categories.find(
        (s) => s.categoryName === "browOuterUpRight"
      );
      let cheekPuff = faceLandmarkResults.faceBlendshapes[0].categories.find(
        (s) => s.categoryName === "cheekPuff"
      );

      if (p.frameCount % 60 == 0){
          console.log("jawOpen: " + jawOpen['score']);
          console.log("eyeBlinkLeft: " + eyeBlinkLeft['score']);
          console.log("eyeBlinkRight: " + eyeBlinkRight['score']);
          console.log("mouthSmileRight: " + mouthSmileRight['score']);
          console.log("browDownLeft: " + browDownLeft['score']);
          console.log("browDownRight: " + browDownRight['score']);
          console.log("browInnerUp: " + browInnerUp['score']);
          console.log("browOuterUpLeft: " + browOuterUpLeft['score']);
          console.log("browOuterUpRight: " + browOuterUpRight['score']);
          console.log("cheekPuff: " + cheekPuff['score']);
          console.log("browOuterUpLeft: " + mouthSmileRight['score']);
          //console.log("noseSneerLeft: " + faceLandmarkResults.faceBlendshapes[0].categories.find(
        //(s) => s.categoryName === "noseSneerLeft").score);
          //console.log("noseSneerRight: " + faceLandmarkResults.faceBlendshapes[0].categories.find(
        //(s) => s.categoryName === "noseSneerRight").score);

      }

      //drawOval(p, landmarks, p.createVector(-mat[8], -mat[9]), jawOpen.score ?? 1);
      //drawAxes(p, mat, landmarks);

      //console.log(mat);
      drawRichieCustom1(
        p,
        faceLandmarkResults,
        p.createVector(-mat[8], -mat[9]),
        jawOpen.score ?? 1,
        eyeBlinkLeft.score ?? 1,
        eyeBlinkRight.score ?? 1,
        mouthSmileRight.score ?? 1,
        browInnerUp.score ?? 1,
      );

      for (var i=0; i < bubbles.length; i++) {
        bubbles[i].transp -= TRANS_LOWER_INCR
        if (bubbles[i].trans <= 0) {
          bubbles.splice(i, 1);
        } else {
          bubbles[i].display();
          bubbles[i].move();
        }
      }
    }
  };
};

function drawAxes(p, mat, faceLandmarks) {
  const NOSE_TIP = 94;
  const nose = faceLandmarks[NOSE_TIP];
  let s = 200;
  p.push();
  p.translate(nose.x * W, nose.y * H);
  p.scale(s);
  p.strokeWeight(5 / s);

  p.stroke("red");
  p.line(0, 0, -mat[0], -mat[1]);
  p.stroke("green");
  p.line(0, 0, -mat[4], -mat[5]);
  p.stroke("blue");
  p.line(0, 0, -mat[8], -mat[9]);
  p.pop();
}

const TAU = Math.PI * 2;
function drawOval(p, faceLandmarks, norm, jawOpen) {
  p.push();
  // p.stroke("red");
  p.noStroke();
  p.noFill();
  const NOSE_TIP = 94;
  const nose = faceLandmarks[NOSE_TIP];

  let n = 100;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const s = p.lerp(1 - t, 2 - t * 2, jawOpen); //map(t,0, +1+jawOpen;
    p.push();
    p.translate(nose.x * W, nose.y * H);
    p.scale(s);
    p.translate(-nose.x * W, -nose.y * H);

    let time = (p.frameCount / 60) * 5;
    let coff = (6 * jawOpen + 0.6) * p.sin(time / 10);
    p.strokeWeight(2 / s);

    p.fill(
      p.map(p.sin(time + (t + 0.0 * coff) * p.TAU), -1, 1, 0, 255),
      p.map(p.sin(time + (t + 0.2 * coff) * p.TAU), -1, 1, 0, 255),
      p.map(p.sin(time + (t + 0.4 * coff) * p.TAU), -1, 1, 0, 255)
    );

    let normFac =
      (jawOpen + 0.2) * p.map(p.sin(t * TAU + 2 + time), -1, 1, 0, t * 0.5);
    p.beginShape();
    for (let { start, end } of FaceLandmarker.FACE_LANDMARKS_FACE_OVAL) {
      const v = faceLandmarks[start];
      let normOff = norm.copy().mult(normFac / s);
      let vx = v.x + normOff.x;
      let vy = v.y + normOff.y;

      p.vertex(vx * W, vy * H);
    }
    p.endShape(p.CLOSE);
    p.pop();
  }
  p.pop();
}

function drawRichieCustom1(p, faceLandmarks, norm, jawOpen, eyeBlinkLeft, eyeBlinkRight, mouthSmileRight, browInnerUp) {
  p.push();

  // faceLandmarks.faceBlendshapes[0].categories

  // MOUTH + KICK
  if (jawOpen > 0.25 && mouthClosedState) {
    startPointX = faceLandmarks.faceLandmarks[0][mouthStartKey].x * W;
    startPointY = faceLandmarks.faceLandmarks[0][mouthStartKey].y * H;
    for (let i = 0; i < howManyBubbles; i++) {
        bubbles.push(new BubbleOG(W, H, p, startPointX, startPointY, p.frameCount));
    }

    //p.fill(p.random(0,255), p.random(0,255), p.random(0,255));
    //p.ellipse(p.random(0,W), p.random(0,H), p.random(0,50), p.random(0,50));
    console.log("Mouth + kick")
    //kick.play();
    breakBeat.loop()
    //synth.triggerAttackRelease("C3", "8n");
    mouthClosedState = false
  } else if (jawOpen < 0.05 && !mouthClosedState) { // RESET STATE
    console.log("fail...")
    breakBeat.stop();
    mouthClosedState = true
  }

  // LEFT EYE AND SNARE
  if (eyeBlinkLeft > 0.35 && !leftEyeClosedState) {
    startPointX = faceLandmarks.faceLandmarks[0][leftEyeStartKey].x * W;
    startPointY = faceLandmarks.faceLandmarks[0][leftEyeStartKey].y * H;
    for (let i = 0; i < howManyBubbles; i++) {
        bubbles.push(new BubbleOG(W, H, p, startPointX, startPointY, p.frameCount));
    }
    //p.fill(p.random(0,255), p.random(0,255), p.random(0,255));
    //p.ellipse(p.random(0,W), p.random(0,H), p.random(0,50), p.random(0,50));
    console.log("Left eye + snare")

    let randomNum = p.random(0,1);
    if (randomNum < 0.25) {
      eye_chord_1.play();
    } else if (randomNum < 0.50) {
      eye_chord_2.play();
    } else if (randomNum < 0.75) {
      eye_chord_3.play();
    } else {
      eye_chord_4.play();
    }
    //synth.triggerAttackRelease("C3", "8n");
    leftEyeClosedState = true
  } else if (eyeBlinkLeft < 0.2 && leftEyeClosedState) { // RESET STATE
    eye_chord_1.stop();
    eye_chord_2.stop();
    eye_chord_3.stop();
    eye_chord_4.stop();
    leftEyeClosedState = false
  }

  // RIGHT EYE AND openHiHat
  if (eyeBlinkRight > 0.40 && !rightEyeClosedState) {
    startPointX = faceLandmarks.faceLandmarks[0][rightEyeStartKey].x * W;
    startPointY = faceLandmarks.faceLandmarks[0][rightEyeStartKey].y * H;
    for (let i = 0; i < howManyBubbles; i++) {
        bubbles.push(new BubbleOG(W, H, p, startPointX, startPointY, p.frameCount));
    }
    //p.fill(p.random(0,255), p.random(0,255), p.random(0,255));
    //p.ellipse(p.random(0,W), p.random(0,H), p.random(0,50), p.random(0,50));
    console.log("Left eye + snare")
    chord3.play();
    //synth.triggerAttackRelease("C3", "8n");
    rightEyeClosedState = true
  } else if (eyeBlinkRight < 0.2 && rightEyeClosedState) { // RESET STATE
    chord3.stop()
    rightEyeClosedState = false
  }

  // BROW
  if (browInnerUp > 0.75 && !browInnerUpAlready) {
    startPointX = faceLandmarks.faceLandmarks[0][browsStartKey].x * W;
    startPointY = faceLandmarks.faceLandmarks[0][browsStartKey].y * H;
    for (let i = 0; i < howManyBubbles; i++) {
        bubbles.push(new BubbleOG(W, H, p, startPointX, startPointY, p.frameCount));
    }
    //p.fill(p.random(0,255), p.random(0,255), p.random(0,255));
    //p.ellipse(p.random(0,W), p.random(0,H), p.random(0,50), p.random(0,50));
    console.log("BROW INNER UP")
    eyebrowSound.play();
    //synth.triggerAttackRelease("C3", "8n");
    browInnerUpAlready = true
  } else if (browInnerUp < 0.5 && browInnerUpAlready) { // RESET STATE
    eyebrowSound.stop()
    browInnerUpAlready = false
  }


  p.pop();
  // p.stroke("red");
  /*
  p.noStroke();
  p.noFill();
  const NOSE_TIP = 94;
  const nose = faceLandmarks[NOSE_TIP];

  let n = 100;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const s = p.lerp(1 - t, 2 - t * 2, jawOpen); //map(t,0, +1+jawOpen;
    p.push();
    p.translate(nose.x * W, nose.y * H);
    p.scale(s);
    p.translate(-nose.x * W, -nose.y * H);

    let time = (p.frameCount / 60) * 5;
    let coff = (6 * jawOpen + 0.6) * p.sin(time / 10);
    p.strokeWeight(2 / s);

    p.fill(
      p.map(p.sin(time + (t + 0.0 * coff) * p.TAU), -1, 1, 0, 255),
      p.map(p.sin(time + (t + 0.2 * coff) * p.TAU), -1, 1, 0, 255),
      p.map(p.sin(time + (t + 0.4 * coff) * p.TAU), -1, 1, 0, 255)
    );

    let normFac =
      (jawOpen + 0.2) * p.map(p.sin(t * TAU + 2 + time), -1, 1, 0, t * 0.5);
    p.beginShape();
    for (let { start, end } of FaceLandmarker.FACE_LANDMARKS_FACE_OVAL) {
      const v = faceLandmarks[start];
      let normOff = norm.copy().mult(normFac / s);
      let vx = v.x + normOff.x;
      let vy = v.y + normOff.y;

      p.vertex(vx * W, vy * H);
    }
    p.endShape(p.CLOSE);
    p.pop();
  }
  */

}

faceLandmarker = await createFaceLandmarker();
await faceLandmarker.setOptions({
  runningMode: "VIDEO",
  outputFacialTransformationMatrixes: true,
  outputFaceBlendshapes: true,
});

handLandmarker = await createHandLandmarker();
await faceLandmarker.setOptions({
  runningMode: "VIDEO",
});

function BubbleMP(W, H, p, startX, startY, startFrame) {
  //p.ellipse(p.random(0,W), p.random(0,H), p.random(0,50), p.random(0,50));
  this.x = startX //p.random(0, W);
  this.y = startY //p.random(0, 980); // TODO HARD CODE
  this.xSpeed = p.random(-10,10);
  this.ySpeed = p.random(-10,10);
  this.radius = p.random(10,100);
  this.startFrame = startFrame;

  this.W = W
  this.H = H

  this.display = function() {
      p.fill(p.random(0,255))
      p.noStroke();

      p.ellipse(this.x, this.y, this.radius, this.radius);
  }

  this.move = function() {

    this.x = this.x - this.xSpeed
    this.y = this.y - this.ySpeed

    this.wrapBackOntoScreen();
  }

  this.wrapBackOntoScreen = function() {
    if (this.y < 0) {
      this.y = this.H;
    } else if (this.y > this.H) {
      this.y = 0;
    } else if (this.x < 0) {
      this.x = this.W;
    } else if (this.x > this.W) {
      this.x = 0;
    }
  }
};

function BubbleOG(W, H, p, startX, startY, startFrame){
	// Location stuff
  this.startFrame = startFrame;

	this.x = startX;
	this.y = startY;
	this.xSpeed = weightedRandom(0,5,-20,20,p);
	this.ySpeed = weightedRandom(0,5,-20,20,p);

	this.xSinMvtSize = p.random(0,140); // weightedRandom(80,20,0,160);
	this.ySinMvtSize = p.random(0,140); // weightedRandom(80,20,0,160);
	this.xSinMvtSpeed = weightedRandom(.07,.04,.00001,.4,p);
	this.xSinMvtAlpha = 0;
	this.ySinMvtSpeed = weightedRandom(.07,.04,.00001,.4,p);
	this.ySinMvtAlpha = 0;

	// Radius Stuff
	this.radius = weightedRandom(40, 15, 15, 120,p);
	this.radiusGrowthSize = weightedRandom(15,8,0,120,p);
	this.radiusGrowthSpeed = weightedRandom(.07,.04,.00001,.4,p);
	this.radiusGrowthAlpha = 0;

	// Color Stuff
	// 1 out of 4 times use a diff color scheme
	if (p.floor(p.random(0,4)) % 4 == 0) {
		this.red = weightedRandom(68, 20, 0, 255,p);
		this.green = weightedRandom(116, 20, 0, 255,p);
		this.blue = weightedRandom(134, 20, 0, 255,p);
		this.transp = weightedRandom(150, 100, 0, 255,p);
	} else {
		this.red = weightedRandom(144, 50, 0, 255,p);
		this.green = weightedRandom(200, 25, 0, 255,p);
		this.blue = weightedRandom(203, 25, 0, 255,p);
		this.transp = weightedRandom(150, 60, 0, 255,p);
	}

	this.display = function() {
		  p.noStroke();
  		p.fill(this.red, this.green, this.blue, this.transp);

  		let currRadius = this.radius + this.radiusGrowthSize * (p.sin(this.radiusGrowthAlpha) -  p.sin(this.radiusGrowthAlpha - this.radiusGrowthSpeed));

  		p.ellipse(this.x, this.y, currRadius, currRadius);

  		this.radiusGrowthAlpha += this.radiusGrowthSpeed;
  		this.radius = currRadius;
	}

	this.move = function() {

		this.x = this.x - this.xSpeed - this.xSinMvtSize * (p.sin(this.xSinMvtAlpha) - p.sin(this.xSinMvtAlpha - this.xSinMvtSpeed)) //- weightedRandom(0,1,-2,2);
		this.y = this.y - this.ySpeed - this.ySinMvtSize * (p.sin(this.ySinMvtAlpha) - p.sin(this.ySinMvtAlpha - this.ySinMvtSpeed)) //-  weightedRandom(0,1,-2,2)

		this.xSinMvtAlpha +=  this.xSinMvtSpeed;
		this.ySinMvtAlpha +=  this.ySinMvtSpeed;

		this.wrapBackOntoScreen();
	}

	this.wrapBackOntoScreen = function() {
		if (this.y < 0) {
			this.y = p.windowHeight;
		} else if (this.y > p.windowHeight) {
			this.y = 0;
		} else if (this.x < 0) {
			this.x = p.windowWidth;
		} else if (this.x > p.windowWidth) {
			this.x = 0;
		}
	}

	this.cursorOverBubble = function(){
		var d = int(p.dist(this.x, this.y, mouseX, mouseY));
		if(d<100){
			return true;
		} else{
			return false;
		}

	}
}

function weightedRandom(mean, stDev, min, max,p) {
		let num = p.randomGaussian(mean, stDev);
		if (num < min) {
			return min;
		} else if (num > max) {
			return max;
		} else {
			return num;
		}
}

//new p5(mainSketch);
new p5(mainSketchRichie);
