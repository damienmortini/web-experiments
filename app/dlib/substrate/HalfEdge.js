import Edge from "../math/Edge";

class TwinEdge extends Edge {
  constructor (a, b) {
    super(a, b);
    this.next = null;
  }
}

export default class HalfEdge extends TwinEdge {
  constructor(a, b) {
    super(a, b);

    this.twin = new TwinEdge(b, a);

    this.next = this.twin;

    this.twin.next = this;

    return this;
  }
}
