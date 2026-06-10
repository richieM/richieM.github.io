// SMILE BIGGER — a secret facial-expression combo lock for mobile.
//
// Point the front camera at your face and perform the sequence IN ORDER:
//     1. wink your LEFT eye
//     2. wink your RIGHT eye
//     3. big FROWN
//     4. HUGE smile
// Nail all four (returning to a neutral face between each) and the screen
// erupts in confetti and reveals the secret: "GO TO THE FOURTH ELEVATOR".
//
// All detection rides on MediaPipe FaceLandmarker blendshapes (same engine as
// ../mouthRock): eyeBlink{Left,Right}, mouthFrown{Left,Right},
// mouthSmile{Left,Right}. Confetti is a simple particle burst.

import {
  FaceLandmarker,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js";

// --- detection thresholds (blendshape scores run 0..1) ---------------------
const BLINK_ON = 0.3; // a winking eye must exceed this...
const BLINK_GAP = 0.12; // ...while the OTHER eye stays at least this much lower
const BROW_ON = 0.4; // furrowed/angry brow ("frown")
const SMILE_ON = 0.92; // HUGE smile
const HOLD_FRAMES = 8; // frames a step's expression must persist (~0.13s)

// Set true to show a live readout of the raw scores (handy for tuning).
const DEBUG = false;

// The combo, in order. Each test receives the smoothed scores object.
const STEPS = [
  {
    label: "WINK YOUR\nLEFT EYE 😉",
    test: (s) => s.blinkLeft > BLINK_ON && s.blinkLeft - s.blinkRight > BLINK_GAP,
  },
  {
    label: "NOW WINK YOUR\nRIGHT EYE 😉",
    test: (s) => s.blinkRight > BLINK_ON && s.blinkRight - s.blinkLeft > BLINK_GAP,
  },
  {
    label: "NOW MAKE AN\nANGRY FACE! 😠\n(furrow your brow)",
    test: (s) => s.browDown > BROW_ON,
  },
  {
    label: "NOW SMILE\nHUGE!!! 😁",
    test: (s) => s.smile > SMILE_ON,
  },
];

let cam;
let canv;
let faceLandmarker;
let lastVideoTime = -1;
let faceResults;

// smoothed scores
let scores = {
  blinkLeft: 0,
  blinkRight: 0,
  frown: 0,
  browDown: 0,
  browUp: 0,
  jaw: 0,
  smile: 0,
};

let stepIndex = 0; // which step we're waiting on
let holdCounter = 0; // frames the current step's expression has held
let celebrating = false;
let celebrationStart = 0;

let confetti = [];

const sketch = (p) => {
  p.setup = () => {
    canv = p.createCanvas(p.windowWidth, p.windowHeight);
    cam = p.createCapture(
      { video: { facingMode: "user" }, audio: false },
      () => cam.hide()
    );
    cam.hide();
    p.textFont("Arial");
    p.textAlign(p.CENTER, p.CENTER);
    p.frameRate(60);
  };

  p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);

  // Tap anywhere to restart the combo.
  p.mousePressed = () => {
    resetCombo();
    return false;
  };
  p.touchStarted = () => {
    resetCombo();
    return false;
  };

  p.draw = () => {
    p.background(0);
    drawMirroredCamera(p);

    if (
      faceLandmarker &&
      cam.elt.readyState >= 2 &&
      cam.elt.currentTime !== lastVideoTime
    ) {
      lastVideoTime = cam.elt.currentTime;
      faceResults = faceLandmarker.detectForVideo(cam.elt, performance.now());
    }

    updateScores();
    if (!celebrating) advanceCombo(p);

    if (celebrating) drawCelebration(p);
    else drawComboUI(p);
  };
};

function resetCombo() {
  if (celebrating) return; // let the party run
  stepIndex = 0;
  holdCounter = 0;
}

// Walk the state machine one frame.
function advanceCombo(p) {
  const faceFound = !!faceResults?.faceBlendshapes?.length;
  if (!faceFound) {
    holdCounter = 0;
    return;
  }

  const step = STEPS[stepIndex];
  if (step.test(scores)) {
    holdCounter++;
    if (holdCounter >= HOLD_FRAMES) {
      holdCounter = 0;
      stepIndex++;
      if (stepIndex >= STEPS.length) startCelebration(p);
    }
  } else {
    holdCounter = 0;
  }
}

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
  p.scale(-1, 1);
  p.image(cam, p.width - dx - dw, (p.height - dh) / 2, dw, dh);
  p.pop();
}

function updateScores() {
  let raw = {
    blinkLeft: 0,
    blinkRight: 0,
    frown: 0,
    browDown: 0,
    browUp: 0,
    jaw: 0,
    smile: 0,
  };
  const cats = faceResults?.faceBlendshapes?.[0]?.categories;
  if (cats) {
    const get = (name) => cats.find((c) => c.categoryName === name)?.score ?? 0;
    raw.blinkLeft = get("eyeBlinkLeft");
    raw.blinkRight = get("eyeBlinkRight");
    raw.frown = (get("mouthFrownLeft") + get("mouthFrownRight")) / 2;
    raw.browDown = (get("browDownLeft") + get("browDownRight")) / 2;
    raw.browUp = get("browInnerUp");
    raw.jaw = get("jawOpen");
    raw.smile = (get("mouthSmileLeft") + get("mouthSmileRight")) / 2;
  }
  // Light smoothing — responsive enough for quick winks, steady enough to not
  // flicker the UI.
  const k = 0.45;
  for (const key in scores) scores[key] += (raw[key] - scores[key]) * k;
}

function startCelebration(p) {
  celebrating = true;
  celebrationStart = p.frameCount;
  burstConfetti(p, 220);
}

// ---------------------------------------------------------------------------
// Combo UI (the "locked" state)
// ---------------------------------------------------------------------------
function drawComboUI(p) {
  const faceFound = !!faceResults?.faceBlendshapes?.length;
  const unit = Math.min(p.width, p.height);

  // subtle dim so text reads over the camera
  p.noStroke();
  p.fill(0, 110);
  p.rect(0, 0, p.width, p.height);

  // headline instruction
  p.fill(255);
  p.stroke(0);
  p.strokeWeight(unit * 0.012);

  if (!faceFound) {
    p.textSize(unit * 0.09);
    p.text("SHOW ME\nYOUR FACE!", p.width / 2, p.height * 0.4);
  } else {
    p.textSize(unit * 0.11);
    p.text(STEPS[stepIndex].label, p.width / 2, p.height * 0.38);
  }

  drawChecklist(p);
  if (DEBUG) drawDebug(p);
}

// Live readout of the smoothed scores, top-left. Flip DEBUG off for the
// real install.
function drawDebug(p) {
  const unit = Math.min(p.width, p.height);
  p.push();
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(unit * 0.04);
  p.noStroke();
  const lines = [
    `blinkL ${scores.blinkLeft.toFixed(2)}`,
    `blinkR ${scores.blinkRight.toFixed(2)}`,
    `frown  ${scores.frown.toFixed(2)}`,
    `browDn ${scores.browDown.toFixed(2)}`,
    `browUp ${scores.browUp.toFixed(2)}`,
    `jaw    ${scores.jaw.toFixed(2)}`,
    `smile  ${scores.smile.toFixed(2)}`,
  ];
  p.fill(0, 150);
  p.rect(6, 6, unit * 0.42, lines.length * unit * 0.05 + unit * 0.02, 8);
  p.fill(0, 255, 120);
  lines.forEach((t, i) =>
    p.text(t, unit * 0.03, unit * 0.03 + i * unit * 0.05)
  );
  p.pop();
}

// Row of step chips at the bottom: done = green check, current = pulsing, rest = dim.
function drawChecklist(p) {
  const unit = Math.min(p.width, p.height);
  const n = STEPS.length;
  const chip = unit * 0.16;
  const gap = unit * 0.04;
  const totalW = n * chip + (n - 1) * gap;
  const startX = (p.width - totalW) / 2;
  const y = p.height * 0.78;
  const pulse = (p.sin(p.frameCount * 0.2) + 1) / 2;

  p.textAlign(p.CENTER, p.CENTER);
  for (let i = 0; i < n; i++) {
    const x = startX + i * (chip + gap);
    const done = i < stepIndex;
    const current = i === stepIndex;

    p.push();
    p.noStroke();
    if (done) p.fill(40, 180, 90);
    else if (current) p.fill(255, 200 + 40 * pulse, 60);
    else p.fill(255, 255, 255, 40);
    p.rect(x, y, chip, chip, chip * 0.22);

    // checkmark when done, otherwise the step number (always fits the chip)
    p.fill(done ? 255 : 20);
    if (current && !done) p.fill(40);
    p.textStyle(p.BOLD);
    p.textSize(chip * 0.5);
    p.text(done ? "✓" : i + 1, x + chip / 2, y + chip / 2);
    p.textStyle(p.NORMAL);
    p.pop();
  }

  // tiny restart hint
  p.noStroke();
  p.fill(255, 150);
  p.textSize(unit * 0.035);
  p.text("tap to restart", p.width / 2, y + chip + unit * 0.05);
}

// ---------------------------------------------------------------------------
// Celebration screen
// ---------------------------------------------------------------------------
function drawCelebration(p) {
  if (p.frameCount % 4 === 0) burstConfetti(p, 14);
  updateAndDrawConfetti(p);

  const unit = Math.min(p.width, p.height);
  const t = p.frameCount - celebrationStart;
  const ease = 1 - Math.pow(1 - p.constrain(t / 30, 0, 1), 3);

  p.push();
  p.translate(p.width / 2, p.height * 0.45);
  p.scale(ease);
  p.noStroke();
  p.fill(0, 170);
  p.rectMode(p.CENTER);
  p.rect(0, 0, p.width * 0.92, unit * 0.7, unit * 0.05);

  p.textAlign(p.CENTER, p.CENTER);
  p.fill(255, 230, 80);
  p.stroke(0);
  p.strokeWeight(unit * 0.012);
  p.textSize(unit * 0.11);
  p.text("UNLOCKED!!! 🎉", 0, -unit * 0.2);

  p.fill(255);
  p.textSize(unit * 0.085);
  p.text("GO TO THE\nFOURTH ELEVATOR", 0, unit * 0.06);
  p.pop();
}

// ---------------------------------------------------------------------------
// Confetti
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
