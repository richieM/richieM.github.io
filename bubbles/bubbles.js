/*
Thinking about bubbles:
Options to control / parameters:

starting position: X and Y -- could just be random, who cares
speed: how fast is it moving?
path along which it travels: linear, sinusoidal, drunk walk, etc
behavior when it hits an edge: wrap around, or bounce off?
ball color:
ball size:

Have it autoplay!
*/

function Bubble(x, y, speed){

	this.x = weightedRandom(floor(2*windowWidth/3),floor(windowWidth/6),0,windowWidth);
	this.y = weightedRandom(floor(2*windowHeight/3),floor(windowHeight/6),0,windowHeight);
	this.xSpeed = weightedRandom(0,5,-15,15);
	this.ySpeed = weightedRandom(0,5,-15,15);


	// 144,229,203 is weird cyan-ish
	this.red = weightedRandom(144, 50, 0, 255);
	this.green = weightedRandom(229, 15, 0, 255);
	this.blue = weightedRandom(203, 25, 0, 255);
	this.transp = weightedRandom(150, 60, 0, 255);

	this.radius = weightedRandom(30, 10, 0, 60);


	this.display = function() {
		noStroke();
  		fill(this.red, this.green, this.blue, this.transp);
  		ellipse(this.x, this.y, this.radius, this.radius);
	}

	this.move = function() {
		this.x = this.x - this.xSpeed;
		this.y = this.y - this.ySpeed;
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
}

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