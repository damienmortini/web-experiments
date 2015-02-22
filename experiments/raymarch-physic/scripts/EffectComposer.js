'use strict';

let THREE = window.THREE;

/**
 * Fix to extend THREE.EffectComposer
 */
THREE.EffectComposer.prototype.constructor = THREE.EffectComposer;

import ShaderLoader from './ShaderLoader';

export default class EffectComposer extends THREE.EffectComposer {
  constructor(renderer, scene) {

    this.scene = scene;

    super(renderer, new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    }));

    /**
     * Load shader
     */
    ShaderLoader.load('./shaders/world.vert', './shaders/world.frag').then(
      (shader) => {
        /**
         * Add pass
         */
        this.shaderPass = new THREE.ShaderPass(shader);
        this.shaderPass.renderToScreen = true;
        this.addPass(this.shaderPass);

        this.shaderPass.uniforms.uResolution.value.set(this.writeBuffer.width, this.writeBuffer.height);

        let camera = this.scene.camera;

        this.shaderPass.uniforms.uNear.value = camera.near;
        this.shaderPass.uniforms.uFar.value = camera.far;
        this.shaderPass.uniforms.uFov.value = camera.fov;
        this.shaderPass.uniforms.uModelViewMatrix.value = camera.matrixWorldInverse;
        this.shaderPass.uniforms.uProjectionMatrix.value = camera.projectionMatrix;

        this.render();
      }
    );
  }

  setSize(width, height) {
    super.setSize(width, height);
  }
}
