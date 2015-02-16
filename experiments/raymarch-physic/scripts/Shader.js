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
    let map = new Map();

    map.set('bool', 'f');
    map.set('int', 'i');
    map.set('uint', 'i');
    map.set('float', 'f');
    map.set('double', 'f');
    map.set('sampler2D', 't');
    map.set('samplerCube', 't');
    for (var i = 2; i < 5; i++) {
      map.set(`bvec${i}`, `v${i}`);
      map.set(`ivec${i}`, `v${i}`);
      map.set(`uvec${i}`, `v${i}`);
      map.set(`vec${i}`, `v${i}`);
      map.set(`dvec${i}`, `v${i}`);
      if(i > 2) {
        map.set(`mat${i}`, `m${i}`);
      }
    }

    console.log(map);

    function addUniform (type, length) {
      console.log(type, length);
    }

    let result;
    while((result = regExp.exec(str))) {
      let glslType = result[1];
      let name = result[2];
      let length = parseInt(result[3]);
      if (this.uniforms[name]) {
        continue;
      }
      let type;
      let value;

      console.log(glslType);

      addUniform(map.get(glslType), length);

      // if (glslType === 'int') {
      //   if(isNaN(length)) {
      //     type = 'i';
      //     value = 0;
      //   }
      //   else {
      //     type = 'iv1';
      //     value = new Array(length).fill(0);
      //   }
      // }
      // else if (glslType === 'int') {
      //
      // }

      // switch (result[1]) {
      //   case 'int':
      //     if(isNaN(length)) {
      //       type = 'i';
      //       value = 0;
      //     }
      //     else {
      //       type = 'iv1';
      //       value = new Array(length).fill(0);
      //     }
      //     break;
      //   case 'float':
      //     if(isNaN(length)) {
      //       type = 'f';
      //       value = 0;
      //     }
      //     else {
      //       type = 'fv1';
      //       value = new Array(length).fill(0);
      //     }
      //     break;
      //   case 'vec2':
      //     if(isNaN(length)) {
      //       type = 'v2';
      //       value = new THREE.Vector2();
      //     }
      //     else {
      //       type = 'v2v';
      //       value = new Array(length).fill(new THREE.Vector2());
      //     }
      //     break;
      //   case 'vec3':
      //     if(isNaN(length)) {
      //       type = 'v3';
      //       value = new THREE.Vector3();
      //     }
      //     else {
      //       type = 'v3v';
      //       value = new Array(length).fill(new THREE.Vector3());
      //     }
      //     break;
      //   case 'ivec3':
      //     new Array(isNaN(length) ? 1 : length).fill(new THREE.Vector3());
      //     if(isNaN(length)) {
      //       type = 'iv';
      //       value = new THREE.Vector3();
      //     }
      //     else {
      //       type = 'iv';
      //       value = new Array(length).fill(new THREE.Vector3());
      //     }
      //     bre
      //     break;
      //   case 'vec4':
      //     type = 'm4';
      //     value = new THREE.Matrix4();
      //     // case 'vec4':
      //     //   break;
      //     break;
      //   case 'mat4':
      //     type = 'v2';
      //     value = new THREE.Vector2();
      //     // case 'mat4':
      //     //   break;
      //     break;
      //   case 'sampler2D':
      //     type = 't';
      //     value = new THREE.Texture();
      //     // case 'sampler2D':
      //     //   break;
      //     break;
      //   case 'samplerCube':
      //     type = 't';
      //     value = new THREE.CubeTexture();
      //     break;
      // }
      this.uniforms[name] = {type, value};
    }
  }
}
