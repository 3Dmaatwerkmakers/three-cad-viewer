import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/loaders/GLTFLoader.js';


let scene, camera, renderer, model;

function showError(message) {
  let ui = document.getElementById('ui');
  if (ui) {
    ui.innerHTML = `<span style="color: red; font-weight: bold;">${message}</span>`;
  } else {
    alert(message);
  }
  console.error(message);
}

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f8f8);

  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 5000);
  camera.position.set(0, 0, 1000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const container = document.getElementById('viewer-container');
  if (container) {
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
  } else {
    document.body.appendChild(renderer.domElement);
  }

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(10, 10, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Alleen model laden, geen parameters
function loadModel() {
  const loader = new GLTFLoader();
  console.log("Bezig met laden van: model.glb");
  loader.load(
    'model.glb',
    function (gltf) {
      console.log("model geladen!");
      model = gltf.scene;
      scene.add(model);
    },
    function (xhr) {
      if (xhr.lengthComputable) {
        console.log(`model laden: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
      }
    },
    function (error) {
      showError("Fout bij laden van model.glb. Bestaat het bestand en is het een geldig glb-bestand?");
      console.error(error);
    }
  );
}

function animate() {
  requestAnimationFrame(animate);
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// Initialisatie zonder parameters
document.addEventListener('DOMContentLoaded', () => {
  initThree();
  loadModel();
  animate();
});
