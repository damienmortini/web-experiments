'use strict';

import BoidSystem from 'dmmn/substrate/BoidSystem';

class Main {
  constructor() {

    let canvas = document.querySelector('canvas#main');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let normalsCanvas = document.querySelector('canvas#normals');

    this.boidSystem = new BoidSystem({
      canvas,
      normalsCanvas
    });

    this.pointer = {
      x: 0,
      y: 0,
      down: false
    };

    canvas.addEventListener('mousedown', this.onCanvasPointerDown.bind(this));
    canvas.addEventListener('mousemove', this.onCanvasPointerMove.bind(this));
    canvas.addEventListener('mouseup', this.onCanvasPointerUp.bind(this));

    this.update();

    this.boidSystem.add({x: canvas.width * .5, y: canvas.height * .5});
  }
  onCanvasPointerDown () {
    this.pointer.down = true;
  }
  onCanvasPointerMove (e) {
    this.pointer.x = e.x;
    this.pointer.y = e.y;
  }
  onCanvasPointerUp () {
    this.pointer.down = false;
  }
  update () {
    requestAnimationFrame(this.update.bind(this));
    if(this.pointer.down) {
      this.boidSystem.add({x: this.pointer.x, y: this.pointer.y});
    }
    this.boidSystem.update();
  }
}

new Main();
