'use strict';

let THREE = window.THREE;

import GLSLRaymarchComposer from './GLSLRaymarchComposer';
import ShaderLoader from './ShaderLoader';

export default class View3D {
  constructor(canvas) {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas
    });
    this.renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );
    this.render();
    this.compose();

    var shaderLoader = new ShaderLoader('./shaders/world.vert', './shaders/world.frag');
  }

  compose() {
    new GLSLRaymarchComposer(this.renderer);
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
  }
}
