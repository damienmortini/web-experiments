import Boid from "./Boid";
import Vector2 from "../math/Vector2";
import SubstrateEdge from "./SubstrateEdge";

const DEBUG = true;

export default class BoidSystem {
  constructor(width, height, speed = 1, spawnProbabilityRatio = 0.1) {

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
    return edge;
  }

  update () {
    for (let i = 0; i < this.speed; i++) {
      for (let i = 0; i < this.edges.length; i++) {
        let edge = this.edges[i];
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
        let edgeId = i + 1;

        if (pixelId && pixelId !== edgeId) {
          edge.boid.kill();
          this.splitEdge(edge, pixelId);
        }
        else {
          this.data[position] = edgeId;
          if (DEBUG) {
            this.setDebugColor(position);
          }
        }

        // Add new edge
        if(Math.random() < this.spawnProbabilityRatio) {
          let velocityAngle = Math.pow(Math.random(), 100) * (Math.random() > 0.5 ? 1 : -1) + edge.boid.velocityAngle + Math.PI * 0.5 * (Math.random() > 0.5 ? 1 : -1);
          this.splitEdge(edge, edgeId);
          this.add(edge.b.x, edge.b.y, velocityAngle, 0, edge.boid.life);
        }
      }
    }
  }

  splitEdge (edge, edgeId) {
    let collidedEdge = this.edges[edgeId - 1];
    collidedEdge.b.copy(edge.b);

    let newEdge = this.add(collidedEdge.boid.x, collidedEdge.boid.y, collidedEdge.boid.velocityAngle, collidedEdge.boid.offsetAngle, collidedEdge.boid.life);
    if (collidedEdge.boid.isDead) {
      newEdge.boid.kill();
    }
    collidedEdge.boid.kill();
    newEdge.a.copy(edge.b);

    let sweepBoid = new Boid(edge.b.x, edge.b.y, collidedEdge.boid.velocityAngle, collidedEdge.boid.offsetAngle);
    let sweepPosition = Math.floor(sweepBoid.x) + this.width * Math.floor(sweepBoid.y);
    while (this.data[Math.floor(sweepBoid.x) + this.width * Math.floor(sweepBoid.y)] === edgeId) {
      sweepBoid.update();
      this.data[sweepPosition] = this.edges.length;
      if (DEBUG) {
        this.setDebugColor(sweepPosition);
      }
      sweepPosition = Math.floor(sweepBoid.x) + this.width * Math.floor(sweepBoid.y);
    }
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
