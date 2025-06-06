import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(light);

// Model laden
const loader = new GLTFLoader();
loader.load('box.glb',
  (gltf) => {
    console.log('Model geladen:', gltf);
    scene.add(gltf.scene);
  },
  undefined,
  (error) => {
    console.error('Fout bij laden model:', error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
