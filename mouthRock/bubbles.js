/*
Thinking about bubbles:
Options to control / parameters:

starting position: X and Y -- could just be random, who cares
speed: how fast is it moving?
path along which it travels: linear, sinusoidal, drunk walk, etc
behavior when it hits an edge: wrap around, or bounce off?
ball color:
ball size:
xHave it autoplay!
*/

export function BubbleMP(W, H, startX, startY) {
	//p.ellipse(p.random(0,W), p.random(0,H), p.random(0,50), p.random(0,50));
	this.x = startX
	this.y = startY
	this.xSpeed = p.random(0,5)
	this.xSpeed = p.random(0,5)
	this.radius = p.random(50,100)

	this.W = W
	this.H = H

	this.display = function() {
			noStroke();

  		ellipse(this.x, this.y, this.radius, this.radius);
	}

	this.move = function() {

		this.x = this.x - this.xSpeed
		this.y = this.y - this.ySpeed

		this.wrapBackOntoScreen();
	}

	this.wrapBackOntoScreen = function() {
		if (this.y < 0) {
			this.y = this.H;
		} else if (this.y > thisH) {
			this.y = 0;
		} else if (this.x < 0) {
			this.x = this.W;
		} else if (this.x > this.W) {
			this.x = 0;
		}
	}
}

export function Bubble(){
	// Location stuff
	this.x = weightedRandom(floor(2*windowWidth/3),floor(windowWidth/6),0,windowWidth);
	this.y = weightedRandom(floor(2*windowHeight/3),floor(windowHeight/6),0,windowHeight);
	this.xSpeed = weightedRandom(0,5,-20,20);
	this.ySpeed = weightedRandom(0,5,-20,20);

	this.xSinMvtSize = random(0,140); // weightedRandom(80,20,0,160);
	this.ySinMvtSize = random(0,140); // weightedRandom(80,20,0,160);
	this.xSinMvtSpeed = weightedRandom(.07,.04,.00001,.4);
	this.xSinMvtAlpha = 0;
	this.ySinMvtSpeed = weightedRandom(.07,.04,.00001,.4);
	this.ySinMvtAlpha = 0;

	// Radius Stuff
	this.radius = weightedRandom(40, 15, 15, 120);
	this.radiusGrowthSize = weightedRandom(15,8,0,120);
	this.radiusGrowthSpeed = weightedRandom(.07,.04,.00001,.4);
	this.radiusGrowthAlpha = 0;

	// Color Stuff
	// 1 out of 4 times use a diff color scheme
	if (floor(random(0,4)) % 4 == 0) {
		this.red = weightedRandom(68, 20, 0, 255);
		this.green = weightedRandom(116, 20, 0, 255);
		this.blue = weightedRandom(134, 20, 0, 255);
		this.transp = weightedRandom(150, 100, 0, 255);
	} else {
		this.red = weightedRandom(144, 50, 0, 255);
		this.green = weightedRandom(200, 25, 0, 255);
		this.blue = weightedRandom(203, 25, 0, 255);
		this.transp = weightedRandom(150, 60, 0, 255);
	}

	this.display = function() {
		noStroke();
  		fill(this.red, this.green, this.blue, this.transp);

  		currRadius = this.radius + this.radiusGrowthSize * (sin(this.radiusGrowthAlpha) -  sin(this.radiusGrowthAlpha - this.radiusGrowthSpeed));

  		ellipse(this.x, this.y, currRadius, currRadius);

  		this.radiusGrowthAlpha += this.radiusGrowthSpeed;
  		this.radius = currRadius;
	}

	this.move = function() {

		this.x = this.x - this.xSpeed - this.xSinMvtSize * (sin(this.xSinMvtAlpha) - sin(this.xSinMvtAlpha - this.xSinMvtSpeed)) //- weightedRandom(0,1,-2,2);
		this.y = this.y - this.ySpeed - this.ySinMvtSize * (sin(this.ySinMvtAlpha) - sin(this.ySinMvtAlpha - this.ySinMvtSpeed)) //-  weightedRandom(0,1,-2,2)

		this.xSinMvtAlpha +=  this.xSinMvtSpeed;
		this.ySinMvtAlpha +=  this.ySinMvtSpeed;

		this.wrapBackOntoScreen();
	}

	this.wrapBackOntoScreen = function() {
		if (this.y < 0) {
			this.y = windowHeight;
		} else if (this.y > windowHeight) {
			this.y = 0;
		} else if (this.x < 0) {
			this.x = windowWidth;
		} else if (this.x > windowWidth) {
			this.x = 0;
		}
	}

	this.cursorOverBubble = function(){
		var d = int(dist(this.x, this.y, mouseX, mouseY));
		if(d<100){
			return true;
		} else{
			return false;
		}

	}
}

function weightedRandom(mean, stDev, min, max) {
		num = p.randomGaussian(mean, stDev);
		if (num < min) {
			return min;
		} else if (num > max) {
			return max;
		} else {
			return num;
		}
	}
