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

    this.boidSystem = new BoidSystem(this.canvas.width, this.canvas.height, 10, 0.05);

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
    this.boidSystem.add(this.canvas.width * 0.6, this.canvas.height * 0.6, -Math.PI * .5);
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

    // for (let i = 0; i < this.boidSystem.halfEdges.length; i++) {
    //   let halfEdge = this.boidSystem.halfEdges[i];
    //   this.context.strokeStyle = `hsl(${i * 50 % 360}, 100%, 50%)`;
    //   this.context.beginPath();
    //   this.context.moveTo(halfEdge.a.x, halfEdge.a.y);
    //   this.context.lineTo(halfEdge.b.x, halfEdge.b.y);
    //   this.context.stroke();
    // }

    this.context.putImageData(this.boidSystem.imageData, 0, 0);
  }
}

new Main();
