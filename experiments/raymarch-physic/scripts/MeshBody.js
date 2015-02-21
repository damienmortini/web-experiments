'use strict';

let THREE = window.THREE;
let CANNON = window.CANNON;

export default class Scene extends CANNON.Body {
  constructor(options, mesh) {
    super(options);
    this.mesh = mesh;

    let shape;
    if (mesh.geometry.boundingBox) {
      var vec3 = new THREE.Vector3();
      vec3.subVectors(mesh.geometry.boundingBox.max, mesh.geometry.boundingBox.min).divideScalar(2);
      shape = new CANNON.Box(new CANNON.Vec3().copy(vec3));
    }
    else if (mesh.geometry.boundingSphere) {
      shape = new CANNON.Sphere(mesh.geometry.boundingSphere.radius);
    }
    this.addShape(shape);

    this.update();
  }

  update() {
    this.mesh.position.copy(this.position);
    this.mesh.quaternion.copy(this.quaternion);
  }
}
