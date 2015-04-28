import HalfEdge from "../math/HalfEdge";

export default class SubstrateEdge extends HalfEdge {
  constructor(a, b, boid) {
    super(a, b);
    this.boid = boid;
  }

  update () {
    this.boid.update();
    this.b.copy(this.boid);
  }
}
