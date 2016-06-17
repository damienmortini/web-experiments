'use strict';

import BoidSystem from '../../../dlib/substrate/SubstrateSystem';
import View from './View';

class Main {
  constructor() {

    this.pointer = {
      x: 0,
      y: 0,
      down: false
    };

    this.substrateCanvas = document.querySelector('canvas#substrate');
    this.substrateCanvas.width = 512;
    this.substrateCanvas.height = 512;
    this.boidSystem = new BoidSystem(this.substrateCanvas);
    // let times = 100;
    // for (var i = 0; i < times; i++) {
    //   this.boidSystem.context.fillStyle = `rgba(0, 0, 0, ${(1 - i / times)})`;
    //   this.boidSystem.context.fillRect(-i + 128, -i + 128, 256, 256);
    // }
    this.boidSystem.context.lineWidth = 4;
    this.boidSystem.add(this.substrateCanvas.width * .5, this.substrateCanvas.height * .5);

    this.canvas = document.querySelector('canvas#main');
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    fetch('shaders/world.glsl').then((response) => response.text()).then((data) => {
      this.view = new View(this.canvas, data, this.substrateCanvas);
      this.update();
    });

    // this.canvas.addEventListener('mousedown', this.onCanvasPointerDown.bind(this));
    // this.canvas.addEventListener('mousemove', this.onCanvasPointerMove.bind(this));
    // this.canvas.addEventListener('mouseup', this.onCanvasPointerUp.bind(this));

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
  //   // if(this.pointer.down) {
  //   if(this.pointer.x + this.pointer.y !== 0 ) {
  //     this.boidSystem.add(this.pointer.x, this.pointer.y);
  //     this.boidSystem.add(this.pointer.x, this.pointer.y);
  //     this.boidSystem.add(this.pointer.x, this.pointer.y);
  //   }
    this.boidSystem.update();

    this.view.update();
    return;
  }
}

new Main();
