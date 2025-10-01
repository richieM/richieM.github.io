let scaleFactor = 4;
let canvasSize = 1000;

function setup() {
  pixelDensity(1);
  createCanvas(canvasSize * scaleFactor, canvasSize * scaleFactor);
  noLoop();
  noSmooth();

  scale(scaleFactor);
  background(255);  // 👈 must come *after* scale() so it covers the full canvas

  stroke(0);
  noFill();

  let shapesPerRow = 3;
  let totalShapes = 15;
  let cellSize = 180;
  let radius = 85;

  for (let i = 0; i < totalShapes; i++) {
    let sides = i + 3;
    let col = i % shapesPerRow;
    let row = Math.floor(i / shapesPerRow);
    let centerX = col * cellSize + cellSize / 2;
    let centerY = row * cellSize + cellSize / 2;

    drawPolygonWithLines(centerX, centerY, radius, sides);
  }

  //saveCanvas("shapes-hires", "png");
}

function drawPolygonWithLines(cx, cy, r, sides) {
  let points = [];
  for (let i = 0; i < sides; i++) {
    let angle = TWO_PI * i / sides - HALF_PI;
    let x = cx + Math.cos(angle) * r;
    let y = cy + Math.sin(angle) * r;
    points.push({ x, y });
  }

  for (let i = 0; i < sides; i++) {
    for (let j = i + 1; j < sides; j++) {
      line(points[i].x, points[i].y, points[j].x, points[j].y);
    }
  }
}
