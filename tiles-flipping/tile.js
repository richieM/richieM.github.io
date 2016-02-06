/*
This class will represent one tile in the 2d grid
*/

function Tile(x, y, rotationTime){ // do we want arguments to the constructor?
	
	// Properties
	this.x = x;
	this.y = y;
	this.rotationTime = rotationTime;

	this.frontColor;
	this.backColor;

	this.rotationParameters;

	this.rotateSpeed;

	this.amIRotating = false;
	this.howManyTimesHaveIRotated = 0;

	this.startingRed = [100, 200, 150];
	this.startingGreen = [80, 200, 150];
	this.startingBlue = [200, 200, 150];

	this.currentRed = this.startingRed[howManyTimesHaveIRotated % this.startingRed.length] + random(colorToggle);

	// Functions (actions)

	this.draw =  function() {
		if (this.amIRotating) {
			// do cool rotation animation stuff
		}
	}

	// TODO: maybe?
	this.triggerNextRotations = function() {

	}

}