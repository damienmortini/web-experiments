// import BoidSystem3D from "dlib/substrate/BoidSystem3D";
import BoidSystem from "dlib/substrate/BoidSystem";

const DEBUG = false;

class Main {
  constructor() {

    this.canvas = document.querySelector("canvas#main");

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.context = this.canvas.getContext("2d");

    this.debugCanvas = document.querySelector("canvas#debug");
    this.debugCanvas.width = this.canvas.width;
    this.debugCanvas.height = this.canvas.height;
    this.debugContext = this.debugCanvas.getContext("2d");

    // let normalsCanvas = document.querySelector("canvas#normals");
    // let depthCanvas = document.querySelector("canvas#depth");

    this.boidSystem = new BoidSystem(this.canvas.width, this.canvas.height, {
      speed: 3,
      spawnProbabilityRatio: 0.05,
      polygonMatchMethod: this.drawPolygon.bind(this)
    });

    // setTimeout(() =>{
    //   this.boidSystem.spawnProbabilityRatio = 1;
    // }, 1800);
    //
    // setTimeout(() =>{
    //   this.boidSystem.spawnProbabilityRatio = 1;
    // }, 2000);
    //
    // setTimeout(() =>{
    //   this.boidSystem.spawnProbabilityRatio = 1;
    // }, 3000);
    //
    // setTimeout(() =>{
    //   this.boidSystem.spawnProbabilityRatio = 1;
    // }, 4000);

    this.pointer = {
      previousX: 0,
      previousY: 0,
      x: 0,
      y: 0,
      down: false,
      angle: 0
    };

    window.addEventListener("mousedown", this.onCanvasPointerDown.bind(this));
    window.addEventListener("mousemove", this.onCanvasPointerMove.bind(this));
    window.addEventListener("mouseup", this.onCanvasPointerUp.bind(this));

    this.update();

    this.boidSystem.add(this.canvas.width * 0.5, this.canvas.height * 0.5, 0);
    // this.boidSystem.add(this.canvas.width * 0.62, this.canvas.height * 0.3, Math.PI * .5);
    // this.boidSystem.add(this.canvas.width * 0.6, this.canvas.height * 0.6, -Math.PI * .5);
    // this.boidSystem.add(this.canvas.width * 0.7, this.canvas.height * 0.6, -Math.PI * .5);
  }

  onCanvasPointerDown () {
    this.pointer.down = true;
  }

  onCanvasPointerMove (e) {
    this.pointer.previousX = this.pointer.x;
    this.pointer.previousY = this.pointer.y;
    this.pointer.x = e.x;
    this.pointer.y = e.y;
  }

  onCanvasPointerUp () {
    this.pointer.down = false;
  }

  drawPolygon (polygonArray) {
    this.context.fillStyle = `hsl(${360 * Math.random()}, 100%, 50%)`;
    this.context.globalAlpha = .5;
    this.context.beginPath();
    for (var i = 2; i < polygonArray.length; i += 2) {
      this.context.lineTo(polygonArray[i], polygonArray[i + 1]);
    }
    this.context.fill();
    this.context.globalAlpha = 1;
  }

  update () {
    requestAnimationFrame(this.update.bind(this));

    // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let velocityAngle = Math.atan2(this.pointer.y - this.pointer.previousY, this.pointer.x - this.pointer.previousX);

    // if(this.pointer.down) {
    if(Math.abs(this.pointer.previousX - this.pointer.x) > 0 && Math.abs(this.pointer.previousY - this.pointer.y) > 0) {
      this.boidSystem.add(
        this.pointer.x,
        this.pointer.y,
        velocityAngle,
        (Math.random() - 0.5) * 0.1,
        500
      );
    }

    this.boidSystem.update();

    this.debugContext.putImageData(this.boidSystem.imageData, 0, 0);

    if (DEBUG) {
      this.drawDebug();
    }

  }

  drawDebug () {
    for (let i = 0; i < this.boidSystem.edges.length; i++) {
      let edge = this.boidSystem.edges[i];

      let moduloId = edge.id % 7;
      let r = (moduloId === 1 || moduloId === 4 || moduloId === 6) ? 255 : 0;
      let g = (moduloId === 2 || moduloId === 4 || moduloId === 5) ? 255 : 0;
      let b = (moduloId === 3 || moduloId === 5 || moduloId === 6) ? 255 : 0;

      this.context.strokeStyle = `rgb(${r}, ${g}, ${b})`;
      // this.context.globalAlpha = .5;

      // this.context.beginPath();
      // this.context.setLineDash([]);
      // this.context.moveTo(edge.a.x, edge.a.y);
      // this.context.lineTo(edge.b.x, edge.b.y);
      // this.context.stroke();

      this.context.beginPath();
      this.context.setLineDash([2, 8]);

      let p1;
      let p2;


      p1 = edge.getPointFromRatio(.6);
      p2 = edge.next.getPointFromRatio(.4);

      this.context.moveTo(p1.x, p1.y);
      this.context.quadraticCurveTo(edge.next.a.x, edge.next.a.y, p2.x, p2.y);

      p1 = edge.twin.getPointFromRatio(.6);
      p2 = edge.twin.next.getPointFromRatio(.4);

      this.context.moveTo(p1.x, p1.y);
      this.context.quadraticCurveTo(edge.twin.next.a.x, edge.twin.next.a.y, p2.x, p2.y);

      // this.context.stroke();

      // let offsetX = 0;
      // let offsetY = 0;
      // if (edge.next.boid) {
      //   offsetX += edge.next.boid.velocity.x;
      //   offsetY += edge.next.boid.velocity.y;
      // }
      // else {
      //   offsetX -= edge.next.twin.boid.velocity.x;
      //   offsetY -= edge.next.twin.boid.velocity.y;
      // }
      // this.context.beginPath();
      // this.context.arc(edge.b.x + offsetX * 5, edge.b.y + offsetY * 5, 2, 0, Math.PI * 2);
      // this.context.stroke();
      //
      // offsetX = 0;
      // offsetY = 0;
      // if (edge.twin.next.boid) {
      //   offsetX += edge.twin.next.boid.velocity.x;
      //   offsetY += edge.twin.next.boid.velocity.y;
      // }
      // else {
      //   offsetX -= edge.twin.next.twin.boid.velocity.x;
      //   offsetY -= edge.twin.next.twin.boid.velocity.y;
      // }
      this.context.setLineDash([]);
      this.context.beginPath();
      this.context.arc(edge.b.x, edge.b.y, 2, 0, Math.PI * 2);
      // this.context.stroke();

      if (false) {

        this.context.setLineDash([]);
        this.context.beginPath();
        let nextEdge = edge;
        let p1;
        let p2;
        this.context.moveTo(nextEdge.a.x, nextEdge.a.y);
        for (let i = 0; i < 10; i++) {
          if (nextEdge.next === nextEdge.twin) {
            break;
          }

          // this.context.strokeStyle = `rgba(255, 0, 0, 1)`;
          p1 = nextEdge.getPointFromRatio(.6);
          p2 = nextEdge.next.getPointFromRatio(.4);

          this.context.moveTo(p1.x, p1.y);
          this.context.quadraticCurveTo(nextEdge.next.a.x, nextEdge.next.a.y, p2.x, p2.y);

          p1 = nextEdge.twin.getPointFromRatio(.6);
          p2 = nextEdge.twin.next.getPointFromRatio(.4);

          this.context.moveTo(p1.x, p1.y);
          this.context.quadraticCurveTo(nextEdge.twin.next.a.x, nextEdge.twin.next.a.y, p2.x, p2.y);

          nextEdge = nextEdge.next;
        }
        this.context.stroke();

      }
    }
  }
}

new Main();
