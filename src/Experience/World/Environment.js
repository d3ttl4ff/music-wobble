import * as THREE from 'three';
import Experience from '../Experience';

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Setup
    this.environmentMap = this.resources.items.environmentTexture;

    this.environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    // this.scene.background = this.environmentMap;
    this.scene.environment = this.environmentMap;
  }
}
