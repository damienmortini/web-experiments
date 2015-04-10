'use strict';

// import BoidSystem from '../../substrate/scripts/BoidSystem';
import GLSLView from './GLSLView';

class Main {
  constructor() {

    this.canvas = document.querySelector('canvas');

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    let glslView = new GLSLView(this.canvas);

    // this.boidSystem = new BoidSystem(this.canvas);

    this.pointer = {
      x: 0,
      y: 0,
      down: false
    };

    // this.canvas.addEventListener('mousedown', this.onCanvasPointerDown.bind(this));
    // this.canvas.addEventListener('mousemove', this.onCanvasPointerMove.bind(this));
    // this.canvas.addEventListener('mouseup', this.onCanvasPointerUp.bind(this));

    // this.update();
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
  // update () {
  //   requestAnimationFrame(this.update.bind(this));
  //   // if(this.pointer.down) {
  //   if(this.pointer.x + this.pointer.y !== 0 ) {
  //     this.boidSystem.add(this.pointer.x, this.pointer.y);
  //     this.boidSystem.add(this.pointer.x, this.pointer.y);
  //     this.boidSystem.add(this.pointer.x, this.pointer.y);
  //   }
  //   this.boidSystem.update();
  // }
}

new Main();
