import * as THREE from 'three';
import Experience from '../Experience';

export default class Lights {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    // Options
    if (this.debug.active) {
      this.tweaks = this.debug.ui.addFolder({
        title: 'Light Tweaks',
        expanded: false,
      });
    }
    this.debugObject = {};

    this.setDirectionalLight();
  }

  setDirectionalLight() {
    // Debug parameters
    this.debugObject.color = '#7affe9';

    this.directionalLight = new THREE.DirectionalLight(
      this.debugObject.color,
      3
    );
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.normalBias = 0.05;
    this.directionalLight.position.set(-10, -7, -1);
    this.scene.add(this.directionalLight);

    // Tweaks
    if (this.debug.active) {
      this.tweaks.addBinding(this.debugObject, 'color').on('change', () => {
        this.directionalLight.color.set(this.debugObject.color);
      });
      this.tweaks.addBinding(this.directionalLight, 'intensity', {
        min: 0,
        max: 10,
        step: 0.001,
      });
      this.tweaks.addBinding(this.directionalLight.position, 'x', {
        label: 'xPosition',
        min: -10,
        max: 10,
        step: 0.001,
      });
      this.tweaks.addBinding(this.directionalLight.position, 'y', {
        label: 'yPosition',
        min: -10,
        max: 10,
        step: 0.001,
      });
      this.tweaks.addBinding(this.directionalLight.position, 'z', {
        label: 'zPosition',
        min: -10,
        max: 10,
        step: 0.001,
      });
    }
  }
}
