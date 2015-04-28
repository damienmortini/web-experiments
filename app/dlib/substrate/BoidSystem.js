import Boid from "./Boid";
import Vector2 from "../math/Vector2";
import SubstrateEdge from "./SubstrateEdge";

const DEBUG = true;

export default class BoidSystem {
  constructor(width, height, speed = 1, spawnProbabilityRatio = 0.1) {

    this.boids = [];
    this.edges = [];

    this.speed = speed;
    this.spawnProbabilityRatio = spawnProbabilityRatio;

    this.width = width;
    this.height = height;

    this.data = new Uint32Array(this.width * this.height);
    this.imageData = new ImageData(this.width, this.height);
  }

  add (x, y, velocityAngle, offsetAngle, life) {
    let boid = new Boid(x, y, velocityAngle, offsetAngle, life);

    let edge = new SubstrateEdge(new Vector2(boid.x, boid.y), new Vector2(boid.x, boid.y), boid);

    this.edges.push(edge);
  }

  update () {
    for (let i = 0; i < this.speed; i++) {
      for(let [i, edge] of this.edges.entries()) {

        if (edge.boid.isDead) {
          continue;
        }

        edge.update();

        if (edge.boid.x < 0 || edge.boid.x > this.width || edge.boid.y < 0 || edge.boid.y > this.height) {
          edge.boid.kill();
          continue;
        }

        let position = Math.floor(edge.b.x) + this.width * Math.floor(edge.b.y);

        let pixelId = this.data[position];

        if (pixelId && pixelId !== i + 1) {
          edge.boid.kill();
          this.splitEdge(edge.b, this.edges[pixelId - 1]);
        }
        else {
          this.data[position] = i + 1;
          if (DEBUG) {
            this.setDebugColor(position);
          }
        }

        // Add new edge
        // if(Math.random() < this.spawnProbabilityRatio) {
        //   let velocityAngle = Math.pow(Math.random(), 100) * (Math.random() > 0.5 ? 1 : -1) + edge.boid.velocityAngle + Math.PI * 0.5 * (Math.random() > 0.5 ? 1 : -1);
        //   this.add(edge.boid.x, edge.boid.y, velocityAngle, 0, edge.boid.life);
        // }
      }
    }
  }

  splitEdge (collisionPosition, collidedEdge) {
    collidedEdge.b.copy(collisionPosition);

    if (!collidedEdge.boid.isDead) {
      this.add(collidedEdge.boid.x, collidedEdge.boid.y, collidedEdge.boid.velocityAngle, collidedEdge.boid.offsetAngle, collidedEdge.boid.life);
    }

    // let sweepBoid = new Boid(collisionPosition.x, collisionPosition.y, collidedEdge.boid.velocityAngle, collidedEdge.boid.offsetAngle);
    // sweepBoid.update();
    // let sweepPosition = Math.floor(sweepBoid.x) + this.width * Math.floor(sweepBoid.y);
    // while (this.data[Math.floor(sweepBoid.x) + this.width * Math.floor(sweepBoid.y)] === pixelId) {
    //   // console.log(this.data[Math.floor(sweepBoid.x) + this.width * Math.floor(sweepBoid.y)], pixelId);
    //   sweepBoid.update();
    //   this.data[sweepPosition] = this.edges.length;
    //   if (DEBUG) {
    //     this.setDebugColor(sweepPosition);
    //   }
    //   sweepPosition = Math.floor(sweepBoid.x) + this.width * Math.floor(sweepBoid.y);
    // }

    collidedEdge.boid.kill();

    this.edges[this.edges.length - 1].a.copy(collisionPosition);
  }

  setDebugColor (position) {
    let id = this.data[position];
    let moduloId = id % 7;
    this.imageData.data[position * 4] = (moduloId === 1 || moduloId === 4 || moduloId === 6) ? 255 : 0;
    this.imageData.data[position * 4 + 1] = (moduloId === 2 || moduloId === 4 || moduloId === 5) ? 255 : 0;
    this.imageData.data[position * 4 + 2] = (moduloId === 3 || moduloId === 5 || moduloId === 6) ? 255 : 0;
    this.imageData.data[position * 4 + 3] = 255;
  }
}
