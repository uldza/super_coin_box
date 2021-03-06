// Generated on 2014-03-28 using generator-phaser-official 0.0.8-rc-2
'use strict';
var config = require('./config.json');
var pkg = require('./package.json');
var _ = require('underscore');
_.str = require('underscore.string');

// Mix in non-conflict functions to Underscore namespace if you want
_.mixin(_.str.exports());

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    watch: {
      scripts: {
        files: [
            'game/**/*.js',
            '!game/main.js'
        ],
        options: {
          spawn: false,
          livereload: LIVERELOAD_PORT
        },
        tasks: ['build']
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'dist')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:9000'
      }
    },
    copy: {
      dist: {
        files: [
          // includes files within path and its sub-directories
          { expand: true, src: ['assets/**'], dest: 'dist/' },
          { expand: true, flatten: true, src: ['game/plugins/*.js'], dest: 'dist/js/plugins/' },
          { expand: true, flatten: true, src: ['bower_components/**/build/*.js'], dest: 'dist/js/' },
          { expand: true, src: ['css/**'], dest: 'dist/' },
          { expand: true, src: ['index.html'], dest: 'dist/' }
        ]
      }
    },
    browserify: {
      build: {
        src: ['game/main.js'],
        dest: 'dist/js/game.js'
      }
    },
    shipit: {
      options: {
        workspace: '/tmp/github-monitor',

        // Project will be deployed in this directory.
        deployTo: '/var/www/apps/',

        // Repository url.
        repositoryUrl: pkg.repository.url,

        // This files will not be transfered.
        ignores: ['.git', 'node_modules'],

        // Number of release to keep (for rollback).
        keepReleases: 3
      },
      production: {
        servers: 'demo@example.com:22',
      }
    },
    prompt: {
        server: {
          options: {
            questions: [
              {
                config: 'shipit.production.servers',
                type: 'input',
                message: 'Remote server address',
                default: 'demo@example.com:22',
              },
              {
                config: 'shipit.options.deployTo',
                type: 'input',
                message: 'Target directory',
                default: '/var/www',
              }
            ]
          }
        },
    }
  });

  grunt.registerTask('build', ['buildBootstrapper', 'browserify','copy']);
  grunt.registerTask('serve', ['build', 'connect:livereload', 'open', 'watch']);
  grunt.registerTask('default', ['serve']);

  grunt.registerTask('remote_prepare', function() {
      grunt.task.requires('build');
      grunt.task.requires('copy');
      grunt.task.requires('prompt:server');
      grunt.task.run(['shipit:production','deploy']);
  });

  grunt.registerTask('deployment', ['build','copy', 'prompt:server', 'remote_prepare']);

  grunt.registerTask('buildBootstrapper', 'builds the bootstrapper file correctly', function() {
    var stateFiles = grunt.file.expand('game/states/*.js');
    var gameStates = [];
    var statePattern = new RegExp(/(\w+).js$/);
    stateFiles.forEach(function(file) {
      var state = file.match(statePattern)[1];
      if (!!state) {
        gameStates.push({shortName: state, stateName: _.capitalize(state) + 'State'});
      }
    });
    config.gameStates = gameStates;
    console.log(config);
    var bootstrapper = grunt.file.read('templates/_main.js.tpl');
    bootstrapper = grunt.template.process(bootstrapper,{data: config});
    grunt.file.write('game/main.js', bootstrapper);
  });
};
