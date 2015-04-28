export default class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    return this;
  }

  set (x = this.x, y = this.y) {
    this.x = x;
    this.y = y;
    return this;
  }

  add (vector2) {
    this.x += vector2.x;
    this.y += vector2.y;
  }
}
