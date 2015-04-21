'use strict';

import BoidSystem3D from 'dmmn/substrate/BoidSystem3D';

class Main {
  constructor() {

    let canvas = document.querySelector('canvas#main');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let normalsCanvas = document.querySelector('canvas#normals');
    let depthCanvas = document.querySelector('canvas#depth');

    this.boidSystem = new BoidSystem3D({
      canvas,
      normalsCanvas,
      depthCanvas,
      boidsNumber: 1000
    });

    this.pointer = {
      previousX: 0,
      previousY: 0,
      x: 0,
      y: 0,
      down: false,
      angle: 0
    };

    canvas.addEventListener('mousedown', this.onCanvasPointerDown.bind(this));
    canvas.addEventListener('mousemove', this.onCanvasPointerMove.bind(this));
    canvas.addEventListener('mouseup', this.onCanvasPointerUp.bind(this));

    this.update();

    // this.boidSystem.add({x: canvas.width * .5, y: canvas.height * .5});
  }
  onCanvasPointerDown () {
    this.pointer.down = true;
  }
  onCanvasPointerMove (e) {
    this.pointer.previousX = this.pointer.x;
    this.pointer.previousY = this.pointer.y;
    this.pointer.x = e.x;
    this.pointer.y = e.y;
  }
  onCanvasPointerUp () {
    this.pointer.down = false;
  }
  update () {
    requestAnimationFrame(this.update.bind(this));

    let angle = Math.atan2(this.pointer.y - this.pointer.previousY, this.pointer.x - this.pointer.previousX);

    // if(this.pointer.down) {
    if(this.pointer.previousX - this.pointer.x !== 0 && this.pointer.previousX - this.pointer.x !== 0) {
      this.boidSystem.add({
        x: this.pointer.x,
        y: this.pointer.y,
        angle,
        life: 500
      });
    }

    this.boidSystem.update();
  }
}

new Main();
