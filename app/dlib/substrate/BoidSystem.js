'use strict';

import Boid from './Boid';

export default class BoidSystem {
  constructor({width, height, speed = 1}) {

    this.boids = [];

    this.speed = speed;

    this.width = width;
    this.height = height;

    this.imageData = new ImageData(this.width, this.height);
  }

  add ({x, y, angle, velocityAngle, life, lineWidth}) {
    let deadBoid;
    for(let boid of this.boids) {
      if (boid.isDead) {
        deadBoid = boid;
      }
    }
    if (!deadBoid) {
      deadBoid = new Boid();
      this.boids.push(deadBoid);
    }
    deadBoid.reset({x, y, angle, velocityAngle, life, lineWidth});
  }

  update () {
    for (var i = 0; i < this.speed; i++) {
      for(let boid of this.boids) {

        if (boid.isDead) {
          continue;
        }

        boid.update();

        if (boid.x < 0 || boid.x > this.width || boid.y < 0 || boid.y > this.height) {
          boid.isDead = true;
          continue;
        }

        let id = (Math.floor(boid.x) + this.width * Math.floor(boid.y)) * 4 + 3;
        if (this.imageData.data[id]) {
          boid.isDead = true;
        }
        else {
          this.imageData.data[id] = 255;
        }

        // Add new boid
        if(Math.random() < 0.1) {
          let angle = Math.pow(Math.random(), 100) * (Math.random() > 0.5 ? 1 : -1) + boid.angle + Math.PI * 0.5 * (Math.random() > 0.5 ? 1 : -1);
          let velocityAngle = Math.pow(Math.random(), 500) * 0.1 * (Math.random() > 0.5 ? 1 : -1);
          this.add({x: boid.x, y: boid.y, angle, velocityAngle, life:boid.life, lineWidth: boid.lineWidth - 1});
        }
      }
    }
  }
}
