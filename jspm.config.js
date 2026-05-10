SystemJS.config({
  nodeConfig: {
    "paths": {
      "github:": "jspm_packages/github/",
      "npm:": "jspm_packages/npm/"
    }
  },
  devConfig: {
    "map": {
      "babel": "npm:babel-core@5.8.38",
      "babel-runtime": "npm:babel-runtime@5.8.38",
      "core-js": "npm:core-js@1.2.6",
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.10"
    }
  },
  transpiler: "plugin-babel",
  babelOptions: {
    "es2015": false
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "buffer": "npm:jspm-nodelibs-buffer@0.2.0",
    "dlib": "npm:dlib@0.0.4",
    "events": "npm:jspm-nodelibs-events@0.2.0",
    "fs": "npm:jspm-nodelibs-fs@0.2.0",
    "path": "npm:jspm-nodelibs-path@0.2.0",
    "process": "npm:jspm-nodelibs-process@0.2.0",
    "text": "github:systemjs/plugin-text@0.0.4",
    "three": "npm:three@0.78.0",
    "webcomponents.js": "npm:webcomponents.js@0.7.22"
  },
  packages: {
    "npm:buffer@4.6.0": {
      "map": {
        "base64-js": "npm:base64-js@1.1.2",
        "ieee754": "npm:ieee754@1.1.6",
        "isarray": "npm:isarray@1.0.0"
      }
    },
    "npm:d@0.1.1": {
      "map": {
        "es5-ext": "npm:es5-ext@0.10.11"
      }
    },
    "npm:dlib@0.0.4": {
      "map": {
        "event-emitter": "npm:event-emitter@0.3.4",
        "gl-matrix": "npm:gl-matrix@2.3.2",
        "howler": "npm:howler@1.1.29",
        "min-signal": "npm:min-signal@0.0.5",
        "webcomponents.js": "npm:webcomponents.js@0.7.22"
      }
    },
    "npm:es5-ext@0.10.11": {
      "map": {
        "es6-iterator": "npm:es6-iterator@2.0.0",
        "es6-symbol": "npm:es6-symbol@3.0.2"
      }
    },
    "npm:es6-iterator@2.0.0": {
      "map": {
        "d": "npm:d@0.1.1",
        "es5-ext": "npm:es5-ext@0.10.11",
        "es6-symbol": "npm:es6-symbol@3.1.0"
      }
    },
    "npm:es6-symbol@3.0.2": {
      "map": {
        "d": "npm:d@0.1.1",
        "es5-ext": "npm:es5-ext@0.10.11"
      }
    },
    "npm:event-emitter@0.3.4": {
      "map": {
        "d": "npm:d@0.1.1",
        "es5-ext": "npm:es5-ext@0.10.11"
      }
    },
    "npm:es6-symbol@3.1.0": {
      "map": {
        "d": "npm:d@0.1.1",
        "es5-ext": "npm:es5-ext@0.10.11"
      }
    },
    "npm:jspm-nodelibs-buffer@0.2.0": {
      "map": {
        "buffer-browserify": "npm:buffer@4.6.0"
      }
    }
  }
});
