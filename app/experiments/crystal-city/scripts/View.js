'use strict';

let THREE = window.THREE;

import GLSLView from 'dmmn/webgl/GLSLView';

export default class View extends GLSLView{
  constructor (canvas, fragmentShaderStr, textureCanvas) {
    super(canvas, fragmentShaderStr);

    this.textureCanvas = textureCanvas;

    let gl = this.gl;

    this.camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 1000 );
    this.camera.position.set(100, 100, 100);

    this.controls = new THREE.TrackballControls(this.camera);

    gl.uniform2f(gl.getUniformLocation(this.program, 'uResolution'), canvas.width, canvas.height);

    gl.uniform1f(gl.getUniformLocation(this.program, 'uCamera.near'), this.camera.near);
    gl.uniform1f(gl.getUniformLocation(this.program, 'uCamera.far'), this.camera.far);
    gl.uniform1f(gl.getUniformLocation(this.program, 'uCamera.fov'), this.camera.fov);


    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }

  update () {
    let gl = this.gl;

    this.controls.update();

    this.camera.updateMatrixWorld();
    this.camera.matrixWorldInverse.getInverse( this.camera.matrixWorld );

    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uCamera.modelViewMatrix'), false, this.camera.matrixWorldInverse.elements);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureCanvas);
    super.update();
  }
}
