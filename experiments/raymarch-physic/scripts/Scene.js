'use strict';

let THREE = window.THREE;
let CANNON = window.CANNON;

import ShaderLoader from './ShaderLoader';
import MeshBody from './MeshBody';

let TIME_STEP = 1/60;

export default class Scene extends THREE.Scene {
  constructor() {
    super();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.y = 10;
    this.camera.position.z = 15;

    this.controls = new THREE.TrackballControls(this.camera);

    this.spheresMeshBody = [];

    /**
     * World
     */
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();

    /**
     * Spheres
     */
    for (var i = 0; i < 50; i++) {
      let sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(1));
      let sphereMeshBody = new MeshBody({
        mass: 5
      }, sphereMesh);
      sphereMeshBody.position.set(
        Math.random() * 10 - 5,
        Math.random() * 100,
        Math.random() * 10 - 5
      );
      this.world.add(sphereMeshBody);
      this.add(sphereMesh);
      this.spheresMeshBody.push(sphereMeshBody);
    }

    /**
     * Ground
     */
    let groundMesh = new THREE.Mesh(new THREE.CubeGeometry(20, 20, 1));
    groundMesh.geometry.computeBoundingBox();
    this.add(groundMesh);
    this.groundMeshBody = new MeshBody({
      mass: 0
    }, groundMesh);
    this.groundMeshBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    this.world.add(this.groundMeshBody);

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

    for (let sphereMeshBody of this.spheresMeshBody) {
      sphereMeshBody.update();
    }
    this.groundMeshBody.update();
  }
}
