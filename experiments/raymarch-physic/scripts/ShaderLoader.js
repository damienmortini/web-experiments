'use strict';

import Shader from './Shader';

let THREE = window.THREE;

export default class {
  constructor (vertexShaderUrl, fragmentShaderUrl) {
    let loadShaderFile = url => {
      return new Promise((resolve, reject) => {
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onload = () => {
          resolve(xmlHttpRequest.response);
        };
        xmlHttpRequest.open('get', url, true);
        xmlHttpRequest.send();
      });
    };
    Promise.all([
      loadShaderFile(vertexShaderUrl),
      loadShaderFile(fragmentShaderUrl)
    ]).then(([vertexShader, fragmentShader]) => {
      new Shader(vertexShader, fragmentShader);
    });
  }
}
