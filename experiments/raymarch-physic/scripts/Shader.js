'use strict';

let THREE = window.THREE;

export default class {
  constructor (vertexShader, fragmentShader, uniforms = {}) {
    this.uniforms = uniforms;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;


    this.parseUniforms(vertexShader + '\n' + fragmentShader);
  }

  parseUniforms (str) {
    let regExp = /uniform (.[^ ]+) (.[^ ;\[\]]+)\[? *(\d+)? *\]?/g;
    let result;
    while((result = regExp.exec(str))) {
      let name = result[2];
      if (this.uniforms[name]) {
        continue;
      }
      let type;
      let value;
      let length = result[3];
      switch (result[1]) {
        case 'int':
          type = 'i';
          value = 0;
          // value = result[3] === undefined ? 0 : new Array(length).fill(0);
          break;
        case 'float':
          type = 'f';
          value = 0;
          // value = result[3] === undefined ? 0 : new Array(length).fill(0);
          break;
        case 'vec2':
          type = 'v2';
          value = new THREE.Vector2();
          // case 'vec2':
          //   break;
          break;
        case 'vec3':
          type = 'v3';
          value = new THREE.Vector3();
          // case 'vec3':
          //   break;
          // case 'vec3':
          //   break;
          // case 'vec3':
          //   break;
          break;
        case 'ivec3':
          break;
        case 'vec4':
          type = 'm4';
          value = new THREE.Matrix4();
          // case 'vec4':
          //   break;
          break;
        case 'mat4':
          type = 'v2';
          value = new THREE.Vector2();
          // case 'mat4':
          //   break;
          break;
        case 'sampler2D':
          type = 't';
          value = new THREE.Texture();
          // case 'sampler2D':
          //   break;
          break;
        case 'samplerCube':
          type = 't';
          value = new THREE.CubeTexture();
          break;
      }
      this.uniforms[name] = {type, value};
    }
    console.log(this.uniforms);
  }
}
