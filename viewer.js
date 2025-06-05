import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, model, parameters;

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

  // Vergroot Z-positie zodat grote modellen altijd zichtbaar zijn
  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 5000);
  camera.position.set(0, 0, 1000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Voeg canvas toe aan viewer-container div
  const container = document.getElementById('viewer-container');
  if (container) {
    container.innerHTML = ""; // leegmaken bij herladen
    container.appendChild(renderer.domElement);
  } else {
    document.body.appendChild(renderer.domElement);
  }

  // Lichten
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

// Model laden
function loadModel() {
  const loader = new GLTFLoader();
  console.log("Bezig met laden van: model.glb");
  loader.load(
    'model.glb',
    function (gltf) {
      console.log("Model geladen!");
      model = gltf.scene;
      scene.add(model);
      updateModel();
    },
    function (xhr) {
      if (xhr.lengthComputable) {
        console.log(`Model laden: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
      }
    },
    function (error) {
      showError("Fout bij laden van model.glb. Bestaat het bestand en is het een geldig glb-bestand?");
      console.error(error);
    }
  );
}

// Parameters laden
function loadParameters() {
  console.log("Bezig met laden van: model.json");
  fetch('model.json')
    .then(res => {
      if (!res.ok) throw new Error("JSON niet gevonden");
      return res.json();
    })
    .then(json => {
      console.log("JSON geladen!", json);
      parameters = json;
      createUI(parameters);
    })
    .catch(err => {
      showError("Fout bij laden van model.json. Bestaat het bestand en is het geldig JSON?");
      console.error(err);
    });
}

// UI maken voor parameters
function createUI(params) {
  const ui = document.getElementById('ui');
  if (!ui) return;
  ui.innerHTML = "<b>Parameters:</b><br>";
  for (const key in params) {
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'param-' + key;
    input.value = params[key];
    input.style.width = "70px";
    input.onchange = (e) => {
      parameters[key] = parseFloat(e.target.value);
      updateModel();
    };
    const label = document.createElement('label');
    label.innerText = key + ": ";
    label.appendChild(input);
    ui.appendChild(label);
    ui.appendChild(document.createElement('br'));
  }
}

// Model schalen o.b.v. parameters (voorbeeld)
function updateModel() {
  if (!model || !parameters) return;
  // Voorbeeld: schaal op basis van 'Breedte' en 'Hoogte' als aanwezig
  let scaleX = 1, scaleY = 1, scaleZ = 1;
  if (parameters['Breedte']) scaleX = parameters['Breedte'] / 800;
  if (parameters['Hoogte']) scaleY = parameters['Hoogte'] / 1200;
  if (parameters['Dikte']) scaleZ = parameters['Dikte'] / 18;
  model.scale.set(scaleX, scaleY, scaleZ);
}

function animate() {
  requestAnimationFrame(animate);
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// Initialisatie
document.addEventListener('DOMContentLoaded', () => {
  initThree();
  loadModel();
  loadParameters();
  animate();
});
