import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAARenderPass } from 'three/addons/postprocessing/SSAARenderPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import Experience from './Experience.js';

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    // Debug panel
    if (this.debug.active) {
      this.rendererTweaks = this.debug.ui.addFolder({
        title: 'Renderer Tweaks',
        expanded: false,
      });
    }
    this.debugObject = {};

    this.setIntance();
    this.setPostProcessing();
  }

  setIntance() {
    // Debug items
    this.debugObject.clearColor = '#0f1c1a';

    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1;
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setClearColor(this.debugObject.clearColor);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    // Tweaks
    if (this.debug.active) {
      this.rendererTweaks
        .addBinding(this.debugObject, 'clearColor')
        .on('change', () => {
          this.instance.setClearColor(this.debugObject.clearColor);
          this.sSAARenderPass.clearColor = this.debugObject.clearColor;
        });
    }
  }

  setPostProcessing() {
    this.composer = new EffectComposer(this.instance);

    this.sSAARenderPass = new SSAARenderPass(
      this.scene,
      this.camera.instance,
      this.debugObject.clearColor,
      1
    );
    // this.RenderPass = new RenderPass(this.scene, this.camera.instance);
    this.composer.addPass(this.sSAARenderPass);

    this.filmPass = new FilmPass(8, false);
    this.composer.addPass(this.filmPass);

    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    this.composer.setSize(this.sizes.width, this.sizes.height);
    this.composer.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    // this.instance.render(this.scene, this.camera.instance);

    this.composer.render();
  }
}
