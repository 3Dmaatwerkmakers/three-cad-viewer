// viewer.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// GLTF model laden
const loader = new GLTFLoader();
loader.load('box.glb',
  (gltf) => {
    console.log("Model geladen:", gltf);
    const model = gltf.scene;
    scene.add(model);
  },
  (xhr) => {
    console.log(`Laden: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
  },
  (error) => {
    console.error("Fout bij laden:", error);
  }
);

//loader.load('box.glb', (gltf) => {
//const model = gltf.scene;
//scene.add(model);
//}, undefined, (error) => {
// console.error('Fout bij laden GLB:', error);
//});

// Animatielus
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Venster-resize ondersteuning
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

