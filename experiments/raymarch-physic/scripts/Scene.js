'use strict';

let THREE = window.THREE;
let CANNON = window.CANNON;

import ShaderLoader from './ShaderLoader';

let TIME_STEP = 1/60;

export default class Scene extends THREE.Scene {
  constructor() {
    super();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.y = 10;
    this.camera.position.z = 15;

    this.controls = new THREE.TrackballControls(this.camera);

    /**
     * World
     */
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();

    /**
     * Spheres
     */
    for (var i = 0; i < 5; i++) {
      let sphereBody = new CANNON.Body({
        mass: 5
      });
      sphereBody.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10,
        Math.random() * 10 - 5
      );
      sphereBody.addShape(new CANNON.Sphere(1));
      this.world.add(sphereBody);
    }

    /**
     * Ground
     */
    let groundBody = new CANNON.Body({
      mass: 0
    });
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    groundBody.addShape(new CANNON.Plane());
    this.world.add(groundBody);

    this.cannonDebugRenderer = new THREE.CannonDebugRenderer( this, this.world );

    /**
     * Load shader
     */
    ShaderLoader.load('./shaders/world.vert', './shaders/world.frag').then(
      function (result) {
        console.log(result);
      }
    );
  }

  update() {
    this.controls.update();

    this.world.step(TIME_STEP);

    this.cannonDebugRenderer.update();
  }
}
