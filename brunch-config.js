'use strict';

var es6Experiments = [
  'raymarch-physic',
  'substrate',
  'crystal-city'
];

exports.config = {
  paths: {
    watched: [
      'app',
      'node_modules/babel-brunch/node_modules/babel-core/browser-polyfill.js'
    ]
  },
  conventions: {
    assets: function (path) {
      return /^app/.test(path) && !/\.(js|css|scss)/.test(path);
    },
    vendor: /(^bower_components|node_modules|vendor)[\\/]/
  },
  files: {
    javascripts: {
      joinTo: Object.defineProperties({
        'vendors/common.js': [
          'node_modules/babel-brunch/node_modules/babel-core/browser-polyfill.js',
          'bower_components/fetch/**/*',
          'app/dlib/**/*'
        ],
        'scripts/main.js': /^app[\\/]scripts/,
        'vendors/dat-gui.js': 'bower_components/dat-gui/**/*',
        'vendors/cannon.js': 'bower_components/cannon.js/**/*',
        'vendors/clmtrackr.js': 'bower_components/clmtrackr/**/*',
        'vendors/leap.js': 'bower_components/leapjs/**/*',
        'vendors/three.js': [
          'bower_components/threejs/**/*',
          'bower_components/THREE.*/**/*'
        ]
      },
      (function() {
        var obj = {};
        for (var i = 0; i < es6Experiments.length; i++) {
          var experimentName = es6Experiments[i];
          obj['experiments/' + experimentName + '/scripts/main.js'] = {
            value:'app/experiments/' + experimentName + '/scripts/**/*.js',
            enumerable: true
          };
        }
        return obj;
      })()
      ),
      order: {
        before: ['bower_components/threejs/build/three.js']
      }
    },
    stylesheets: {
      joinTo: 'styles/main.css'
    }
  },
  onCompile: function() {
    require('fs').appendFile('public/scripts/main.js', '\n\nrequire(\'scripts/main\');');
    for (var i = 0; i < es6Experiments.length; i++) {
      var experimentName = es6Experiments[i];
      require('fs').appendFile('public/experiments/' + experimentName + '/scripts/main.js', '\n\nrequire(\'experiments/' + experimentName + '/scripts/main\');');
    }
  }
};
