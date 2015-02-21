'use strict';

let THREE = window.THREE;

import ShaderLoader from './ShaderLoader';

export default class Scene extends THREE.Scene {
  constructor() {
    super();

    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    ShaderLoader.load('./shaders/world.vert', './shaders/world.frag').then(
      function (result) {
        console.log(result);
      }
    );
  }
}
