'use strict';

let THREE = window.THREE;

export default class GLSLRaymarchComposer extends THREE.EffectComposer {
  constructor(renderer) {
    super(renderer, new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    }));

    this.addGLSLRaymarchShaderPass();
  }

  addGLSLRaymarchShaderPass(shader) {
    let shaderPass = new THREE.ShaderPass(shader);
    shaderPass.needsSwap = false;
    this.addPass(shaderPass);
  }
}
