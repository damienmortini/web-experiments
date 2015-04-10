'use strict';

export default class GLSLView {
  constructor (canvas) {
    let gl = canvas.getContext('webgl');

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0, 1);
        }
    `);
    gl.compileShader(vertexShader);

    console.log( gl.getShaderInfoLog(vertexShader) );

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(gl_FragCoord.xy / 1000.0, 1, 1);
      }
    `);
    gl.compileShader(fragmentShader);

    console.log( gl.getShaderInfoLog(fragmentShader) );

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    let buffer = gl.createBuffer();

    let bufferData = [
        -1, -1,
        -1, 1,
        1, -1,
        1, 1
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);

    let a_position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
