'use strict';

export default class Boid {
  constructor(context, x, y, angle, velocityAngle, life = 40) {
    this.context = context;
    this.baseLife = life;
    this.reset(x, y, angle);
    return this;
  }

  set (x = 0, y = 0, angle = Math.random() * Math.PI * 2, velocityAngle = 0) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.velocityAngle = velocityAngle;
    this.previousX = this.x;
    this.previousY = this.y;
    return this;
  }

  reset (x, y, angle, velocityAngle, life = this.baseLife) {
    this.set(x, y, angle, velocityAngle);
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
    this.angle += this.velocityAngle;
    this.x += Math.cos(this.angle) * 2;
    this.y += Math.sin(this.angle) * 2;
    this.life--;
    if(this.life < 0) {
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
