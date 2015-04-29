// import BoidSystem3D from "dlib/substrate/BoidSystem3D";
import BoidSystem from "dlib/substrate/BoidSystem";

class Main {
  constructor() {

    this.canvas = document.querySelector("canvas#main");

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.context = this.canvas.getContext("2d");

    // let normalsCanvas = document.querySelector("canvas#normals");
    // let depthCanvas = document.querySelector("canvas#depth");

    this.boidSystem = new BoidSystem(this.canvas.width, this.canvas.height, 3, 0);

    setTimeout(() =>{
      this.boidSystem.spawnProbabilityRatio = 1;
    }, 1000);

    setTimeout(() =>{
      this.boidSystem.spawnProbabilityRatio = 1;
    }, 2000);

    setTimeout(() =>{
      this.boidSystem.spawnProbabilityRatio = 1;
    }, 3000);

    setTimeout(() =>{
      this.boidSystem.spawnProbabilityRatio = 1;
    }, 4000);

    this.pointer = {
      previousX: 0,
      previousY: 0,
      x: 0,
      y: 0,
      down: false,
      angle: 0
    };

    this.canvas.addEventListener("mousedown", this.onCanvasPointerDown.bind(this));
    this.canvas.addEventListener("mousemove", this.onCanvasPointerMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onCanvasPointerUp.bind(this));

    this.update();

    this.boidSystem.add(this.canvas.width * 0.55, this.canvas.height * 0.5, 0);
    // this.boidSystem.add(this.canvas.width * 0.6, this.canvas.height * 0.4, Math.PI * .5);
    // this.boidSystem.add(this.canvas.width * 0.6, this.canvas.height * 0.6, -Math.PI * .5);
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

  update () {
    requestAnimationFrame(this.update.bind(this));

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // let velocityAngle = Math.atan2(this.pointer.y - this.pointer.previousY, this.pointer.x - this.pointer.previousX);

    // if(this.pointer.down) {
    // if(Math.abs(this.pointer.previousX - this.pointer.x) > 0 && Math.abs(this.pointer.previousY - this.pointer.y) > 0) {
    //   this.boidSystem.add(
    //     this.pointer.x,
    //     this.pointer.y,
    //     velocityAngle,
    //     (Math.random() - 0.5) * 0.1,
    //     500
    //   );
    // }

    this.boidSystem.update();

    for (let i = 0; i < this.boidSystem.edges.length; i++) {
      let edge = this.boidSystem.edges[i];
      this.context.strokeStyle = `hsl(${i * 50 % 360}, 100%, 50%)`;

      this.context.beginPath();
      // this.context.setLineDash([2, 2]);

      let p1;
      let p2;

      // p1 = edge.getCenter();

      // this.context.beginPath();
      // this.context.arc(p1.x, p1.y, 5, 0, Math.PI * 2);

      p1 = edge.getPointFromRatio(0);
      p2 = edge.next.getPointFromRatio(1);
      // p1 = edge.getPointFromRatio(.9);
      // p2 = edge.next.getPointFromRatio(.1);

      this.context.moveTo(p1.x, p1.y);
      this.context.quadraticCurveTo(edge.next.a.x, edge.next.a.y, p2.x, p2.y);

      p1 = edge.twin.getPointFromRatio(0);
      p2 = edge.twin.next.getPointFromRatio(1);
      // p1 = edge.twin.getPointFromRatio(.9);
      // p2 = edge.twin.next.getPointFromRatio(.1);

      this.context.moveTo(p1.x, p1.y);
      this.context.quadraticCurveTo(edge.twin.next.a.x, edge.twin.next.a.y, p2.x, p2.y);

      this.context.stroke();

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
      // this.context.beginPath();
      // this.context.arc(edge.a.x + offsetX * 5, edge.a.y + offsetY * 5, 2, 0, Math.PI * 2);
      // this.context.stroke();
    }

    for (let i = 0; i < this.boidSystem.edges.length; i++) {
      let edge = this.boidSystem.edges[i];
      this.context.strokeStyle = `hsl(${i * 50 % 360}, 100%, 50%)`;
      // this.context.setLineDash([]);
      this.context.beginPath();
      this.context.setLineDash([]);
      this.context.moveTo(edge.a.x, edge.a.y);
      this.context.lineTo(edge.b.x, edge.b.y);
      this.context.stroke();
    }

    // this.context.putImageData(this.boidSystem.imageData, 0, 0);
  }
}

new Main();
