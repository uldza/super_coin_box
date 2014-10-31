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