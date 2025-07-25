import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-1, 1, 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// GLB Loader
const loader = new GLTFLoader();
let sphere;

// Create a fallback sphere while loading GLB
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff6b6b,
    shininess: 100,
    specular: 0x111111
});
sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
scene.add(sphere);

// Try to load GLB model (optional - will use fallback sphere if not found)
loader.load(
    'sphere.glb',
    function (gltf) {
        // Remove fallback sphere
        scene.remove(sphere);
        
        // Add GLB model
        sphere = gltf.scene;
        sphere.scale.set(1, 1, 1);
        sphere.castShadow = true;
        sphere.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        scene.add(sphere);
        console.log('GLB sphere loaded successfully');
    },
    function (progress) {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
    },
    function (error) {
        console.log('GLB loading failed, using fallback sphere:', error);
    }
);

// Ground plane
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -3;
ground.receiveShadow = true;
scene.add(ground);

// Camera position
camera.position.set(0, 0, 8);

// Animation variables
let sphereVelocityY = 0;
let sphereVelocityX = 0.02;
let sphereVelocityZ = 0.01;
const gravity = -0.005;
const bounce = 0.8;
const groundY = -2;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update sphere physics
    sphereVelocityY += gravity;
    sphere.position.y += sphereVelocityY;
    sphere.position.x += sphereVelocityX;
    sphere.position.z += sphereVelocityZ;

    // Bounce off ground
    if (sphere.position.y <= groundY) {
        sphere.position.y = groundY;
        sphereVelocityY = -sphereVelocityY * bounce;
    }

    // Bounce off walls
    if (sphere.position.x > 5 || sphere.position.x < -5) {
        sphereVelocityX = -sphereVelocityX;
    }
    if (sphere.position.z > 5 || sphere.position.z < -5) {
        sphereVelocityZ = -sphereVelocityZ;
    }

    // Add some rotation for visual effect
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();