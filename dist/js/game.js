(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(500, 340, Phaser.AUTO, 'super-coin-box');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/menu":3,"./states/play":4,"./states/preload":5}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){

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

},{}],4:[function(require,module,exports){
'use strict';
function Play() {}

Play.prototype = {
	create: function() {
		this.cursor = this.game.input.keyboard.createCursorKeys();

        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP,Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);

        this.wasd = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

		this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
		this.player.anchor.setTo(0.5, 0.5);

        // Create the 'walk' animation by looping the frames 1 - 4
        this.player.animations.add('walk', [0, 1, 2, 3], 8, true);
        // Create 'jump' animation
        this.player.animations.add('jump', [4, 5, 6], 1, false);

		this.game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 500;

		this.enemies = this.game.add.group();
		this.enemies.enableBody = true;
		this.enemies.createMultiple(10, 'enemy');

		this.coin = this.game.add.sprite(60, 140, 'coin');
		this.game.physics.arcade.enable(this.coin);
		this.coin.anchor.setTo(0.5, 0.5);

        this.coin.animations.add('spin');
        this.coin.animations.play('spin', 15, true);

		this.scoreLabel = this.game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });
		this.game.global.score = 0;

		this.createWorld();

        this.nextEnemy = 0;

        this.jumpSound = this.game.add.audio('jump');
        this.coinSound = this.game.add.audio('coin');
        this.deadSound = this.game.add.audio('dead');

        this.music = this.game.add.audio('music'); // Add the music
        this.music.loop = true; // Make it loop
        this.music.play(); // Start the music

        // Create the emitter with 15 particles. We don't need to set the x and y
        // Since we don't know where to do the explosion yet
        this.emitter = this.game.add.emitter(0, 0, 15);
        // Set the 'pixel' image for the particles
        this.emitter.makeParticles('pixel');
        // Set the y speed of the particles between -150 and 150
        // The speed will be randomly picked between -150 and 150 for each particle
        this.emitter.setYSpeed(-150, 150);
        // Do the same for the x speed
        this.emitter.setXSpeed(-150, 150);
        // Use no gravity for the particles
        this.emitter.gravity = 0;

        // If the game is running on a mobile device
        if (!this.game.device.desktop) {
            // Display the mobile inputs
            this.addMobileInputs();
        }
	},

	update: function() {
		this.game.physics.arcade.collide(this.player, this.layer);
		this.game.physics.arcade.collide(this.enemies, this.layer);
		this.game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
		this.game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

		this.movePlayer();

		if (!this.player.inWorld) {
			this.playerDie();
		}

        // If the 'nextEnemy' time has passed
        if (this.nextEnemy < this.game.time.now) {
            var start = 4000, end = 1000, score = 100;

            var delay = Math.max(start - (start-end)*this.game.global.score/score, end);
            // We add a new enemy
            this.addEnemy();
            // And we update 'nextEnemy' to have a new enemy in 2.2 seconds
            this.nextEnemy = this.game.time.now + delay;
        }
	},

	movePlayer: function() {
		if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
			this.player.body.velocity.x = -200;
            this.player.anchor.setTo(0.5, 1);
            this.player.scale.x = -1;
            if (this.player.body.onFloor())
            {
                this.player.animations.play('walk');
            }
            this.player.anchor.setTo(0.5, 0.5);
		}
		else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
			this.player.body.velocity.x = 200;
            this.player.anchor.setTo(0.5, 1);
            this.player.scale.x = 1;
            if (this.player.body.onFloor())
            {
                this.player.animations.play('walk');
            }
            this.player.anchor.setTo(0.5, 0.5);
		}
		else {
			this.player.body.velocity.x = 0;
            this.player.animations.stop(); // Stop the animation
            this.player.frame = 0; // Set the player frame to 0 (stand still)
		}

		if (this.cursor.up.isDown || this.wasd.up.isDown) {
            this.jumpPlayer();
		}
	},

    jumpPlayer: function() {
        // If the player is touching the ground
        if (this.player.body.onFloor()) {
            // Jump with sound
            this.jumpSound.play();
            this.player.body.velocity.y = -320;
            this.player.animations.play('jump');
        }
    },

	takeCoin: function(player, coin) {
		this.game.global.score += 5;
		this.scoreLabel.text = 'score: ' + this.game.global.score;

        this.game.add.tween(coin.scale).to({x: 0, y: 0}, 300).start();
        coin.scale.setTo(0, 0);
        this.game.add.tween(coin.scale).to({x: 1, y: 1}, 300).start();

        this.coinSound.play();

		this.updateCoinPosition();
	},

	updateCoinPosition: function() {
		var coinPosition = [
			{x: 140, y: 60}, {x: 360, y: 60},
			{x: 60, y: 140}, {x: 440, y: 140},
			{x: 130, y: 300}, {x: 370, y: 300}
		];

		for (var i = 0; i < coinPosition.length; i++) {
			if (coinPosition[i].x === this.coin.x) {
				coinPosition.splice(i, 1);
			}
		}

		var newPosition = coinPosition[this.game.rnd.integerInRange(0, coinPosition.length-1)];
		this.coin.reset(newPosition.x, newPosition.y);
	},

	addEnemy: function() {
		var enemy = this.enemies.getFirstDead();
		if (!enemy) {
			return;
		}

		enemy.anchor.setTo(0.5, 1);
		enemy.reset(this.game.world.centerX, 0);
		enemy.body.gravity.y = 500;
		enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
		enemy.body.bounce.x = 1;
		enemy.checkWorldBounds = true;
		enemy.outOfBoundsKill = true;
	},

	createWorld: function() {
        // Create the tilemap
        this.map = this.game.add.tilemap('map');
        // Add the tileset to the map
        this.map.addTilesetImage('tileset');
        // Create the layer, by specifying the name of the Tiled layer
        this.layer = this.map.createLayer('Tile Layer 1');
        // Set the world size to match the size of the layer
        this.layer.resizeWorld();

        // Enable collisions for the first element of our tileset (the blue wall)
        this.map.setCollision(1);
	},

	playerDie: function() {
        // If the player is already dead, do nothing
        if (!this.player.alive) {
            return;
        }
        // Kill the player
        this.player.kill();
        // The part that will be executed only once
        this.deadSound.play();
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 600, null, 15);
        this.game.time.events.add(1000, this.startMenu, this);
	},

    startMenu: function() {
		this.game.state.start('menu');
	},
    addMobileInputs: function() {
        // Add the jump button
        this.jumpButton = this.game.add.sprite(350, 247, 'jumpButton');
        this.jumpButton.inputEnabled = true;
        this.jumpButton.alpha = 0.5;
        // Call 'jumpPlayer' when the 'jumpButton' is pressed
        this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);

        // Add the move left button
        this.leftButton = this.game.add.sprite(50, 247, 'leftButton');
        this.leftButton.inputEnabled = true;
        this.leftButton.alpha = 0.5;
        this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this);
        this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this);

        // Add the move right button
        this.rightButton = this.game.add.sprite(130, 247, 'rightButton');
        this.rightButton.inputEnabled = true;
        this.rightButton.alpha = 0.5;
        this.rightButton.events.onInputOver.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputOut.add(function(){this.moveRight=false;}, this);
        this.rightButton.events.onInputDown.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputUp.add(function(){this.moveRight=false;}, this);
    },
};

module.exports = Play;

},{}],5:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    var loadingLabel = this.game.add.text(this.game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' });
    loadingLabel.anchor.setTo(0.5, 0.5);
    // Display the progress bar
    var progressBar = this.game.add.sprite(this.game.world.centerX, 200, 'progressBar'); progressBar.anchor.setTo(0.5, 0.5); this.game.load.setPreloadSprite(progressBar);
    // Load all our assets
    this.game.load.spritesheet('player', 'assets/player.png', 32, 32);
    this.game.load.image('enemy', 'assets/enemy.png');

    this.game.load.atlasJSONHash('coin', 'assets/coin_sprite.png', 'assets/coin_sprite.json');
    //this.game.load.image('coin', 'assets/coin.png');

    this.game.load.image('tileset', 'assets/tileset.png');
    this.game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);

    // Load a new asset that we will use in the menu state
    this.game.load.image('background', 'assets/background.png');

    this.game.load.image('pixel', 'assets/pixel.png');

    //Sounds
    // Sound when the player jumps
    this.game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
    // Sound when the player takes a coin
    this.game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
    // Sound when the player dies
    this.game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);

    //Music
    this.game.load.audio('music', ['assets/music.ogg', 'assets/music.mp3']);

    // Mute button
    this.game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);

    // Mobile buttons
    this.game.load.image('jumpButton', 'assets/jumpButton.png');
    this.game.load.image('rightButton', 'assets/rightButton.png');
    this.game.load.image('leftButton', 'assets/leftButton.png');
  },
  create: function() {
      this.game.state.start('menu');
  }
};

module.exports = Preload;

},{}]},{},[1])