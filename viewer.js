import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf8f8f8);
const camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 4);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(10,10,10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

// 1. Laad het model
let model;
const loader = new GLTFLoader();
loader.load('model.glb', (gltf) => {
    model = gltf.scene;
    scene.add(model);
    updateModel(); // eerste keer toepassen
});

// 2. Laad de parameters
let parameters;
fetch('parameters.json')
  .then(res => res.json())
  .then(json => {
    parameters = json;
    createUI(parameters);
  });

// 3. Maak UI
function createUI(params) {
    const ui = document.getElementById('ui');
    ui.innerHTML = "<b>Parameters:</b><br>";
    for (const key in params) {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'param-' + key;
        input.value = params[key];
        input.style.width = "60px";
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

// 4. Update model (voorbeeld: schaal op basis van parameters)
function updateModel() {
    if (!model || !parameters) return;
    // Pas schaal aan op basis van Breedte en Hoogte (voorbeeld)
    let scaleX = 1, scaleY = 1;
    if (parameters['Breedte']) scaleX = parameters['Breedte']/800;
    if (parameters['Hoogte']) scaleY = parameters['Hoogte']/1200;
    model.scale.set(scaleX, scaleY, 1);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
