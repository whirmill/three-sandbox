import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Loading progress management
let loadingProgress = 0;
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const loader = document.getElementById('loader');

function updateProgress(progress) {
    loadingProgress = progress;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Loading... ${Math.round(progress)}%`;
}

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// Luxury jewelry lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Key light for diamond sparkle
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 10, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far = 50;
keyLight.shadow.camera.left = -10;
keyLight.shadow.camera.right = 10;
keyLight.shadow.camera.top = 10;
keyLight.shadow.camera.bottom = -10;
scene.add(keyLight);

// Fill light
const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
fillLight.position.set(-5, 5, -5);
scene.add(fillLight);

// Rim light for dramatic effect
const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
rimLight.position.set(0, -5, -10);
scene.add(rimLight);

// Point lights for sparkle
const sparkleLight1 = new THREE.PointLight(0xffffff, 0.5, 20);
sparkleLight1.position.set(3, 3, 3);
scene.add(sparkleLight1);

const sparkleLight2 = new THREE.PointLight(0xffffff, 0.5, 20);
sparkleLight2.position.set(-3, 3, -3);
scene.add(sparkleLight2);

// Create ring and diamond
let ring, diamond, jewelryGroup;
const gltfLoader = new GLTFLoader();

// Create realistic jewelry
function createRealisticJewelry() {
    jewelryGroup = new THREE.Group();
    
    // Create ring band with better proportions
    const ringBandGeometry = new THREE.TorusGeometry(1.0, 0.08, 12, 48);
    const goldMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffdb58, // More realistic gold color
        metalness: 1.0,
        roughness: 0.12,
        reflectivity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.5,
    });
    const ringBand = new THREE.Mesh(ringBandGeometry, goldMaterial);
    ringBand.castShadow = true;
    ringBand.receiveShadow = true;
    
    // Add decorative details to the band
    const detailGeometry = new THREE.TorusGeometry(1.02, 0.01, 6, 24);
    const detailMaterial = goldMaterial.clone();
    detailMaterial.roughness = 0.05; // Shinier details
    
    // Add multiple decorative rings
    for (let i = 0; i < 3; i++) {
        const detail = new THREE.Mesh(detailGeometry, detailMaterial);
        detail.position.y = -0.06 + (i * 0.03);
        detail.castShadow = true;
        jewelryGroup.add(detail);
    }
    
    // Create ring head (wider part that holds the diamond) with more realistic shape
    const ringHeadGeometry = new THREE.CylinderGeometry(0.22, 0.16, 0.1, 16);
    const ringHead = new THREE.Mesh(ringHeadGeometry, goldMaterial);
    ringHead.position.y = 0.05;
    ringHead.castShadow = true;
    ringHead.receiveShadow = true;
    
    // Add gallery (decorative openwork under the diamond)
    const galleryGeometry = new THREE.TorusGeometry(0.18, 0.015, 6, 16);
    const gallery = new THREE.Mesh(galleryGeometry, goldMaterial);
    gallery.position.y = 0.15;
    gallery.castShadow = true;
    jewelryGroup.add(gallery);
    
    // Create prongs to hold the diamond
    const prongGeometry = new THREE.CylinderGeometry(0.02, 0.015, 0.3, 8);
    const prongs = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const prong = new THREE.Mesh(prongGeometry, goldMaterial);
        prong.position.x = Math.cos(angle) * 0.15;
        prong.position.z = Math.sin(angle) * 0.15;
        prong.position.y = 0.25;
        prong.castShadow = true;
        prongs.push(prong);
        jewelryGroup.add(prong);
    }
    
    // Create realistic diamond with brilliant cut
    const diamondGeometry = createDiamondGeometry();
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.98,
        thickness: 0.05,
        ior: 2.417, // Real diamond IOR
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        dispersion: 0.025, // Add spectral dispersion for rainbow effect
        opacity: 0.1,
        transparent: true,
    });
    diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamond.position.y = 0.35;
    diamond.castShadow = true;
    
    // Add all parts to the group
    jewelryGroup.add(ringBand);
    jewelryGroup.add(ringHead);
    jewelryGroup.add(diamond);
    
    // Store references
    ring = jewelryGroup;
    
    // Start with large scale for zoom-out effect
    jewelryGroup.scale.set(8, 8, 8);
    jewelryGroup.position.set(0, 0, 0);
    
    scene.add(jewelryGroup);
    return jewelryGroup;
}

// Create a realistic diamond geometry (brilliant cut approximation)
function createDiamondGeometry() {
    const geometry = new THREE.ConeGeometry(0.12, 0.25, 8, 1);
    
    // Create crown (top part)
    const crownGeometry = new THREE.ConeGeometry(0.12, 0.08, 8, 1);
    const crownMesh = new THREE.Mesh(crownGeometry);
    crownMesh.position.y = 0.165;
    crownMesh.rotation.x = Math.PI;
    
    // Create pavilion (bottom part)  
    const pavilionGeometry = new THREE.ConeGeometry(0.12, 0.17, 8, 1);
    const pavilionMesh = new THREE.Mesh(pavilionGeometry);
    pavilionMesh.position.y = -0.085;
    
    // Merge geometries
    const mergedGeometry = new THREE.BufferGeometry();
    const crownPositions = crownMesh.geometry.attributes.position;
    const pavilionPositions = pavilionMesh.geometry.attributes.position;
    
    // Create faceted diamond shape
    const diamondShape = new THREE.CylinderGeometry(0.12, 0.03, 0.25, 12, 1);
    
    // Add beveled edges for more realism
    const vertices = diamondShape.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];
        
        // Add slight randomness for faceting effect
        if (Math.abs(y) > 0.05) {
            vertices[i] *= 1 + Math.sin(Math.atan2(z, x) * 12) * 0.05;
            vertices[i + 2] *= 1 + Math.cos(Math.atan2(z, x) * 12) * 0.05;
        }
    }
    
    diamondShape.attributes.position.needsUpdate = true;
    diamondShape.computeVertexNormals();
    
    return diamondShape;
}

// Create realistic jewelry
createRealisticJewelry();

// Simulate loading progress
let progress = 0;
const loadingInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        finishLoading();
    }
    updateProgress(progress);
}, 200);

function finishLoading() {
    updateProgress(100);
    setTimeout(() => {
        // Hide loader and show scene
        loader.classList.add('hidden');
        renderer.domElement.classList.add('visible');
        startJewelryAnimation();
    }, 500);
}

// Camera position
camera.position.set(0, 2, 6);
camera.lookAt(0, 0, 0);

// Animation variables
let animationStarted = false;
let time = 0;

function startJewelryAnimation() {
    animationStarted = true;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    time += 0.016; // 60fps

    if (animationStarted && jewelryGroup) {
        // Zoom out effect (scale down from 8 to 1)
        const zoomProgress = Math.min(time / 3, 1); // 3 seconds duration
        const scale = 8 - (7 * easeOutCubic(zoomProgress));
        jewelryGroup.scale.set(scale, scale, scale);

        // Rotation and tilt animation
        jewelryGroup.rotation.y = time * 0.3; // Slow rotation
        jewelryGroup.rotation.x = Math.sin(time * 0.5) * 0.1; // Gentle tilt
        jewelryGroup.rotation.z = Math.cos(time * 0.3) * 0.05; // Subtle roll

        // Diamond sparkle rotation
        if (diamond) {
            diamond.rotation.y = time * 2; // Fast diamond rotation for sparkle
        }

        // Sparkle lights animation
        sparkleLight1.intensity = 0.5 + Math.sin(time * 3) * 0.3;
        sparkleLight2.intensity = 0.5 + Math.cos(time * 2.5) * 0.3;
        
        // Move sparkle lights
        sparkleLight1.position.x = 3 + Math.sin(time) * 0.5;
        sparkleLight1.position.y = 3 + Math.cos(time * 1.2) * 0.5;
        
        sparkleLight2.position.x = -3 + Math.cos(time * 0.8) * 0.5;
        sparkleLight2.position.z = -3 + Math.sin(time * 0.9) * 0.5;
    }

    renderer.render(scene, camera);
}

// Easing function for smooth zoom out
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();