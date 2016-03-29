/*

This is effectively a class to control the moire points
that are flying around in circles

Keep in mind:
 **The only output from here is an (x,y) coord

Inspired by richiem.github.io/bubbles
*/

function MoirePoint(quadrant) {
	this.quadrant = quadrant;
	this.width = windowWidth/4;
	this.leftX = this.quadrant * this.width;
	this.rightX = (this.quadrant + 1) * this.width;
	
	this.x = weightedRandom(floor(this.leftX + this.width),floor(this.width/2),this.leftX,this.rightX);
	this.y = weightedRandom(floor(windowHeight/2),floor(windowHeight/6),0,windowHeight);

	this.xSpeed = weightedRandom(0,3,-10,10);
	this.ySpeed = weightedRandom(0,3,-10,10);

	this.xSinMvtSize = random(0,140); // weightedRandom(80,20,0,160);
	this.ySinMvtSize = random(0,140); // weightedRandom(80,20,0,160);
	this.xSinMvtSpeed = weightedRandom(.07,.04,.00001,.4);
	this.xSinMvtAlpha = 0;
	this.ySinMvtSpeed = weightedRandom(.07,.04,.00001,.4);
	this.ySinMvtAlpha = 0;

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
		} else if (this.x < this.leftX) {
			this.x = this.rightX;
		} else if (this.x > this.rightX) {
			this.x = this.leftX;
		}
	}
}


// **************
// Utility fnxs

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