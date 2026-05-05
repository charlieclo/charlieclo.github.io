// --- Scene Setup ---
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();

// Soft sky color matching the palette
scene.background = new THREE.Color('#F4F1EA'); // Match the paper background
scene.fog = new THREE.Fog('#F4F1EA', 10, 40);

// Camera setup for an isometric-ish follow view
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
const cameraOffset = new THREE.Vector3(0, 8, 12); // Offset from the duck

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// --- Colors (Donald Duck Palette) ---
const colors = {
    navy: 0x0A1128,
    blue: 0x1E56A0,
    lightBlue: 0x4A86E8,
    yellow: 0xFFCC00,
    red: 0xE32636,
    white: 0xFFFFFF
};

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 20;
dirLight.shadow.camera.bottom = -20;
dirLight.shadow.camera.left = -20;
dirLight.shadow.camera.right = 20;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

// --- The Infinite Pond ---
// Reduce segments from 32x32 to 12x12 to drastically improve CPU performance
const waterGeo = new THREE.PlaneGeometry(200, 200, 12, 12);
const waterMat = new THREE.MeshStandardMaterial({ 
    color: colors.lightBlue, 
    transparent: true, 
    opacity: 0.85,
    roughness: 0.1,
    metalness: 0.1,
    flatShading: true
});
const water = new THREE.Mesh(waterGeo, waterMat);
water.rotation.x = -Math.PI / 2;
water.position.y = 0;
water.receiveShadow = true;
scene.add(water);

// --- The Coin ---
let score = 0;
const coinGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
const coinMat = new THREE.MeshStandardMaterial({ 
    color: colors.yellow, 
    metalness: 0.8, 
    roughness: 0.2 
});
const coin = new THREE.Mesh(coinGeo, coinMat);
coin.rotation.x = Math.PI / 2; // Stand upright
coin.position.set(0, 0.6, -5); // Initial position
coin.castShadow = true;
scene.add(coin);

function respawnCoin() {
    // Find all lilypads
    const lilypads = sceneryObjects.filter(obj => obj.userData.type === 'lilypad');
    if (lilypads.length === 0) return;
    
    // Pick a random lilypad
    const pad = lilypads[Math.floor(Math.random() * lilypads.length)];
    
    // Move this pad ahead of the duck so the player can see it
    const angle = duckGroup.rotation.y + (Math.random() - 0.5) * Math.PI * 0.8; 
    const spawnDist = SCENERY_RADIUS * 0.5 + Math.random() * (SCENERY_RADIUS * 0.3);
    
    pad.position.x = duckGroup.position.x + Math.cos(angle) * spawnDist;
    pad.position.z = duckGroup.position.z - Math.sin(angle) * spawnDist;
    
    // Place the coin exactly on the lilypad
    coin.position.x = pad.position.x;
    coin.position.z = pad.position.z;
}

// --- The Duck ---
const duckGroup = new THREE.Group();

// Body
const bodyGeo = new THREE.SphereGeometry(0.6, 16, 16);
const whiteMat = new THREE.MeshStandardMaterial({ color: colors.white, roughness: 0.5 });
const body = new THREE.Mesh(bodyGeo, whiteMat);
body.scale.set(1.2, 0.8, 1);
body.castShadow = true;
duckGroup.add(body);

// Head
const headGeo = new THREE.SphereGeometry(0.4, 16, 16);
const head = new THREE.Mesh(headGeo, whiteMat);
head.position.set(0.5, 0.6, 0);
head.castShadow = true;
duckGroup.add(head);

// Beak
const beakGeo = new THREE.ConeGeometry(0.15, 0.5, 16);
const beakMat = new THREE.MeshStandardMaterial({ color: colors.yellow });
const beak = new THREE.Mesh(beakGeo, beakMat);
beak.rotation.z = -Math.PI / 2;
beak.position.set(0.9, 0.6, 0);
beak.castShadow = true;
duckGroup.add(beak);

// Sailor Hat
const hatBaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
const hatMat = new THREE.MeshStandardMaterial({ color: colors.blue });
const hatBase = new THREE.Mesh(hatBaseGeo, hatMat);
hatBase.position.set(0.5, 1.05, 0);
hatBase.rotation.z = -0.2;
duckGroup.add(hatBase);

const hatTopGeo = new THREE.CylinderGeometry(0.25, 0.2, 0.15, 16);
const hatTopMat = new THREE.MeshStandardMaterial({ color: colors.white });
const hatTop = new THREE.Mesh(hatTopGeo, hatTopMat);
hatTop.position.set(0.5, 1.15, 0);
hatTop.rotation.z = -0.2;
duckGroup.add(hatTop);

// Add a little red bowtie
const bowGeo = new THREE.BoxGeometry(0.2, 0.1, 0.3);
const bowMat = new THREE.MeshStandardMaterial({ color: colors.red });
const bow = new THREE.Mesh(bowGeo, bowMat);
bow.position.set(0.7, 0.3, 0);
bow.rotation.x = Math.PI / 4;
duckGroup.add(bow);

duckGroup.position.set(0, 0, 0);
scene.add(duckGroup);

// --- Environment Generation (Trees & Lilypads) ---
const sceneryObjects = [];
const SCENERY_COUNT = 60;
const SCENERY_RADIUS = 30; // How far they spawn around the duck

function createTree() {
    const treeGroup = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1);
    const trunkMat = new THREE.MeshStandardMaterial({ color: colors.navy });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.5;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const leavesGeo = new THREE.ConeGeometry(1.2, 3, 5);
    const leavesMat = new THREE.MeshStandardMaterial({ color: colors.blue, flatShading: true });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.y = 2;
    leaves.castShadow = true;
    treeGroup.add(leaves);
    
    // Add a small island base for the tree
    const baseGeo = new THREE.CylinderGeometry(1.5, 1.8, 0.2, 8);
    const baseMat = new THREE.MeshStandardMaterial({ color: colors.navy, flatShading: true });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.1;
    base.receiveShadow = true;
    treeGroup.add(base);

    return treeGroup;
}

function createLilypad() {
    const padGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.05, 12);
    const padMat = new THREE.MeshStandardMaterial({ color: colors.navy, flatShading: true });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.y = 0.05;
    
    // Cut out a slice for the lilypad look
    const cutGeo = new THREE.BoxGeometry(1, 0.1, 0.2);
    const cutMat = new THREE.MeshBasicMaterial({ color: colors.lightBlue });
    const cut = new THREE.Mesh(cutGeo, cutMat);
    cut.position.set(0.5, 0, 0);
    pad.add(cut); // Simple visual hack
    
    pad.userData = { type: 'lilypad' };
    return pad;
}

// Initialize scenery
for (let i = 0; i < SCENERY_COUNT; i++) {
    const isTree = Math.random() > 0.6;
    const obj = isTree ? createTree() : createLilypad();
    
    // Random position within radius, but keep a clear area in the center for the duck
    const angle = Math.random() * Math.PI * 2;
    const minRadius = 6; // Keep a 6-unit radius clear around the spawn point
    const radius = minRadius + Math.random() * (SCENERY_RADIUS - minRadius);
    
    obj.position.x = Math.cos(angle) * radius;
    obj.position.z = Math.sin(angle) * radius;
    
    // Random rotation and scale
    obj.rotation.y = Math.random() * Math.PI * 2;
    const scale = 0.8 + Math.random() * 0.6;
    obj.scale.set(scale, scale, scale);
    
    scene.add(obj);
    sceneryObjects.push(obj);
}

// --- Controls & Physics ---
const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'ArrowUp': case 'KeyW': keys.forward = true; break;
        case 'ArrowDown': case 'KeyS': keys.backward = true; break;
        case 'ArrowLeft': case 'KeyA': keys.left = true; break;
        case 'ArrowRight': case 'KeyD': keys.right = true; break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.code) {
        case 'ArrowUp': case 'KeyW': keys.forward = false; break;
        case 'ArrowDown': case 'KeyS': keys.backward = false; break;
        case 'ArrowLeft': case 'KeyA': keys.left = false; break;
        case 'ArrowRight': case 'KeyD': keys.right = false; break;
    }
});

// --- Mobile Controls ---
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const mobileControls = document.getElementById('mobile-controls');
const wasdHint = document.getElementById('wasd-hint');

if (isTouchDevice && mobileControls) {
    mobileControls.style.display = 'flex';
    if (wasdHint) wasdHint.style.display = 'none';
    
    const setupBtn = (id, key) => {
        const btn = document.getElementById(id);
        if(!btn) return;
        
        const press = (e) => { e.preventDefault(); keys[key] = true; };
        const release = (e) => { e.preventDefault(); keys[key] = false; };
        
        btn.addEventListener('touchstart', press, { passive: false });
        btn.addEventListener('touchend', release, { passive: false });
        btn.addEventListener('touchcancel', release, { passive: false });
        
        // Fallback for mouse testing on desktop
        btn.addEventListener('mousedown', press);
        btn.addEventListener('mouseup', release);
        btn.addEventListener('mouseleave', release);
    };
    
    setupBtn('btn-up', 'forward');
    setupBtn('btn-down', 'backward');
    setupBtn('btn-left', 'left');
    setupBtn('btn-right', 'right');
}

let speed = 0;
const maxSpeed = 0.15;
const acceleration = 0.01;
const friction = 0.90;
let targetYaw = 0;

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const delta = clock.getDelta();

    // Handle Input (Absolute Direction)
    let dx = 0;
    let dz = 0;
    if (keys.right) dx += 1;
    if (keys.left) dx -= 1;
    if (keys.backward) dz += 1;
    if (keys.forward) dz -= 1;

    const isMoving = dx !== 0 || dz !== 0;

    if (isMoving) {
        // Calculate target rotation (Duck faces +X by default)
        targetYaw = Math.atan2(-dz, dx);
        speed += acceleration;
    }
    
    // Apply friction and limits
    speed *= friction;
    speed = Math.max(Math.min(speed, maxSpeed), 0);

    // Smoothly rotate duck to match target yaw (shortest path)
    if (speed > 0.001) {
        let diff = targetYaw - duckGroup.rotation.y;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff)); // Normalize to -PI to PI
        duckGroup.rotation.y += diff * 0.15;

        // Move duck in the direction it is currently facing
        duckGroup.position.x += Math.cos(duckGroup.rotation.y) * speed;
        duckGroup.position.z -= Math.sin(duckGroup.rotation.y) * speed;
    }

    // Bobbing animation based on speed and time
    const bobSpeed = speed > 0.01 ? 15 : 2;
    const bobHeight = speed > 0.01 ? 0.15 : 0.05;
    duckGroup.position.y = 0.1 + Math.sin(elapsedTime * bobSpeed) * bobHeight;
    
    // Waddle tilt
    duckGroup.rotation.z = Math.sin(elapsedTime * bobSpeed) * (speed * 0.5);

    // Update Camera (Follow Duck)
    const idealCameraPos = new THREE.Vector3(
        duckGroup.position.x + cameraOffset.x,
        duckGroup.position.y + cameraOffset.y,
        duckGroup.position.z + cameraOffset.z
    );
    camera.position.lerp(idealCameraPos, 0.1);
    camera.lookAt(duckGroup.position);

    // Move Water Plane to follow camera (creates infinite effect)
    water.position.x = camera.position.x;
    water.position.z = camera.position.z;
    
    // Animate water vertices slightly for ripples (Optimized loop)
    const positions = waterGeo.attributes.position;
    const posArray = positions.array;
    const wx = water.position.x;
    const wz = water.position.z;
    
    for (let i = 0; i < posArray.length; i += 3) {
        const x = posArray[i] + wx;
        const y = posArray[i + 1] + wz;
        // Direct array access is much faster than getX/getY/setZ
        posArray[i + 2] = Math.sin(x * 0.5 + elapsedTime) * 0.2 + Math.cos(y * 0.5 + elapsedTime) * 0.2;
    }
    positions.needsUpdate = true;

    // Infinite Scenery Wrapping
    sceneryObjects.forEach(obj => {
        const dx = obj.position.x - duckGroup.position.x;
        const dz = obj.position.z - duckGroup.position.z;
        const distSq = dx * dx + dz * dz;
        
        // If object is too far, move it ahead of the duck
        if (distSq > SCENERY_RADIUS * SCENERY_RADIUS) {
            // Calculate a new position in front of the duck
            const angle = duckGroup.rotation.y + (Math.random() - 0.5) * Math.PI; // Spawn in a cone ahead
            const spawnDist = SCENERY_RADIUS * 0.9;
            
            obj.position.x = duckGroup.position.x + Math.cos(angle) * spawnDist;
            obj.position.z = duckGroup.position.z - Math.sin(angle) * spawnDist;
            
            // Randomize slightly to avoid obvious patterns
            obj.rotation.y = Math.random() * Math.PI * 2;
        }
    });

    // Coin Animation & Collision
    coin.rotation.z += 0.05;
    coin.position.y = 0.6 + Math.sin(elapsedTime * 4) * 0.15; // Bobbing

    const dxC = coin.position.x - duckGroup.position.x;
    const dzC = coin.position.z - duckGroup.position.z;
    const distSqC = dxC * dxC + dzC * dzC;

    // Collision threshold (approx 1.5 units squared)
    if (distSqC < 2.25) {
        score++;
        document.getElementById('score-value').innerText = score;
        respawnCoin();
    } else if (distSqC > SCENERY_RADIUS * SCENERY_RADIUS) {
        // If the duck missed the coin and swam too far away, respawn it ahead
        respawnCoin();
    }

    renderer.render(scene, camera);
}

animate();

// --- UI Interactions ---
const goTopBtn = document.getElementById('goTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        goTopBtn.classList.add('visible');
    } else {
        goTopBtn.classList.remove('visible');
    }
});

goTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
window.addEventListener('resize', () => {
    if(container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
});

// --- About Section Interactive Toggle ---
const positionToggle = document.getElementById('position-toggle');
const visualContainer = document.getElementById('about-visual-container');

if (positionToggle && visualContainer) {
    positionToggle.addEventListener('click', () => {
        if (positionToggle.innerText === 'Behind') {
            positionToggle.innerText = 'Front';
            visualContainer.classList.add('is-front');
        } else {
            positionToggle.innerText = 'Behind';
            visualContainer.classList.remove('is-front');
        }
    });
}