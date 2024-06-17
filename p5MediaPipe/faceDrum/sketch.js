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

let W = 1280;
let H = 720;

let cam;
let canv;

let faceLandmarker;
let faceLandmarkResults;
let lastVideoTime = 0;

let handLandmarker;
let handLandmarkResults;

let mouthClosedState = false;
let leftEyeClosedState = false;
let rightEyeClosedState = false;

let bubbles = [];

let kick;
let snare;
let openHiHat;

const mainSketchRichie = (p) => {
  p.setup = async () => {
    canv = p.createCanvas(W, H);
    cam = p.createCapture(p.VIDEO, false, () => {
      let w = W;
      let h = (cam.elt.videoHeight / cam.elt.videoWidth) * W;
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

    //const synth = new Tone.Synth().toDestination();
  };

  p.draw = () => {
    p.background(220);
    p.push();
    p.translate(W, 0);
    p.scale(-1, 1);
    p.image(cam, cam.width, 0, -cam.width, cam.height);
    p.pop();
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

      if (p.frameCount % 60 == 0){
          console.log("jawOpen: " + jawOpen['score'])
          console.log("eyeBlinkLeft: " + eyeBlinkLeft['score'])
          console.log("eyeBlinkRight: " + eyeBlinkRight['score'])
          console.log("mouthSmileRight: " + mouthSmileRight['score'])
      }

      //drawOval(p, landmarks, p.createVector(-mat[8], -mat[9]), jawOpen.score ?? 1);
      //drawAxes(p, mat, landmarks);

      //console.log(mat);
      drawRichieCustom1(
        p,
        landmarks,
        p.createVector(-mat[8], -mat[9]),
        jawOpen.score ?? 1,
        eyeBlinkLeft.score ?? 1,
        eyeBlinkRight.score ?? 1,
        mouthSmileRight.score ?? 1,
      );

      for (var i=0; i < bubbles.length; i++) {
        bubbles[i].display();
        bubbles[i].move();
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

function drawRichieCustom1(p, faceLandmarks, norm, jawOpen, eyeBlinkLeft, eyeBlinkRight, mouthSmileRight) {
  p.push();

  // MOUTH + KICK
  if (jawOpen < 0.05 && !mouthClosedState) {
    bubbles.push(new BubbleMP(W, H, p));
    //p.fill(p.random(0,255), p.random(0,255), p.random(0,255));
    //p.ellipse(p.random(0,W), p.random(0,H), p.random(0,50), p.random(0,50));
    console.log("Mouth + kick")
    kick.play();
    //synth.triggerAttackRelease("C3", "8n");
    mouthClosedState = true
  } else if (jawOpen > 0.2 && mouthClosedState) { // RESET STATE
    console.log("fail...")
    mouthClosedState = false
  }

  // LEFT EYE AND SNARE
  if (eyeBlinkLeft > 0.50 && !leftEyeClosedState) {
    bubbles.push(new BubbleMP(W, H, p));
    //p.fill(p.random(0,255), p.random(0,255), p.random(0,255));
    //p.ellipse(p.random(0,W), p.random(0,H), p.random(0,50), p.random(0,50));
    console.log("Left eye + snare")
    snare.play();
    //synth.triggerAttackRelease("C3", "8n");
    leftEyeClosedState = true
  } else if (eyeBlinkLeft < 0.2 && leftEyeClosedState) { // RESET STATE
    leftEyeClosedState = false
  }

  // RIGHT EYE AND openHiHat
  if (eyeBlinkRight > 0.50 && !rightEyeClosedState) {
    bubbles.push(new BubbleMP(W, H, p));
    //p.fill(p.random(0,255), p.random(0,255), p.random(0,255));
    //p.ellipse(p.random(0,W), p.random(0,H), p.random(0,50), p.random(0,50));
    console.log("Left eye + snare")
    openHiHat.play();
    //synth.triggerAttackRelease("C3", "8n");
    rightEyeClosedState = true
  } else if (eyeBlinkRight < 0.2 && rightEyeClosedState) { // RESET STATE
    rightEyeClosedState = false
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

function BubbleMP(W, H, p) {
  //p.ellipse(p.random(0,W), p.random(0,H), p.random(0,50), p.random(0,50));
  this.x = p.random(0, W);
  this.y = p.random(0, 980); // TODO HARD CODE
  this.xSpeed = p.random(-10,10);
  this.ySpeed = p.random(-10,10);
  this.radius = p.random(10,100);

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

//new p5(mainSketch);
new p5(mainSketchRichie);
