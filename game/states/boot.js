'use strict';

function Boot() {
}

Boot.prototype = {
    preload: function() {
        this.game.load.image('progressBar', 'assets/progressBar.png');

        this.game.global = {
            score: 0
        };

    },
    create: function() {
        this.game.stage.backgroundColor = '#3498db';
        this.game.physics.startSystem( Phaser.Physics.ARCADE );

        // If the device is not a desktop, so it's a mobile device
        if (!this.game.device.desktop) {
            // Set the type of scaling to 'show all'
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // Add a blue color to the page, to hide the white borders we might have
            document.body.style.backgroundColor = '#3498db';
            // Set the min and max width/height of the game
            this.game.scale.minWidth = 250;
            this.game.scale.minHeight = 170;
            this.game.scale.maxWidth = 1000;
            this.game.scale.maxHeight = 680;
            // Center the game on the screen
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            // Apply the scale changes
            this.game.scale.setScreenSize(true);
        }
        else
        {
            document.getElementById('super-coin-box').style.width = '500px';
        }

        // Start the load state
        this.game.state.start('preload');
    }
};

module.exports = Boot;
