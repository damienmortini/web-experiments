import Edge from "./Edge";

class TwinEdge extends Edge {
  constructor (a, b) {
    super(a, b);
    this.next = null;
    this.twin = null;
  }
}

export default class HalfEdge extends TwinEdge {
  constructor(a, b) {
    super(a, b);

    this.twin = new TwinEdge(b, a);

    this.next = this.twin;

    this.twin.twin = this;
    this.twin.next = this;

    return this;
  }
}
