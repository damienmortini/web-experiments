exports.config = {
  conventions: {
    assets: [
      /app[\\/](?!scripts|styles)/
    ]
  },
  files: {
    javascripts: {
      joinTo: {
        'scripts/vendor.js': /^bower_components/,
        'scripts/main.js': /^app/
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
    require('fs').appendFile('public/scripts/main.js', '\n\nrequire(\'scripts/main\');');
  }
};
