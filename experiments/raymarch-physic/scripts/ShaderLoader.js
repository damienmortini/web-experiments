'use strict';

import Shader from './Shader';

let THREE = window.THREE;

export default class {
  static load (vertexShaderUrl, fragmentShaderUrl) {
    return Promise.all([
      fetch(vertexShaderUrl).then((response) => response.text()),
      fetch(fragmentShaderUrl).then((response) => response.text())
    ]).then(([vertexShader, fragmentShader]) => {
      return new Shader(vertexShader, fragmentShader);
    });
  }
}
