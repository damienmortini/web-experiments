'use strict';

import Boid from './Boid';

export default class BoidSystem {
  constructor({canvas, normalsCanvas, boidsNumber = 1000}) {

    this.boids = [];

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    for (var i = 0; i < boidsNumber; i++) {
      let boid = new Boid(this.context);
      boid.isDead = true;
      this.boids.push(boid);
    }
  }
  add ({x, y, angle, velocityAngle, life, lineWidth}) {
    this.boids[0].reset({x, y, angle, velocityAngle, life, lineWidth});
    this.boids.push(this.boids.shift());
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

      // Add new boid
      if(Math.random() < 0.1) {
        let angle = Math.pow(Math.random(), 100) * (Math.random() > 0.5 ? 1 : -1) + boid.angle + Math.PI * 0.5 * (Math.random() > 0.5 ? 1 : -1);
        let velocityAngle = Math.pow(Math.random(), 500) * 0.1 * (Math.random() > 0.5 ? 1 : -1);
        this.add({x: boid.x, y: boid.y, angle, velocityAngle, life:boid.life, lineWidth: boid.lineWidth - 1});
      }
    }
  }
}
