exports.config = {
  paths: {
    watched: [
      'app',
      'node_modules/babel-brunch/node_modules/babel-core/browser-polyfill.js'
    ]
  },
  conventions: {
    assets: function (path) {
      return /^app/.test(path) && !/scripts|styles/.test(path);
    }
  },
  files: {
    javascripts: {
      joinTo: {
        'scripts/vendor.js': [
          'node_modules/babel-brunch/node_modules/babel-core/browser-polyfill.js',
          /^bower_components/
        ],
        'scripts/main.js': /^app[\\/]scripts/,
        'experiments/raymarch-physic/scripts/main.js': /^app[\\/]experiments[\\/]raymarch-physic[\\/]scripts/
      },
      order: {
        before: ['bower_components/threejs/build/three.js']
      }
    },
    stylesheets: {
      joinTo: 'styles/main.css'
    }
  },
  onCompile: function() {
    'use strict';
    require('fs').appendFile('public/scripts/vendor.js', '\n\nrequire(\'node_modules/babel-brunch/node_modules/babel-core/browser-polyfill\');');
    require('fs').appendFile('public/scripts/main.js', '\n\nrequire(\'scripts/main\');');
    require('fs').appendFile('public/experiments/raymarch-physic/scripts/main.js', '\n\nrequire(\'experiments/raymarch-physic/scripts/main\');');
  }
};
