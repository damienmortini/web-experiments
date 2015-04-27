'use strict';

export default class Boid {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.velocityAngle = 0;
    return this;
  }

  set ({x = 0, y = 0, angle = Math.random() * Math.PI * 2, velocityAngle = 0}) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.offsetX = Math.cos(this.angle);
    this.offsetY = Math.sin(this.angle);
    this.velocityAngle = velocityAngle;
    return this;
  }

  reset ({x, y, angle, velocityAngle, life = -1}) {
    this.set({x, y, angle, velocityAngle});
    this.life = life;
    this.isDead = false;
    return this;
  }

  update () {
    if (this.isDead) {
      return this;
    }
    if (this.velocityAngle) {
      this.angle += this.velocityAngle;
      this.offsetX = Math.cos(this.angle);
      this.offsetY = Math.sin(this.angle);
    }
    this.x += this.offsetX;
    this.y += this.offsetY;
    this.life--;
    if(this.life === 0) {
      this.isDead = true;
    }
    return this;
  }
}
