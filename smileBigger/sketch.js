// SMILE BIGGER — a one-trick mobile sketch.
//
// Point the front camera at your face. The screen yells "SMILE BIGGER!!!"
// until you grin hard enough (and aren't frowning). Hold a HUGE smile for a
// beat and the screen erupts in confetti and reveals the secret instruction:
// "GO TO THE FOURTH ELEVATOR".
//
// Smile detection rides on MediaPipe FaceLandmarker blendshapes — the same
// approach as ../mouthRock — using mouthSmile{Left,Right} for the grin and
// mouthFrown{Left,Right} to veto a sad face. Confetti is a simple particle
// burst, in the spirit of mouthRock's bubble outpouring.

import {
  FaceLandmarker,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js";

// --- smile thresholds ------------------------------------------------------
// Blendshape scores run 0..1. A relaxed face sits near 0; a polite smile is
// ~0.3-0.5; a big toothy grin pushes past 0.7. Tune SMILE_TARGET if it feels
// too easy / too hard on your device.
const SMILE_TARGET = 0.97; // average of left+right smile needed to win — MAXIMUM grin
const FROWN_VETO = 0.25; // above this we treat the face as "sad" — no win
const HOLD_FRAMES = 60; // ~1s of sustained huge smile before celebrating

let cam;
let canv;
let faceLandmarker;
let lastVideoTime = -1;
let faceResults;

let smileScore = 0; // smoothed 0..1
let frownScore = 0; // smoothed 0..1
let holdCounter = 0;
let celebrating = false;
let celebrationStart = 0;

let confetti = [];

const sketch = (p) => {
  p.setup = () => {
    canv = p.createCanvas(p.windowWidth, p.windowHeight);

    // Front camera, mobile friendly. Constraints object lets us request the
    // selfie cam directly instead of whatever default createCapture picks.
    cam = p.createCapture(
      { video: { facingMode: "user" }, audio: false },
      () => cam.hide()
    );
    cam.hide();

    p.textFont("Arial");
    p.textAlign(p.CENTER, p.CENTER);
    p.frameRate(60);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.background(0);

    drawMirroredCamera(p);

    // Run face detection on each new camera frame.
    if (faceLandmarker && cam.elt.readyState >= 2 && cam.elt.currentTime !== lastVideoTime) {
      lastVideoTime = cam.elt.currentTime;
      faceResults = faceLandmarker.detectForVideo(cam.elt, performance.now());
    }

    updateScores();

    if (!celebrating && smileScore >= SMILE_TARGET && frownScore < FROWN_VETO) {
      holdCounter++;
      if (holdCounter >= HOLD_FRAMES) startCelebration(p);
    } else if (!celebrating) {
      holdCounter = 0;
    }

    if (celebrating) {
      drawCelebration(p);
    } else {
      drawNagging(p);
    }
  };
};

// Draw the webcam mirrored (selfie view) and scaled to cover the screen,
// so it fills a portrait phone regardless of the camera's native aspect.
function drawMirroredCamera(p) {
  const vw = cam.elt.videoWidth;
  const vh = cam.elt.videoHeight;
  if (!vw || !vh) return;

  const scale = Math.max(p.width / vw, p.height / vh);
  const dw = vw * scale;
  const dh = vh * scale;
  const dx = (p.width - dw) / 2;

  p.push();
  p.translate(p.width, 0);
  p.scale(-1, 1); // mirror horizontally
  p.image(cam, p.width - dx - dw, (p.height - dh) / 2, dw, dh);
  p.pop();
}

// Smooth the raw blendshape scores so the UI doesn't flicker frame-to-frame.
function updateScores() {
  let rawSmile = 0;
  let rawFrown = 0;

  const cats = faceResults?.faceBlendshapes?.[0]?.categories;
  if (cats) {
    const get = (name) => cats.find((c) => c.categoryName === name)?.score ?? 0;
    rawSmile = (get("mouthSmileLeft") + get("mouthSmileRight")) / 2;
    rawFrown = (get("mouthFrownLeft") + get("mouthFrownRight")) / 2;
  }

  // exponential smoothing
  smileScore += (rawSmile - smileScore) * 0.3;
  frownScore += (rawFrown - frownScore) * 0.3;
}

function startCelebration(p) {
  celebrating = true;
  celebrationStart = p.frameCount;
  burstConfetti(p, 220);
}

// ---------------------------------------------------------------------------
// "SMILE BIGGER" nag screen
// ---------------------------------------------------------------------------
function drawNagging(p) {
  const faceFound = !!faceResults?.faceBlendshapes?.length;

  // Pulsing red overlay that intensifies the closer you get to the target.
  const progress = p.constrain(smileScore / SMILE_TARGET, 0, 1);
  const pulse = (p.sin(p.frameCount * 0.25) + 1) / 2;
  p.noStroke();
  p.fill(200, 30, 30, 90 + 60 * pulse);
  p.rect(0, 0, p.width, p.height);

  const unit = Math.min(p.width, p.height);

  p.fill(255);
  p.stroke(0);
  p.strokeWeight(unit * 0.012);

  if (!faceFound) {
    p.textSize(unit * 0.09);
    p.text("SHOW ME\nYOUR FACE!", p.width / 2, p.height * 0.42);
  } else if (frownScore >= FROWN_VETO) {
    p.textSize(unit * 0.13);
    p.text("DON'T BE SAD!\nSMILE!!!", p.width / 2, p.height * 0.4);
  } else {
    // Two big lines that grow as you smile harder.
    p.textSize(unit * (0.14 + 0.04 * progress));
    p.text("SMILE BIGGER!!!", p.width / 2, p.height * 0.34);
    p.textSize(unit * (0.16 + 0.06 * progress));
    p.text("BIGGER!!!", p.width / 2, p.height * 0.52);
  }

  drawSmileMeter(p, progress);
}

// A little progress bar at the bottom so the user knows they're getting close.
function drawSmileMeter(p, progress) {
  const unit = Math.min(p.width, p.height);
  const barW = p.width * 0.7;
  const barH = unit * 0.05;
  const x = (p.width - barW) / 2;
  const y = p.height * 0.82;

  p.noStroke();
  p.fill(0, 160);
  p.rect(x - 6, y - 6, barW + 12, barH + 12, barH);

  p.fill(60);
  p.rect(x, y, barW, barH, barH);

  // fill turns from red toward green as you approach a huge smile
  const c = p.lerpColor(p.color(230, 60, 60), p.color(60, 220, 90), progress);
  p.fill(c);
  p.rect(x, y, barW * progress, barH, barH);

  p.noFill();
  p.stroke(255);
  p.strokeWeight(2);
  p.rect(x, y, barW, barH, barH);
}

// ---------------------------------------------------------------------------
// Celebration screen
// ---------------------------------------------------------------------------
function drawCelebration(p) {
  // Keep the party going with a steady drizzle of fresh confetti.
  if (p.frameCount % 4 === 0) burstConfetti(p, 14);

  updateAndDrawConfetti(p);

  const unit = Math.min(p.width, p.height);
  const t = p.frameCount - celebrationStart;

  // Bouncy entrance for the headline.
  const ease = 1 - Math.pow(1 - p.constrain(t / 30, 0, 1), 3);

  p.push();
  p.translate(p.width / 2, p.height * 0.45);
  p.scale(ease);

  // dark plate so text stays readable over confetti
  p.noStroke();
  p.fill(0, 170);
  p.rectMode(p.CENTER);
  p.rect(0, 0, p.width * 0.92, unit * 0.7, unit * 0.05);

  p.textAlign(p.CENTER, p.CENTER);
  p.fill(255, 230, 80);
  p.stroke(0);
  p.strokeWeight(unit * 0.012);
  p.textSize(unit * 0.11);
  p.text("YESSS!!! 😄", 0, -unit * 0.2);

  p.fill(255);
  p.textSize(unit * 0.085);
  p.text("GO TO THE\nFOURTH ELEVATOR", 0, unit * 0.06);
  p.pop();
}

// ---------------------------------------------------------------------------
// Confetti particles
// ---------------------------------------------------------------------------
const CONFETTI_COLORS = [
  [255, 80, 80],
  [255, 200, 60],
  [80, 220, 120],
  [80, 160, 255],
  [200, 100, 255],
  [255, 130, 200],
  [120, 255, 240],
];

function burstConfetti(p, count) {
  for (let i = 0; i < count; i++) {
    const fromTop = p.random() < 0.5;
    confetti.push({
      x: p.random(p.width),
      y: fromTop ? p.random(-p.height * 0.3, 0) : p.random(p.height),
      vx: p.random(-3, 3),
      vy: p.random(2, 7),
      size: p.random(8, 18),
      rot: p.random(p.TWO_PI),
      spin: p.random(-0.3, 0.3),
      color: p.random(CONFETTI_COLORS),
      sway: p.random(0.02, 0.08),
      phase: p.random(p.TWO_PI),
    });
  }
  // cap so memory stays bounded on a long-running install
  if (confetti.length > 700) confetti.splice(0, confetti.length - 700);
}

function updateAndDrawConfetti(p) {
  p.push();
  p.rectMode(p.CENTER);
  p.noStroke();
  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    c.x += c.vx + Math.sin(p.frameCount * c.sway + c.phase) * 1.5;
    c.y += c.vy;
    c.rot += c.spin;

    if (c.y > p.height + 40) {
      confetti.splice(i, 1);
      continue;
    }

    p.push();
    p.translate(c.x, c.y);
    p.rotate(c.rot);
    p.fill(c.color[0], c.color[1], c.color[2]);
    p.rect(0, 0, c.size, c.size * 0.6, 2);
    p.pop();
  }
  p.pop();
}

// ---------------------------------------------------------------------------
// Boot p5 + MediaPipe
// ---------------------------------------------------------------------------
new p5(sketch);

(async () => {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numFaces: 1,
    outputFaceBlendshapes: true,
  });
})();
