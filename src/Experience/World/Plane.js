import * as THREE from 'three';
import Experience from '../Experience';

export default class Plane {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    // Setup
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15, 15),
      new THREE.MeshStandardMaterial()
    );
    this.plane.receiveShadow = true;
    this.plane.rotation.y = Math.PI;
    this.plane.position.y = -5;
    this.plane.position.z = 5;
    this.scene.add(this.plane);
  }
}
