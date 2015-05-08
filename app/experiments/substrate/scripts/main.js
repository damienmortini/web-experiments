import SubstrateSystem from "../../../dlib/substrate/SubstrateSystem";
import SubstrateDebugRenderer from "../../../dlib/substrate/SubstrateDebugRenderer";

class Main {
  constructor() {

    this.canvas = document.querySelector("canvas#main");
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.context = this.canvas.getContext("2d");

    this.substrateSystem = new SubstrateSystem(this.canvas.width, this.canvas.height, {
      speed: 10,
      spawnProbabilityRatio: 0.05
    });

    this.substrateDebugRenderer = new SubstrateDebugRenderer(this.substrateSystem, {
      canvas: document.querySelector("canvas#debug"),
      edgesDebug: false,
      polygonsDebug: false
    });

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

    let velocityAngle = Math.atan2(this.pointer.y - this.pointer.previousY, this.pointer.x - this.pointer.previousX);

    // if(this.pointer.down) {
      // if(Math.abs(this.pointer.previousX - this.pointer.x) > 0 && Math.abs(this.pointer.previousY - this.pointer.y) > 0) {
      //   this.substrateSystem.addBoid(
      //     this.pointer.x,
      //     this.pointer.y,
      //     velocityAngle,
      //     500
      //   );
      // }
    // }

    this.substrateSystem.update();

    this.substrateDebugRenderer.update();
  }
}

window.main = new Main();
