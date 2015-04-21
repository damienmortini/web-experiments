'use strict';

export default class Boid {
  constructor(context) {
    this.context = context;
    this.x = 0;
    this.y = 0;
    this.lineWidth = 0;
    this.angle = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.velocityAngle = 0;
    this.previousX = 0;
    this.previousY = 0;
    return this;
  }

  set ({x = 0, y = 0, angle = Math.random() * Math.PI * 2, velocityAngle = 0, lineWidth = 1}) {
    this.x = x;
    this.y = y;
    this.lineWidth = Math.max(1, lineWidth);
    this.angle = angle;
    this.offsetX = Math.cos(this.angle);
    this.offsetY = Math.sin(this.angle);
    this.velocityAngle = velocityAngle;
    this.previousX = this.x;
    this.previousY = this.y;
    return this;
  }

  reset ({x, y, angle, velocityAngle, lineWidth, life = -1}) {
    this.set({x, y, angle, velocityAngle, lineWidth});
    this.life = life;
    this.isDead = false;
    return this;
  }

  kill () {
    this.isDead = true;
    this.velocityX = 0;
    this.velocityY = 0;
    return this;
  }

  update () {
    this.previousX = this.x;
    this.previousY = this.y;
    if (this.velocityAngle) {
      this.angle += this.velocityAngle;
      this.offsetX = Math.cos(this.angle);
      this.offsetY = Math.sin(this.angle);
    }
    this.x += this.offsetX * 2;
    this.y += this.offsetY * 2;
    this.life--;
    if(this.life === 0) {
      this.kill();
    }
    return this;
  }

  draw () {
    this.context.strokeStyle = 'black';
    this.context.lineWidth = this.lineWidth;
    this.context.beginPath();
    this.context.moveTo(this.previousX, this.previousY);
    this.context.lineTo(this.x, this.y);
    this.context.stroke();
    return this;
  }
}
