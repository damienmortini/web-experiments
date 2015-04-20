'use strict';

import Boid from './Boid';
// import triangulate from '../../vendors/delaunay-triangulate';

export default class BoidSystem {
  constructor({canvas, normalsCanvas}) {

    this.boids = [];

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.normalsCanvas = normalsCanvas;
    if(this.normalsCanvas) {
      this.normalsCanvas.width = this.width;
      this.normalsCanvas.height = this.height;
      this.normalsContext = this.normalsCanvas.getContext('2d');
      this.normalsContext.lineWidth = 2;
    }

    for (var i = 0; i < 1000; i++) {
      let boid = new Boid(this.context);
      boid.isDead = true;
      this.boids.push(boid);
    }
  }
  add ({x, y, angle, velocityAngle}) {
    for(let boid of this.boids) {
      if(boid.isDead) {
        boid.reset({x, y, angle, velocityAngle});
        break;
      }
    }
  }
  update () {
    let data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;

    for(let boid of this.boids) {

      if (boid.isDead) {
        continue;
      }

      boid.update();

      let pixelAlpha = data[(Math.floor(boid.x) + this.width * Math.floor(boid.y)) * 4 + 3];

      if(pixelAlpha > 0 || boid.x < 0 || boid.x > this.width || boid.y < 0 || boid.y > this.height) {
        boid.kill();
      }

      boid.draw();

      // Draw normals
      if (this.normalsCanvas) {
        this.normalsContext.save();
        let red = Math.floor(boid.offsetX * 128) + 128;
        let green = Math.floor(boid.offsetY * 128) + 128;
        let gradient = this.normalsContext.createLinearGradient(0, 0, 20, 0);
        gradient.addColorStop(0, `rgba(${red}, ${green}, 128, 1)`);
        gradient.addColorStop(1, `rgba(${red}, ${green}, 128, 0)`);
        this.normalsContext.strokeStyle = gradient;
        this.normalsContext.translate(boid.x, boid.y);
        this.normalsContext.beginPath();
        this.normalsContext.moveTo(0, 0);
        this.normalsContext.rotate(boid.angle + Math.PI * .5);
        this.normalsContext.lineTo(20, 0);
        this.normalsContext.stroke();
        this.normalsContext.restore();

        this.normalsContext.save();
        red = Math.floor(-boid.offsetX * 128) + 128;
        green = Math.floor(-boid.offsetY * 128) + 128;
        gradient = this.normalsContext.createLinearGradient(0, 0, 20, 0);
        gradient.addColorStop(0, `rgba(${red}, ${green}, 128, 1)`);
        gradient.addColorStop(1, `rgba(${red}, ${green}, 128, 0)`);
        this.normalsContext.strokeStyle = gradient;
        this.normalsContext.translate(boid.x, boid.y);
        this.normalsContext.beginPath();
        this.normalsContext.moveTo(0, 0);
        this.normalsContext.rotate(boid.angle - Math.PI * .5);
        this.normalsContext.lineTo(20, 0);
        this.normalsContext.stroke();
        this.normalsContext.restore();
      }

      // Add new boid
      if(Math.random() < 0.1) {
        let angle = Math.pow(Math.random(), 100) * (Math.random() > 0.5 ? 1 : -1) + boid.angle + Math.PI * 0.5 * (Math.random() > 0.5 ? 1 : -1);
        let velocityAngle = Math.pow(Math.random(), 500) * 0.1 * (Math.random() > 0.5 ? 1 : -1);
        this.add({x: boid.x, y: boid.y, angle, velocityAngle});
      }
    }
  }
}
