import Boid from "./Boid";
import Vector2 from "../math/Vector2";
import SubstrateEdge from "./SubstrateEdge";

const DEBUG = true;

export default class BoidSystem {
  constructor(width, height, {speed = 1, spawnProbabilityRatio = 0.1, spawnOptions = {}, polygonMatchMethod = () => {}}) {

    this.edges = [];
    this.polygonMatchMethod = polygonMatchMethod;

    this.speed = speed;
    this.spawnProbabilityRatio = spawnProbabilityRatio;
    this.spawnOptions = spawnOptions;

    this.width = width;
    this.height = height;

    this.data = new Uint32Array(this.width * this.height);
    this.imageData = new ImageData(this.width, this.height);
  }

  add (x, y, velocityAngle, offsetAngle, life) {
    let boid = new Boid(x, y, velocityAngle, offsetAngle, life);
    let edge = new SubstrateEdge(new Vector2(boid.x, boid.y), new Vector2(boid.x, boid.y), boid);
    this.edges.push(edge);
    edge.id = this.edges.length;
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
          let velocityAngle;
          if(this.spawnOptions.velocityAngle === undefined) {
            velocityAngle = Math.pow(Math.random(), 100) * (Math.random() > 0.5 ? 1 : -1) + edge.boid.velocityAngle + Math.PI * 0.5 * (Math.random() > 0.5 ? 1 : -1);
          }
          else {
            velocityAngle = edge.boid.velocityAngle + this.spawnOptions.velocityAngle;
          }
          let newEdge = this.add(edge.b.x, edge.b.y, velocityAngle, 0, edge.boid.life);
          this.splitEdge(newEdge, edgeId, true);
          // this.spawnProbabilityRatio = 0;
        }
      }
    }
  }

  splitEdge (edge, edgeId) {
    let oldEdge = this.edges[edgeId - 1];

    let angle = oldEdge.boid.velocity.angleTo(edge.boid.velocity);

    let isMainEdge = angle > 0;

    let sweepBoid = new Boid(edge.b.x, edge.b.y, oldEdge.boid.velocityAngle, oldEdge.boid.offsetAngle);
    sweepBoid.update();

    let newEdge = this.add(oldEdge.boid.x, oldEdge.boid.y, oldEdge.boid.velocityAngle, oldEdge.boid.offsetAngle, oldEdge.boid.life);

    if (oldEdge.boid.isDead) {
      newEdge.boid.kill();
    }
    else {
      oldEdge.boid.kill();
    }
    newEdge.a.copy(sweepBoid);
    oldEdge.b.copy(edge.b);

    // Detect if spawned or collided
    let collided = edge.boid.isDead;

    if(collided) {
      isMainEdge = !isMainEdge;
    }

    if (oldEdge.next !== oldEdge.twin) {
      newEdge.next = oldEdge.next;
      newEdge.next.twin.next.twin.next = newEdge.twin;
    }

    if (isMainEdge) {
      newEdge.twin.next = oldEdge.twin;
      if (collided) {
        // console.log("main collided - " + edge.id + ' with ' + oldEdge.id);
        edge.next = newEdge;
        oldEdge.next = edge.twin;
      }
      else {
        // console.log("main spawned - " + edge.id + ' with ' + oldEdge.id);
        edge.twin.next = newEdge;
        oldEdge.next = edge;
      }
    }
    else {
      oldEdge.next = newEdge;
      if (collided) {
        // console.log("twin collided - " + edge.id + ' with ' + oldEdge.id);
        edge.next = oldEdge.twin;
        newEdge.twin.next = edge.twin;
      }
      else {
        // console.log("twin spawned - " + edge.id + ' with ' + oldEdge.id);
        newEdge.twin.next = edge;
        edge.twin.next = oldEdge.twin;
      }
    }

    let sweepPosition = Math.floor(sweepBoid.x) + this.width * Math.floor(sweepBoid.y);
    while (this.data[Math.floor(sweepBoid.x) + this.width * Math.floor(sweepBoid.y)] === edgeId) {
      sweepBoid.update();
      this.data[sweepPosition] = this.edges.length;
      if (DEBUG) {
        this.setDebugColor(sweepPosition);
      }
      sweepPosition = Math.floor(sweepBoid.x) + this.width * Math.floor(sweepBoid.y);
    }

    let nextEdge = edge.next;
    let polygonArray = [edge.b.x, edge.b.y];
    for (let i = 0; i < 100; i++) {
      if (nextEdge.next === nextEdge.twin) {
        break;
      }
      polygonArray.push(nextEdge.b.x);
      polygonArray.push(nextEdge.b.y);
      if (nextEdge === edge) {
        this.polygonMatchMethod(polygonArray);
        break;
      }
      nextEdge = nextEdge.next;
    }

    nextEdge = edge.twin.next;
    polygonArray = [edge.twin.b.x, edge.twin.b.y];
    for (let i = 0; i < 100; i++) {
      if (nextEdge.next === nextEdge.twin) {
        break;
      }
      polygonArray.push(nextEdge.b.x);
      polygonArray.push(nextEdge.b.y);
      if (nextEdge === edge.twin) {
        this.polygonMatchMethod(polygonArray);
        break;
      }
      nextEdge = nextEdge.next;
    }
  }

  setDebugColor (position) {
    let debugColor = this.getDebugColor(this.data[position]);
    this.imageData.data[position * 4] = debugColor.r;
    this.imageData.data[position * 4 + 1] = debugColor.g;
    this.imageData.data[position * 4 + 2] = debugColor.b;
    this.imageData.data[position * 4 + 3] = 255;
  }

  getDebugColor (edgeId) {
    let moduloId = edgeId % 6;
    let r = (moduloId === 1 || moduloId === 4 || moduloId === 6) ? 255 : 0;
    let g = (moduloId === 2 || moduloId === 4 || moduloId === 5) ? 220 : 0;
    let b = (moduloId === 3 || moduloId === 5 || moduloId === 6) ? 255 : 0;
    return {r, g, b};
  }
}
