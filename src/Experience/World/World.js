import Experience from '../Experience.js';
import Environment from './Environment.js';
import Lights from './Lights.js';
import Plane from './Plane.js';
import Wobble from './Wobble.js';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.resources.on('ready', () => {
      this.environment = new Environment();
      this.wobble = new Wobble();
      // this.plane = new Plane();
      this.lights = new Lights();
    });
  }

  update() {
    if (this.wobble) {
      this.wobble.update();
    }
  }
}
