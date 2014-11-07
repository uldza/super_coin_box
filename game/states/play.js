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
		this.game.physics.arcade.collide(this.enemies, this.layer, this.enemyHit, null, this);
		this.game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
		this.game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

		this.movePlayer();

		if (!this.player.inWorld) {
			this.playerDie();
		}

        this.enemies.callAll('checkLocation');

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
		enemy.reset(this.game.world.centerX+10, 0);
        enemy.scale.x = 1;

		enemy.body.gravity.y = 500;
		enemy.body.velocity.x = 100 * Phaser.Math.randomSign();

        if(enemy.body.velocity.x <= 0) enemy.scale.x = -1;

		enemy.body.bounce.x = 1;
		enemy.checkWorldBounds = true;
		enemy.outOfBoundsKill = true;

        enemy.animations.add('crawl', [0, 1, 2, 3], 8, true);
        enemy.animations.play('crawl');

        enemy.checkLocation = function() {
            if(enemy.body.blocked.left) enemy.scale.x = 1;
            if(enemy.body.blocked.right) enemy.scale.x = -1;
        };
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
        this.jumpButton = this.game.add.sprite(400, 247, 'jumpButton');
        this.jumpButton.inputEnabled = true;
        this.jumpButton.alpha = 0.5;
        // Call 'jumpPlayer' when the 'jumpButton' is pressed
        this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);

        // Add the move left button
        this.leftButton = this.game.add.sprite(0, 247, 'leftButton');
        this.leftButton.inputEnabled = true;
        this.leftButton.alpha = 0.5;
        this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this);
        this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this);

        // Add the move right button
        this.rightButton = this.game.add.sprite(80, 247, 'rightButton');
        this.rightButton.inputEnabled = true;
        this.rightButton.alpha = 0.5;
        this.rightButton.events.onInputOver.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputOut.add(function(){this.moveRight=false;}, this);
        this.rightButton.events.onInputDown.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputUp.add(function(){this.moveRight=false;}, this);
    },
};

module.exports = Play;
