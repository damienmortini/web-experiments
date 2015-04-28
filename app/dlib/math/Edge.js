import Vector2 from "../math/Vector2";

export default class Edge {
  constructor(a = new Vector2(), b = new Vector2()) {
    this.a = a;
    this.b = b;
    return this;
  }
}
