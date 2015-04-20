'use strict';

export default class Boid {
  constructor(context, life = 100) {
    this.context = context;
    this.baseLife = life;
    return this;
  }

  set ({x = 0, y = 0, angle = Math.random() * Math.PI * 2, velocityAngle = 0}) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.offsetX = Math.cos(this.angle);
    this.offsetY = Math.sin(this.angle);
    this.velocityAngle = velocityAngle;
    this.previousX = this.x;
    this.previousY = this.y;
    return this;
  }

  reset ({x, y, angle, velocityAngle, life = this.baseLife}) {
    this.set({x, y, angle, velocityAngle});
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
    this.x += this.offsetX * this.context.lineWidth * 2;
    this.y += this.offsetY * this.context.lineWidth * 2;
    this.life--;
    if(this.life === 0) {
      this.kill();
    }
    return this;
  }

  draw () {
    this.context.strokeStyle = 'black';
    this.context.beginPath();
    this.context.moveTo(this.previousX, this.previousY);
    this.context.lineTo(this.x, this.y);
    this.context.stroke();
    return this;
  }
}
