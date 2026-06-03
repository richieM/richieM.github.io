// airDraw — hand-tracked persistent drawing built on p5-phone + ml5 HandPose.
//
// Gestures:
//   POINTING pose (index extended, others curled) → draw a continuous line
//     from the index fingertip in the active color.
//   OPEN pose (all four fingers extended) → stamp a filled circle whose
//     diameter is the distance between thumb tip (4) and index tip (8),
//     centered on their midpoint.
//   Index fingertip hovering a palette swatch → select that color
//     (and pause drawing while inside the swatch). Tapping a swatch works
//     too as a fallback.

let cam;
let handpose;
let hands = [];
let pg;                       // persistent drawing buffer
let showVideo = true;
let cameraButton;
let cameraSwitching = false;
let lastCameraButtonPress = 0;

let palette = [
  [230,  30,  40],
  [245, 140,  30],
  [250, 220,  40],
  [ 40, 190,  90],
  [ 40, 130, 240],
  [160,  60, 230],
  [ 25,  25,  25],
  [245, 245, 245],
];
let activeColorIndex = 6;

let swatchSize = 44;
let swatchGap = 6;
let palettePadX = 14;
let palettePadY = 70;

let prevPenPos = null;        // last point used to extend a line stroke
let prevWidePos = null;       // last midpoint used to extend a wide variable-width stroke
let eraserMode = false;

let extraGap = 18;            // gap between palette and the eraser/clear tool buttons
let eraserWeight = 48;
let clearWidth = 150;         // clear button is rectangular so the label fits inside

function setup() {
  createCanvas(windowWidth, windowHeight);
  lockGestures();

  pg = createGraphics(width, height);
  pg.clear();

  cam = createPhoneCamera('user', true, 'fitHeight');
  createCameraButton();
  enableCameraTap('Tap to enable camera');

  cam.onReady(async () => {
    const opts = { maxHands: 1, runtime: 'mediapipe', flipped: false };
    handpose = await loadMl5Model((cb) => ml5.handPose(opts, cb));
    handpose.detectStart(cam.videoElement, gotHands);
  });
}

function loadMl5Model(createModel) {
  return new Promise((resolve) => {
    const model = createModel(() => resolve(model));
  });
}

function gotHands(results) {
  hands = results || [];
}

function draw() {
  background(20);

  if (showVideo && cam && cam.ready) drawPhoneCamera(cam);

  image(pg, 0, 0);

  let indexTip = null;
  let thumbTip = null;
  let pose = 'none';

  if (hands.length > 0) {
    indexTip = mapKeypoint(8);
    thumbTip = mapKeypoint(4);
    pose = classifyPose(hands[0]);

    // Only react to the tool column while in pointing pose, so an open-pose
    // stroke sweeping past the swatches doesn't repaint mid-drawing.
    const hoveredSwatch = (pose === 'pointing') ? swatchAt(indexTip) : -1;
    const hoveredEraser = (pose === 'pointing') && eraserAt(indexTip);

    if (hoveredSwatch >= 0) {
      selectColor(hoveredSwatch);
      prevPenPos = null;
      prevWidePos = null;
    } else if (hoveredEraser) {
      selectEraser();
      prevPenPos = null;
      prevWidePos = null;
    } else if (pose === 'pointing' && indexTip) {
      drawLineStroke(indexTip);
      prevWidePos = null;
    } else if (pose === 'open' && indexTip && thumbTip) {
      drawWideStroke(indexTip, thumbTip);
      prevPenPos = null;
    } else {
      prevPenPos = null;
      prevWidePos = null;
    }
  } else {
    prevPenPos = null;
    prevWidePos = null;
  }

  drawCursor(indexTip, thumbTip, pose);
  drawPalette();
  drawHUD(pose);
}

function drawLineStroke(tip) {
  pg.strokeCap(ROUND);
  pg.noFill();
  if (eraserMode) {
    pg.erase();
    pg.strokeWeight(eraserWeight);
    if (prevPenPos) pg.line(prevPenPos.x, prevPenPos.y, tip.x, tip.y);
    else            pg.circle(tip.x, tip.y, eraserWeight);
    pg.noErase();
  } else {
    const c = palette[activeColorIndex];
    pg.stroke(c[0], c[1], c[2]);
    pg.strokeWeight(8);
    if (prevPenPos) pg.line(prevPenPos.x, prevPenPos.y, tip.x, tip.y);
    else            pg.circle(tip.x, tip.y, 8);
  }
  prevPenPos = { x: tip.x, y: tip.y };
}

// Continuous variable-width stroke between thumb and index midpoint, with
// weight = current thumb-index distance. Drawing as a line (not discrete
// stamps) means a dropped frame in either keypoint shows up as a tiny gap
// instead of a missing blob.
function drawWideStroke(indexTip, thumbTip) {
  const d = dist(indexTip.x, indexTip.y, thumbTip.x, thumbTip.y);
  if (d < 8) { prevWidePos = null; return; }
  const mx = (indexTip.x + thumbTip.x) / 2;
  const my = (indexTip.y + thumbTip.y) / 2;
  pg.strokeCap(ROUND);
  pg.noFill();
  if (eraserMode) {
    pg.erase();
    pg.strokeWeight(d);
    if (prevWidePos) pg.line(prevWidePos.x, prevWidePos.y, mx, my);
    else             pg.circle(mx, my, d);
    pg.noErase();
  } else {
    const c = palette[activeColorIndex];
    pg.stroke(c[0], c[1], c[2], 220);
    pg.strokeWeight(d);
    if (prevWidePos) pg.line(prevWidePos.x, prevWidePos.y, mx, my);
    else             pg.circle(mx, my, d);
  }
  prevWidePos = { x: mx, y: my };
}

function selectColor(idx) {
  eraserMode = false;
  activeColorIndex = idx;
}

function selectEraser() {
  eraserMode = true;
}

function eraserY() {
  return palettePadY + palette.length * (swatchSize + swatchGap) + extraGap;
}

function clearY() {
  return eraserY() + swatchSize + extraGap;
}

function eraserAt(p) {
  if (!p) return false;
  const sx = palettePadX, sy = eraserY();
  return p.x >= sx && p.x <= sx + swatchSize && p.y >= sy && p.y <= sy + swatchSize;
}

function clearAt(p) {
  if (!p) return false;
  const sx = palettePadX, sy = clearY();
  return p.x >= sx && p.x <= sx + clearWidth && p.y >= sy && p.y <= sy + swatchSize;
}

function mapKeypoint(idx, handNumber = 0) {
  if (!hands.length || hands.length <= handNumber || !cam) return null;
  const hand = hands[handNumber];
  if (!hand || !hand.keypoints) return null;
  const kp = hand.keypoints[idx];
  if (!kp) return null;
  return cam.mapKeypoint(kp);
}

// Returns 'pointing', 'open', or 'other' based on which non-thumb fingers
// are extended. We compare each fingertip's distance from the wrist against
// its MCP joint's distance — a curled finger pulls the tip back toward the
// palm so the tip ends up closer to the wrist than the MCP is.
function classifyPose(hand) {
  const kps = hand.keypoints;
  if (!kps || kps.length < 21) return 'none';
  const wrist = kps[0];

  const extended = (tipIdx, mcpIdx) => {
    const dTip = dist(kps[tipIdx].x, kps[tipIdx].y, wrist.x, wrist.y);
    const dMcp = dist(kps[mcpIdx].x, kps[mcpIdx].y, wrist.x, wrist.y);
    return dTip > dMcp * 1.2;
  };

  const idx   = extended(8,  5);
  const mid   = extended(12, 9);
  const ring  = extended(16, 13);
  const pinky = extended(20, 17);

  if (idx && !mid && !ring && !pinky) return 'pointing';
  if (idx &&  mid &&  ring &&  pinky) return 'open';
  return 'other';
}

function swatchAt(p) {
  if (!p) return -1;
  for (let i = 0; i < palette.length; i++) {
    const sx = palettePadX;
    const sy = palettePadY + i * (swatchSize + swatchGap);
    if (p.x >= sx && p.x <= sx + swatchSize &&
        p.y >= sy && p.y <= sy + swatchSize) {
      return i;
    }
  }
  return -1;
}

function drawPalette() {
  push();
  for (let i = 0; i < palette.length; i++) {
    const sx = palettePadX;
    const sy = palettePadY + i * (swatchSize + swatchGap);
    const active = !eraserMode && i === activeColorIndex;
    if (active) {
      noFill();
      stroke(255);
      strokeWeight(3);
      rect(sx - 4, sy - 4, swatchSize + 8, swatchSize + 8, 9);
    }
    stroke(0);
    strokeWeight(1);
    fill(palette[i][0], palette[i][1], palette[i][2]);
    rect(sx, sy, swatchSize, swatchSize, 6);
  }

  // Eraser — drawn to look like a classic two-tone schoolroom eraser.
  const ey = eraserY();
  if (eraserMode) {
    noFill();
    stroke(255);
    strokeWeight(3);
    rect(palettePadX - 4, ey - 4, swatchSize + 8, swatchSize + 8, 9);
  }
  const bandH = swatchSize * 0.32;
  // blue felt band on top
  stroke(0);
  strokeWeight(1);
  fill(80, 120, 180);
  rect(palettePadX, ey, swatchSize, bandH, 5, 5, 0, 0);
  // pink body on bottom
  fill(240, 165, 180);
  rect(palettePadX, ey + bandH, swatchSize, swatchSize - bandH, 0, 0, 5, 5);
  // soft highlight on the pink side so it reads as a 3-D block
  noStroke();
  fill(255, 255, 255, 70);
  rect(palettePadX + 4, ey + bandH + 4, swatchSize - 8, 6, 3);

  // Clear button — wider so the label fits inside
  const cy = clearY();
  stroke(40);
  strokeWeight(1);
  fill(28);
  rect(palettePadX, cy, clearWidth, swatchSize, 6);
  // red X on the left
  const xPad = 11;
  const xSize = swatchSize - 2 * xPad;
  stroke(225, 70, 70);
  strokeWeight(3);
  line(palettePadX + xPad,         cy + xPad,
       palettePadX + xPad + xSize, cy + xPad + xSize);
  line(palettePadX + xPad + xSize, cy + xPad,
       palettePadX + xPad,         cy + xPad + xSize);
  // label
  noStroke();
  fill(235);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(12);
  text('CLICK TO CLEAR', palettePadX + swatchSize + 2, cy + swatchSize / 2);
  textStyle(NORMAL);

  pop();
}

function drawCursor(indexTip, thumbTip, pose) {
  push();
  noFill();
  strokeWeight(3);
  if (indexTip) {
    stroke(pose === 'pointing' ? color(255, 255, 255) : color(255, 255, 255, 120));
    circle(indexTip.x, indexTip.y, 22);
  }
  if (pose === 'open' && indexTip && thumbTip) {
    stroke(255, 255, 0, 200);
    strokeWeight(2);
    line(indexTip.x, indexTip.y, thumbTip.x, thumbTip.y);
    circle(thumbTip.x, thumbTip.y, 18);
  }
  pop();
}

function drawHUD(pose) {
  push();
  noStroke();
  fill(0, 140);
  rect(0, 0, width, 56);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(15);

  let msg;
  if (!cam || !cam.ready) msg = 'Starting camera…';
  else if (cameraSwitching)  msg = 'Switching camera…';
  else if (hands.length === 0) msg = 'Show one hand. Point to draw, open palm to stamp.';
  else if (pose === 'pointing') msg = eraserMode ? 'Erasing  ⌫' : 'Drawing  ✎';
  else if (pose === 'open')     msg = eraserMode ? 'Wide erasing  ⌫' : 'Wide stroke  ◯';
  else                          msg = 'Move into a pointing or open pose';
  text(msg, width / 2, 28);
  pop();
}

function drawPhoneCamera(phoneCamera) {
  const v = phoneCamera.videoElement;
  if (!phoneCamera.ready || !v || v.readyState < 2) return;
  const d = phoneCamera.getDimensions();
  push();
  if (phoneCamera.mirror) {
    translate(width, 0);
    scale(-1, 1);
  }
  drawingContext.drawImage(v, d.x, d.y, d.width, d.height);
  pop();
}

function createCameraButton() {
  cameraButton = createButton('Back camera');
  cameraButton.position(width - 130, 14);
  cameraButton.style('position', 'fixed');
  cameraButton.style('z-index', '20');
  cameraButton.style('padding', '10px 12px');
  cameraButton.style('font-size', '13px');
  cameraButton.style('font-weight', '700');
  cameraButton.style('border', '0');
  cameraButton.style('border-radius', '8px');
  cameraButton.style('background', '#ffffff');
  cameraButton.style('color', '#111');
  cameraButton.style('box-shadow', '0 4px 14px rgba(0,0,0,.25)');
  cameraButton.mousePressed(switchCameraView);
}

async function switchCameraView() {
  lastCameraButtonPress = Date.now();
  if (!cam || cameraSwitching) return false;
  cameraSwitching = true;
  hands = [];
  if (handpose && handpose.detectStop) handpose.detectStop();
  const useBack = cam.active !== 'environment';
  cam.mirror = !useBack;
  cam.active = useBack ? 'environment' : 'user';
  cameraButton.html(useBack ? 'Front camera' : 'Back camera');
  await waitForCameraReady();
  if (handpose && cam.videoElement) handpose.detectStart(cam.videoElement, gotHands);
  cameraSwitching = false;
  return false;
}

function waitForCameraReady() {
  return new Promise((resolve) => {
    let attempts = 0;
    const check = () => {
      if (cam && cam.ready && cam.videoElement && cam.videoElement.readyState >= 2) resolve();
      else if (attempts > 100) resolve();
      else { attempts += 1; setTimeout(check, 100); }
    };
    check();
  });
}

function mousePressed() {
  if (Date.now() - lastCameraButtonPress < 400) return false;
  const here = { x: mouseX, y: mouseY };
  if (clearAt(here)) {
    pg.clear();
    return false;
  }
  if (eraserAt(here)) {
    selectEraser();
    return false;
  }
  const tapped = swatchAt(here);
  if (tapped >= 0) {
    selectColor(tapped);
    return false;
  }
  showVideo = !showVideo;
  return false;
}

function mouseReleased() {
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  const old = pg;
  pg = createGraphics(width, height);
  pg.image(old, 0, 0);
  if (cameraButton) cameraButton.position(width - 130, 14);
}
