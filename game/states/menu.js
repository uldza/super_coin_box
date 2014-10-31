
'use strict';
function Menu() {}

Menu.prototype = {
 create: function() {
		this.game.add.image(0, 0, 'background');

		var nameLabel = this.game.add.text(this.game.world.centerX, -50, 'Super Coin Box', { font: '70px Geo', fill: '#ffffff' });
		nameLabel.anchor.setTo(0.5, 0.5);

        // Add the mute button that calls the 'toggleSound' function when pressed
        this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound, this);
        // If the mouse is over the button, it becomes a hand cursor
        this.muteButton.input.useHandCursor = true;

         // If the game is already muted
        if(this.game.sound.mute) {
            // Change the frame to display the speaker with no sound
            this.muteButton.frame = 1;
        }

        // Create a tween on the label
        var tween = this.game.add.tween(nameLabel);
        // Change the y position of the label to 80, in 1000 ms
        tween.to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out); // Start the tween
        tween.start();

        // If 'bestScore' is not defined
        // It means that this is the first time the game is played
        if(!localStorage.getItem('bestScore')) {
          // Then set the best score to 0
          localStorage.setItem('bestScore', 0);
        }
        // If the score is higher than the best score
        if(this.game.global.score > localStorage.getItem('bestScore')) {
          // Then update the best score
          console.log(this.game.global.score);
          localStorage.setItem('bestScore', this.game.global.score);
        }

        var text = 'score: ' + this.game.global.score + '\nbest score: ' + localStorage.getItem('bestScore');
        var scoreLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY, text, { font: '25px Arial', fill: '#ffffff', align: 'center' });
        scoreLabel.anchor.setTo(0.5, 0.5);

        // Store the relevant text based on the device used
        if (this.game.device.desktop) {
            text = 'press the up arrow key to start';
        }
        else {
            text = 'touch the screen to start';
        }

		var startLabel = this.game.add.text(this.game.world.centerX, this.game.world.height-80, text, { font: '25px Arial', fill: '#ffffff' });
		startLabel.anchor.setTo(0.5, 0.5);

        this.game.add.tween(startLabel).to({angle: -2}, 700).to({angle: 2}, 700).loop().start();

		var upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
		var upKey2 = this.game.input.keyboard.addKey(Phaser.Keyboard.W);

        //For touch
        this.game.input.onDown.addOnce(this.start, this);
        //For buttons
		upKey.onDown.addOnce(this.start, this);
		upKey2.onDown.addOnce(this.start, this);

	},

	start: function() {
		this.game.state.start('play');
	},

    // Function called when the 'muteButton' is pressed
    toggleSound: function() {
        // Switch the Phaser sound variable from true to false, or false to true
        // When 'game.sound.mute = true', Phaser will mute the game
        this.game.sound.mute = !this.game.sound.mute;
        // Change the frame of the button
        this.muteButton.frame = this.game.sound.mute ? 1 : 0;
    },
};

module.exports = Menu;
