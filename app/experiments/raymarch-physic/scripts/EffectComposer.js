'use strict';

import Shader from 'dlib/threejs/Shader';

let THREE = window.THREE;
let fetch = window.fetch;

/**
 * Fix to extend THREE.EffectComposer
 */
THREE.EffectComposer.prototype.constructor = THREE.EffectComposer;

export default class EffectComposer extends THREE.EffectComposer {
  constructor(renderer, scene) {

    super(renderer, new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    }));

    this.scene = scene;
    this.objects3D = [];

    /**
     * Load shader
     */
    Promise.all([
      fetch('./shaders/world.vert').then((response) => response.text()),
      fetch('./shaders/world.frag').then((response) => response.text())
    ]).then(([vertexShader, fragmentShader]) => {
      let shader = new Shader(
        vertexShader,
        fragmentShader
      );

      /**
       * Add pass
       */
      this.shaderPass = new THREE.ShaderPass(shader);
      this.shaderPass.renderToScreen = true;
      this.addPass(this.shaderPass);

      this.shaderPass.uniforms.resolution.value.set(this.writeBuffer.width, this.writeBuffer.height);

      let camera = this.scene.camera;

      this.shaderPass.uniforms.cameraNear.value = camera.near;
      this.shaderPass.uniforms.cameraFar.value = camera.far;
      this.shaderPass.uniforms.cameraFov.value = camera.fov;
      this.shaderPass.uniforms.cameraModelViewMatrix.value = camera.matrixWorldInverse;

      this.scene.traverse((object3D) => {
        if(object3D instanceof THREE.Mesh) {
          if(object3D.geometry instanceof THREE.BoxGeometry) {
          // if(object3D.geometry instanceof THREE.SphereGeometry) {
            this.objects3D.push(object3D);
          }
        }
      });
      }
    );
  }

  render() {
    if (this.shaderPass) {
      this.scene.camera.updateMatrixWorld();
      this.scene.camera.matrixWorldInverse.getInverse( this.scene.camera.matrixWorld );
      for (let [i, matrix] of this.shaderPass.uniforms.objectsMatrices.value.entries()) {
        let object3D = this.objects3D[i];
        object3D.updateMatrix();
        matrix.getInverse(object3D.matrix);
      }
    }
    super.render();
  }

  setSize(width, height) {
    super.setSize(width, height);
  }
}
