// import BoidSystem3D from "dlib/substrate/BoidSystem3D";
import SubstrateSystem from "dlib/substrate/SubstrateSystem";

class Main {
  constructor() {

    this.canvas = document.querySelector("canvas#main");

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.context = this.canvas.getContext("2d");

    this.buffer = document.createElement("canvas");
    this.buffer.width = this.canvas.width;
    this.buffer.height = this.canvas.height;
    this.bufferContext = this.buffer.getContext("2d");

    this.debugCanvas = document.querySelector("canvas#debug");
    this.debugCanvas.width = this.canvas.width;
    this.debugCanvas.height = this.canvas.height;
    this.debugContext = this.debugCanvas.getContext("2d");

    // let normalsCanvas = document.querySelector("canvas#normals");
    // let depthCanvas = document.querySelector("canvas#depth");

    this.substrateSystem = new SubstrateSystem(this.canvas.width, this.canvas.height, {
      speed: 10,
      spawnProbabilityRatio: 0.05,
      // spawnProbabilityRatio: 0,
      polygonMatchMethod: this.drawPolygon.bind(this)
    });

    // for(let i = 0; i < 500; i++) {
    //   setTimeout(() =>{
    //     this.substrateSystem.spawnOptions = {
    //       velocityAngle: Math.PI * .30 * (i % 2 ? -1 : 1)
    //       // velocityAngle: Math.PI * .5 * (i % 2 ? -1 : 1)
    //     }
    //     this.substrateSystem.spawnProbabilityRatio = 1;
    //     this.substrateSystem.update();
    //   }, 500 + (i + 1) * 100);
    // }

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

    this.substrateSystem.addBoid(this.canvas.width * 0.5, this.canvas.height * 0.5, Math.PI);
    // this.substrateSystem.addBoid(this.canvas.width * 0.62, this.canvas.height * 0.3, -Math.PI * .5);
    // this.substrateSystem.addBoid(this.canvas.width * 0.48, this.canvas.height * 0.45, -Math.PI * .25);
    // this.substrateSystem.addBoid(this.canvas.width * 0.47, this.canvas.height * 0.55, Math.PI * .25);
    // this.substrateSystem.addBoid(this.canvas.width * 0.60, this.canvas.height * 0.57, Math.PI * .75);
    // this.substrateSystem.addBoid(this.canvas.width * 0.60, this.canvas.height * 0.42, -Math.PI * .75);
    // this.substrateSystem.addBoid(this.canvas.width * 0.5, this.canvas.height * 0.5, 0);
    // this.substrateSystem.addBoid(this.canvas.width * 0.6, this.canvas.height * 0.6, Math.PI * .5);
    // this.substrateSystem.addBoid(this.canvas.width * 0.7, this.canvas.height * 0.6, Math.PI * .5);
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

  drawPolygon (polygon) {
    this.bufferContext.fillStyle = `hsl(${360 * Math.random()}, 100%, 75%)`;
    this.bufferContext.beginPath();
    let vertex = polygon.vertices[0];
    this.bufferContext.moveTo(vertex.x, vertex.y);
    for (let i = 1; i < polygon.vertices.length - 1; i++) {
      vertex = polygon.vertices[i];
      this.bufferContext.lineTo(vertex.x, vertex.y);
    }
    this.bufferContext.fill();
  }

  update () {
    requestAnimationFrame(this.update.bind(this));

    // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let velocityAngle = Math.atan2(this.pointer.y - this.pointer.previousY, this.pointer.x - this.pointer.previousX);

    // if(this.pointer.down) {
      // if(Math.abs(this.pointer.previousX - this.pointer.x) > 0 && Math.abs(this.pointer.previousY - this.pointer.y) > 0) {
      //   this.substrateSystem.addBoid(
      //     this.pointer.x,
      //     this.pointer.y,
      //     velocityAngle,
      //     (Math.random() - 0.5) * 0.1,
      //     500
      //   );
      // }
    // }

    this.substrateSystem.update();

    this.debugContext.putImageData(this.substrateSystem.imageData, 0, 0);

    // this.drawDebug();

    this.context.globalAlpha = .1;

    this.context.drawImage(this.buffer, 0, 0);
  }

  drawDebug () {
    for (let i = 0; i < this.substrateSystem.edges.length; i++) {
      let edge = this.substrateSystem.edges[i];

      let debugColor = this.substrateSystem.getDebugColor(edge.id);

      this.debugContext.strokeStyle = `rgb(${debugColor.r}, ${debugColor.g}, ${debugColor.b})`;
      // this.debugContext.globalAlpha = .5;

      // this.debugContext.beginPath();
      // this.debugContext.setLineDash([]);
      // this.debugContext.moveTo(edge.a.x, edge.a.y);
      // this.debugContext.lineTo(edge.b.x, edge.b.y);
      // this.debugContext.stroke();

      this.debugContext.beginPath();
      this.debugContext.setLineDash([2, 8]);

      let p1;
      let p2;


      p1 = edge.getPointFromRatio(.6);
      p2 = edge.next.getPointFromRatio(.4);

      this.debugContext.moveTo(p1.x, p1.y);
      this.debugContext.quadraticCurveTo(edge.next.a.x, edge.next.a.y, p2.x, p2.y);

      p1 = edge.twin.getPointFromRatio(.6);
      p2 = edge.twin.next.getPointFromRatio(.4);

      this.debugContext.moveTo(p1.x, p1.y);
      this.debugContext.quadraticCurveTo(edge.twin.next.a.x, edge.twin.next.a.y, p2.x, p2.y);

      this.debugContext.stroke();

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
      // this.debugContext.beginPath();
      // this.debugContext.arc(edge.b.x + offsetX * 5, edge.b.y + offsetY * 5, 2, 0, Math.PI * 2);
      // this.debugContext.stroke();
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
      this.debugContext.setLineDash([]);
      this.debugContext.beginPath();
      this.debugContext.arc(edge.b.x, edge.b.y, 2, 0, Math.PI * 2);
      this.debugContext.stroke();

      this.debugContext.fillStyle = this.debugContext.strokeStyle;
      let center = edge.getCenter();
      this.debugContext.fillText(edge.id, center.x - 5, center.y - 2);

      if (edge.id === 24) {
      // if (false) {
        // this.debugContext.beginPath();
        // this.debugContext.arc(edge.b.x, edge.b.y, 20, 0, Math.PI * 2);
        // this.debugContext.stroke();

        this.debugContext.strokeStyle = 'red';
        // this.debugContext.setLineDash([2, 4]);
        this.debugContext.setLineDash([]);
        for (let i = 0; i < 2; i++) {
          this.debugContext.beginPath();
          let nextEdge = i === 0 ? edge : edge.twin;
          let p1;
          let p2;
          this.debugContext.moveTo(nextEdge.a.x, nextEdge.a.y);
          let draw = true;
          for (let i = 0; i < 100; i++) {
            if (nextEdge.next === nextEdge.twin) {
              draw = false;
              break;
            }

            p1 = nextEdge.getPointFromRatio(.6);
            p2 = nextEdge.next.getPointFromRatio(.4);

            this.debugContext.moveTo(p1.x, p1.y);
            this.debugContext.quadraticCurveTo(nextEdge.next.a.x, nextEdge.next.a.y, p2.x, p2.y);

            p1 = nextEdge.twin.getPointFromRatio(.6);
            p2 = nextEdge.twin.next.getPointFromRatio(.4);

            this.debugContext.moveTo(p1.x, p1.y);
            this.debugContext.quadraticCurveTo(nextEdge.twin.next.a.x, nextEdge.twin.next.a.y, p2.x, p2.y);

            nextEdge = nextEdge.next;
          }
          if( draw ) {
            this.debugContext.stroke();
          }
        }
      }
    }
  }
}

window.main = new Main();
