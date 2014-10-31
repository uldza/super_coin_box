
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
    this.game.load.spritesheet('player', 'assets/player2.png', 20, 20);
    this.game.load.image('enemy', 'assets/enemy.png');

    this.game.load.image('coin', 'assets/coin.png');

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
