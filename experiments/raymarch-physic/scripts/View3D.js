'use strict';

let THREE = window.THREE;

import Scene from './Scene';
import EffectComposer from './EffectComposer';

export default class View3D {
  constructor(canvas) {

    this.canvas = canvas;

    /**
     * Public
     */
    this.scene = new Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas
    });
    this.effectComposer = new EffectComposer(this.renderer, this.scene);

    /**
     * Private
     */
    this._requestAnimationFrameId = 0;

    this.resize();

    /**
     * Update only if window is on focus
     */
    this.update();
    if(!document.hasFocus()) {
      this.stop();
    }
    window.addEventListener('blur', () => {
      this.stop();
    });
    window.addEventListener('focus', () => {
      this.update();
    });
  }

  stop() {
    cancelAnimationFrame(this._requestAnimationFrameId);
  }

  resize() {
    let width = this.canvas.offsetWidth * .25;
    let height = this.canvas.offsetHeight * .25;
    this.renderer.setSize( width, height, false );
    this.effectComposer.setSize( width, height );
  }

  update() {
    this._requestAnimationFrameId = requestAnimationFrame(this.update.bind(this));

    this.scene.update();

    this.renderer.render(this.scene, this.scene.camera);

    this.effectComposer.render();
  }
}
