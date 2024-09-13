/**
 * Audio by https://skullbeatz.newgrounds.com/
 */

import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import Experience from '../Experience';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import wobbleVertexShader from '../../shaders/wobble/vertex.glsl';
import wobbleFragmentShader from '../../shaders/wobble/fragment.glsl';

export default class Wobble {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;

    // Options
    if (this.debug.active) {
      this.tweaks = this.debug.ui.addFolder({ title: 'Wobble Tweaks' });
    }
    this.debugObject = {};

    this.setAudio();
    this.loadModels();
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setAudio() {
    // Audio parameters
    this.debugObject.volume = 0.5;

    // Audio listener
    this.listner = new THREE.AudioListener();
    this.camera.instance.add(this.listner);

    // Gobal audio source
    this.sound = new THREE.Audio(this.listner);

    // Load sound
    this.audioLoader = new THREE.AudioLoader();
    this.audioLoader.load(
      'audio/Skullbeatz_Bad_Cat_Master_Version.mp3',
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(false);
        this.sound.setVolume(this.debugObject.volume);

        window.addEventListener('keydown', (ev) => {
          if (ev.key === 'p') {
            if (!this.sound.isPlaying) {
              if (this.sound.context.state === 'suspended') {
                this.sound.context.resume().then(() => {
                  this.sound.play();
                });
              } else {
                this.sound.play();
              }
            } else {
              this.sound.stop();
            }
          }
        });
      }
    );

    // Analyzer
    this.analyzer = new THREE.AudioAnalyser(this.sound, 128);
  }

  loadModels() {
    this.model = this.resources.items.suzanneModel;
  }

  setGeometry() {
    this.geometry = new THREE.IcosahedronGeometry(2.5, 80);

    // Merge the vertices of the geometry to generate an indexed geometry
    this.geometry = mergeVertices(this.geometry);

    this.geometry.computeTangents();
  }

  setMaterial() {
    // Debug parameters
    this.debugObject.color0 = '#009d83';
    this.debugObject.color1 = '#9d2200';

    this.uniforms = {
      uTime: new THREE.Uniform(0),

      uPositionFrequency: new THREE.Uniform(0.5),
      uTimeFrequncy: new THREE.Uniform(0.4), // 0.4
      uStrength: new THREE.Uniform(0.3),

      uWarpPositionFrequency: new THREE.Uniform(0.38),
      uWarpTimeFrequncy: new THREE.Uniform(0.12), // 0.12
      uWarpStrength: new THREE.Uniform(1.7),

      uColor0: new THREE.Uniform(new THREE.Color(this.debugObject.color0)),
      uColor1: new THREE.Uniform(new THREE.Color(this.debugObject.color1)),
      uMixStrength: new THREE.Uniform(1),

      uAudioFrequncy: new THREE.Uniform(0),
      uAudioMultiplier: new THREE.Uniform(0.55),
    };

    this.material = new CustomShaderMaterial({
      // CSM
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: wobbleVertexShader,
      fragmentShader: wobbleFragmentShader,
      uniforms: this.uniforms,
      silent: true,

      // MeshPhysicalmaterial
      metalness: 1,
      roughness: 0.5,
      transmission: 0,
      ior: 1.5,
      thickness: 1.5,
      transparent: true,
      wireframe: false,
    });

    this.depthMaterial = new CustomShaderMaterial({
      // CSM
      baseMaterial: THREE.MeshDepthMaterial,
      vertexShader: wobbleVertexShader,
      uniforms: this.uniforms,
      silent: true,

      // MeshDepthMaterial
      depthPacking: THREE.RGBADepthPacking,
    });

    // Tweaks
    if (this.debug.active) {
      const baseTweaks = this.tweaks.addFolder({
        title: 'Base Tweaks',
        expanded: false,
      });
      baseTweaks.addBinding(this.uniforms.uPositionFrequency, 'value', {
        min: 0,
        max: 2,
        step: 0.001,
        label: 'uPosition Frequency',
      });
      baseTweaks.addBinding(this.uniforms.uTimeFrequncy, 'value', {
        min: 0,
        max: 2,
        step: 0.001,
        label: 'uTime Frequncy',
      });
      baseTweaks.addBinding(this.uniforms.uStrength, 'value', {
        min: 0,
        max: 2,
        step: 0.001,
        label: 'uStrength',
      });

      const warpTweaks = this.tweaks.addFolder({
        title: 'Warp Tweaks',
        expanded: false,
      });
      warpTweaks.addBinding(this.uniforms.uWarpPositionFrequency, 'value', {
        min: 0,
        max: 2,
        step: 0.001,
        label: 'uWarp Position Frequency',
      });
      warpTweaks.addBinding(this.uniforms.uWarpTimeFrequncy, 'value', {
        min: 0,
        max: 2,
        step: 0.001,
        label: 'uWarp Time Frequncy',
      });
      warpTweaks.addBinding(this.uniforms.uWarpStrength, 'value', {
        min: 0,
        max: 5,
        step: 0.001,
        label: 'uWarp Strength',
      });

      const materialTweaks = this.tweaks.addFolder({
        title: 'Material Tweaks',
      });
      materialTweaks.addBinding(this.debugObject, 'color0').on('change', () => {
        this.uniforms.uColor0.value.set(this.debugObject.color0);
      });
      materialTweaks.addBinding(this.debugObject, 'color1').on('change', () => {
        this.uniforms.uColor1.value.set(this.debugObject.color1);
      });
      materialTweaks.addBinding(this.uniforms.uMixStrength, 'value', {
        min: 0,
        max: 10,
        step: 0.001,
        label: 'uMix Strength',
      });

      materialTweaks.addBinding(this.material, 'metalness', {
        min: 0,
        max: 1,
        step: 0.001,
      });
      materialTweaks.addBinding(this.material, 'roughness', {
        min: 0,
        max: 1,
        step: 0.001,
      });
      materialTweaks.addBinding(this.material, 'transmission', {
        min: 0,
        max: 1,
        step: 0.001,
      });
      materialTweaks.addBinding(this.material, 'ior', {
        min: 0,
        max: 10,
        step: 0.001,
      });
      materialTweaks.addBinding(this.material, 'thickness', {
        min: 0,
        max: 10,
        step: 0.001,
      });

      const audioTweaks = this.tweaks.addFolder({
        title: 'Audio Tweaks',
      });
      audioTweaks.addButton({ title: 'Play' }).on('click', () => {
        if (!this.sound.isPlaying) {
          if (this.sound.context.state === 'suspended') {
            this.sound.context.resume().then(() => {
              this.sound.play();
            });
          } else {
            this.sound.play();
          }
        }
      });
      audioTweaks.addButton({ title: 'Pause' }).on('click', () => {
        if (this.sound.isPlaying) {
          if (this.sound.context.state === 'suspended') {
            this.sound.context.resume().then(() => {
              this.sound.pause();
            });
          } else {
            this.sound.pause();
          }
        }
      });
      audioTweaks.addButton({ title: 'Stop' }).on('click', () => {
        if (this.sound.context.state === 'suspended') {
          this.sound.context.resume().then(() => {
            this.sound.stop();
          });
        } else {
          this.sound.stop();
        }
      });
      audioTweaks.addBinding(this.uniforms.uAudioMultiplier, 'value', {
        min: 0,
        max: 2,
        step: 0.001,
        label: 'uAudio Multiplier',
      });
      audioTweaks
        .addBinding(this.debugObject, 'volume', {
          min: 0,
          max: 1,
          step: 0.001,
        })
        .on('change', () => {
          this.sound.setVolume(this.debugObject.volume);
        });
    }
  }

  setMesh() {
    // Sphere
    this.wobble = new THREE.Mesh(this.geometry, this.material);
    this.wobble.customDepthMaterial = this.depthMaterial;
    this.wobble.receiveShadow = true;
    this.wobble.castShadow = true;
    this.scene.add(this.wobble);

    // // Model
    // this.wobble = this.model.scene.children[0];
    // this.wobble.material = this.material;
    // this.wobble.customDepthMaterial = this.depthMaterial;
    // this.wobble.receiveShadow = true;
    // this.wobble.castShadow = true;
    // this.scene.add(this.wobble);
  }

  update() {
    // Update material
    this.uniforms.uTime.value = this.time.elapsed * 0.001;
    this.uniforms.uAudioFrequncy.value = this.analyzer.getAverageFrequency();

    // Update mesh
    this.wobble.rotation.y = this.time.elapsed * 0.001 * 0.2;
    this.wobble.rotation.z = this.time.elapsed * 0.001 * 0.1;
  }
}
