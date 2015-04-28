import Boid from "./Boid";
import Vector2 from "../math/Vector2";
import HalfEdge from "./HalfEdge";

export default class BoidSystem {
  constructor(width, height, speed = 1, spawnProbabilityRatio = 0.1) {

    this.boids = [];
    this.halfEdges = [];

    this.speed = speed;
    this.spawnProbabilityRatio = spawnProbabilityRatio;

    this.width = width;
    this.height = height;

    this.data = new Uint32Array(this.width * this.height);
    this.imageData = new ImageData(this.width, this.height);
  }

  add (x, y, velocityAngle, offsetAngle, life) {
    let boid = new Boid(x, y, velocityAngle, offsetAngle, life);
    this.boids.push(boid);

    let halfEdge = new HalfEdge(new Vector2(boid.x, boid.y), new Vector2(boid.x, boid.y));
    this.halfEdges.push(halfEdge);
  }

  update () {
    for (let i = 0; i < this.speed; i++) {
      for(let [i, boid] of this.boids.entries()) {

        let boidId = i + 1;

        if (boid.isDead) {
          continue;
        }

        boid.update();

        this.halfEdges[i].b.set(boid.x, boid.y);

        if (boid.x < 0 || boid.x > this.width || boid.y < 0 || boid.y > this.height) {
          boid.kill();
          continue;
        }

        let id = (Math.floor(boid.x) + this.width * Math.floor(boid.y));

        let pixelId = this.data[id];

        if (pixelId && pixelId !== boidId) {
          boid.kill();
        }
        else {
          this.data[id] = boidId;
          this.imageData.data[id * 4 + 3] = 255;
        }

        // Add new boid
        if(Math.random() < this.spawnProbabilityRatio) {
          let velocityAngle = Math.pow(Math.random(), 100) * (Math.random() > 0.5 ? 1 : -1) + boid.velocityAngle + Math.PI * 0.5 * (Math.random() > 0.5 ? 1 : -1);
          this.add(boid.x, boid.y, velocityAngle, 0, boid.life);
        }
      }
    }
  }
}
