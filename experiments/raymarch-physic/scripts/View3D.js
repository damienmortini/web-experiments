'use strict';

let THREE = window.THREE;

import Scene from './Scene';

export default class View3D {
  constructor(canvas) {
    /**
     * Private
     */
    this._requestAnimationFrameId = 0;

    /**
     * Public
     */
    this.scene = new Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas
    });
    this.renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );

    /**
     * Update only if window is on focus
     */
    if(document.hasFocus()) {
      this.update();
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

  update() {
    this._requestAnimationFrameId = requestAnimationFrame(this.update.bind(this));
    this.renderer.render(this.scene, this.scene.camera);
  }
}
