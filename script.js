/* =========================================================
   SHE WANTS FLOWERS — configuration
   Everything you're likely to want to personalize lives here.
   ========================================================= */
const CONFIG = {
    // Personalization
    HER_NAME: '',                     // e.g. "Maya" — leave '' to use the default finale wording
    INTRO_LINE_1: 'She said she wants flowers…',
    INTRO_LINE_2: 'So I made something for her.',
    BUTTON_TEXT: 'Open Your Garden',
    HINT_TEXT: 'Tap anywhere below to grow a flower',
    FINALE_LINE_1: 'You wanted flowers…',
    FINALE_LINE_2: '…so I made you a whole garden.',
    FINALE_LINE_3: 'For the girl who deserves every flower in the world. ❤️',

    // Music (optional). Point this at a file in assets/, e.g. 'assets/music.mp3'.
    // Leave '' to run with no music at all — the button simply does nothing.
    MUSIC_SRC: 'Ekdev Limbu - Fijeko Kesh.mp3',
    MUSIC_VOLUME: 0.35,

    // Limits (performance safeguards — nothing here grows unbounded)
    MAX_FLOWERS: 25,
    MAX_GRASS: 100,
    MAX_PARTICLES_ON_SCREEN: 90,
    MAX_FIREFLIES: 15,

    // Pacing
    GRASS_GROWTH_INTERVAL: 750,     // ambient re-growth after the initial field is in
    GRASS_FILL_SECONDS: 5,          // the initial field spreads left/right from center within this long
    GRASS_SPACING: 16,              // px between tufts in the initial field (smaller = denser)
    FIREFLY_INTERVAL: 2000,
    ANIMATION_SPEED: 1,                // 1 = normal, <1 = slower, >1 = faster
    PARTICLE_INTENSITY: 1,             // multiplier on particle counts
    PETAL_INTENSITY: 1,                // multiplier on falling-petal frequency
    GRASS_DENSITY: 1,                  // multiplier on how many blades per tuft

    // Story beats, keyed by number of flowers grown
    MILESTONES: {
        FIRST_FLOWER: 1,
        MORE_FIREFLIES: 3,
        MORE_PETALS: 5,
        BRIGHTER_SKY: 7,
        GARDEN_GLOW: 10,
        FINAL_SEQUENCE: 15
    }
};

/* =========================================================
   STATE
   ========================================================= */
const state = {
    flowerCount: 0,
    grassCount: 0,
    fireflyCount: 0,
    liveParticles: 0,
    isPlaying: false,
    gardenOpened: false,
    finaleTriggered: false,
    petalIntervalId: null,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

/* =========================================================
   DOM
   ========================================================= */
const introScene = document.getElementById('introScene');
const introLine1 = document.getElementById('introLine1');
const introLine2 = document.getElementById('introLine2');
const introStars = document.getElementById('introStars');
const introFireflies = document.getElementById('introFireflies');
const openGardenBtn = document.getElementById('openGardenBtn');

const gardenContainer = document.getElementById('gardenContainer');
const scene = document.getElementById('scene');
const grassContainer = document.getElementById('grassContainer');
const flowersContainer = document.getElementById('flowersContainer');
const particlesContainer = document.getElementById('particlesContainer');
const firefliesContainer = document.getElementById('firefliesContainer');
const starsContainer = document.getElementById('stars');
const flowerCounter = document.getElementById('flowerCounter');
const hintText = document.getElementById('hintText');
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');

const finale = document.getElementById('finale');
const finaleHeart = document.getElementById('finaleHeart');
const finaleLine1 = document.getElementById('finaleLine1');
const finaleLine2 = document.getElementById('finaleLine2');
const finaleLine3 = document.getElementById('finaleLine3');

/* =========================================================
   TEXT SETUP
   ========================================================= */
introLine1.textContent = CONFIG.INTRO_LINE_1;
introLine2.textContent = CONFIG.INTRO_LINE_2;
openGardenBtn.querySelector('span').textContent = CONFIG.BUTTON_TEXT;
hintText.textContent = CONFIG.HINT_TEXT;
finaleLine1.textContent = CONFIG.FINALE_LINE_1;
finaleLine2.textContent = CONFIG.FINALE_LINE_2;
finaleLine3.textContent = CONFIG.HER_NAME
    ? CONFIG.FINALE_LINE_3.replace('the girl', CONFIG.HER_NAME)
    : CONFIG.FINALE_LINE_3;
if (CONFIG.MUSIC_SRC) {
    bgMusic.src = CONFIG.MUSIC_SRC;
    bgMusic.volume = CONFIG.MUSIC_VOLUME;
} else {
    musicBtn.style.display = 'none';
}

/* =========================================================
   INTRO SEQUENCE
   ========================================================= */
function initIntro() {
    scatterStars(introStars, 60);
    for (let i = 0; i < 4; i++) {
        setTimeout(() => spawnIntroFirefly(), i * 900);
    }

    setTimeout(() => introLine1.classList.add('reveal'), 300);
    setTimeout(() => introLine2.classList.add('reveal'), 1800);
    setTimeout(() => {
        openGardenBtn.classList.add('reveal');
        setTimeout(() => openGardenBtn.classList.add('pulse'), 1200);
    }, 3200);

    openGardenBtn.addEventListener('click', openGarden, { once: true });
    
    // Auto-start music on first interaction
    if (CONFIG.MUSIC_SRC) {
        const startMusicOnInteraction = () => {
            if (!state.isPlaying) {
                bgMusic.play().then(() => {
                    state.isPlaying = true;
                    musicBtn.textContent = '🔇';
                    musicBtn.setAttribute('aria-pressed', 'true');
                }).catch(() => { /* autoplay blocked */ });
            }
            document.removeEventListener('click', startMusicOnInteraction);
            document.removeEventListener('touchstart', startMusicOnInteraction);
            document.removeEventListener('keydown', startMusicOnInteraction);
        };
        
        document.addEventListener('click', startMusicOnInteraction);
        document.addEventListener('touchstart', startMusicOnInteraction);
        document.addEventListener('keydown', startMusicOnInteraction);
    }
}

function spawnIntroFirefly() {
    const f = document.createElement('div');
    f.className = 'firefly';
    f.style.left = (10 + Math.random() * 80) + '%';
    f.style.top = (20 + Math.random() * 60) + '%';
    f.style.setProperty('--moveX', ((Math.random() - 0.5) * 160) + 'px');
    f.style.setProperty('--moveY', ((Math.random() - 0.5) * 90) + 'px');
    introFireflies.appendChild(f);
    setTimeout(() => f.remove(), 8000);
    if (introScene.classList.contains('hide')) return;
    setTimeout(spawnIntroFirefly, 4000 + Math.random() * 3000);
}

function scatterStars(container, count) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.animationDuration = (2 + Math.random() * 2) + 's';
        frag.appendChild(star);
    }
    container.appendChild(frag);
}

function openGarden() {
    if (state.gardenOpened) return;
    state.gardenOpened = true;

    // Music starts only in response to this user gesture.
    if (CONFIG.MUSIC_SRC) {
        bgMusic.play().then(() => {
            state.isPlaying = true;
            musicBtn.textContent = '🔇';
            musicBtn.setAttribute('aria-pressed', 'true');
        }).catch(() => { /* autoplay blocked — she can still tap the button */ });
    }

    introScene.classList.add('hide');
    gardenContainer.classList.add('active');
    initGarden();

    setTimeout(() => hintText.classList.add('fade'), 6000);
}

/* =========================================================
   GARDEN INIT
   ========================================================= */
function initGarden() {
    scatterStars(starsContainer, 70);
    startGrassGrowth();
    startFireflies();
    scene.addEventListener('pointerdown', handleTap);
    musicBtn.addEventListener('click', toggleMusic);
    updateFlowerCounter();
    if (!state.reducedMotion) startIdleSway();
}

/* =========================================================
   GRASS
   ========================================================= */
function startGrassGrowth() {
    const rect = scene.getBoundingClientRect();
    const centerX = rect.width / 2;

    // Build the full field up front, evenly spread with jitter, then
    // stagger each tuft's sprout by its distance from the middle so
    // the grass visibly races outward left and right and finishes
    // covering the whole width within GRASS_FILL_SECONDS.
    const spacing = CONFIG.GRASS_SPACING;
    const positions = [];
    for (let x = spacing / 2; x < rect.width; x += spacing) {
        positions.push(x + (Math.random() * spacing * 0.6 - spacing * 0.3));
    }
    const targetCount = Math.min(positions.length, CONFIG.MAX_GRASS);
    // Keep the tufts closest to center, so the field still reads as
    // "grown from the middle" even if MAX_GRASS trims the total.
    positions.sort((a, b) => Math.abs(a - centerX) - Math.abs(b - centerX));
    const field = positions.slice(0, targetCount);

    const maxDist = Math.max(1, centerX, rect.width - centerX);
    const fillMs = CONFIG.GRASS_FILL_SECONDS * 1000 / CONFIG.ANIMATION_SPEED;

    field.forEach(x => {
        const delay = (Math.abs(x - centerX) / maxDist) * fillMs * 0.85 + Math.random() * 120;
        setTimeout(() => createGrass(x), delay);
    });

    // After the initial field is in, keep a slow ambient trickle going
    // so the garden still feels alive (replacing/adding a blade now
    // and then), capped at MAX_GRASS.
    setTimeout(() => {
        const tick = () => {
            if (state.grassCount < CONFIG.MAX_GRASS) createGrass();
            setTimeout(tick, CONFIG.GRASS_GROWTH_INTERVAL / CONFIG.ANIMATION_SPEED);
        };
        tick();
    }, fillMs + 400);
}

function createGrass(fixedX) {
    const grass = document.createElement('div');
    grass.className = 'grass sprout';

    const rect = scene.getBoundingClientRect();
    const x = fixedX !== undefined ? fixedX : Math.random() * rect.width;
    grass.style.left = x + 'px';

    const bladeCount = Math.max(2, Math.round((3 + Math.floor(Math.random() * 4)) * CONFIG.GRASS_DENSITY));
    const baseHeight = 35 + Math.random() * 55;

    const frag = document.createDocumentFragment();
    for (let i = 0; i < bladeCount; i++) {
        const blade = document.createElement('div');
        blade.className = 'grass-blade';

        const height = baseHeight + (Math.random() * 30 - 15);
        const width = 1.5 + Math.random() * 5;
        const rotation = (Math.random() * 30 - 15);

        blade.style.height = height + 'px';
        blade.style.width = width + 'px';
        blade.style.left = (i * 4 - (bladeCount * 2)) + 'px';
        blade.style.transform = `rotate(${rotation}deg)`;
        blade.style.animationDelay = (Math.random() * 0.5) + 's';

        frag.appendChild(blade);
    }
    grass.appendChild(frag);
    grassContainer.appendChild(grass);
    state.grassCount++;

    if (state.grassCount > CONFIG.MAX_GRASS) {
        const oldest = grassContainer.querySelector('.grass');
        if (oldest) { oldest.remove(); state.grassCount--; }
    }
}

function reactNearbyGrass(x) {
    grassContainer.querySelectorAll('.grass').forEach(grass => {
        const gx = parseFloat(grass.style.left);
        if (Math.abs(gx - x) < 100) {
            grass.classList.add('wave');
            setTimeout(() => grass.classList.remove('wave'), 500);
        }
    });
}

/* =========================================================
   TAP → FLOWER
   ========================================================= */
function handleTap(event) {
    if (event.target.closest('.ui-controls')) return;

    const rect = scene.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Keep taps to the lower ~75% of the scene, so flowers always
    // read as growing up out of the grass rather than out of the sky.
    if (y < rect.height * 0.22) return;

    hintText.classList.add('fade');

    if (state.flowerCount < CONFIG.MAX_FLOWERS) {
        createFlowerAt(x, y, rect.height);
    } else {
        createTemporaryMagicEffect(x, y);
    }
}

function createFlowerAt(x, y, sceneHeight) {
    createMagicRing(x, y);
    createParticleBurst(x, y);
    reactNearbyGrass(x);

    setTimeout(() => growFlower(x, y, sceneHeight), 300 / CONFIG.ANIMATION_SPEED);
}

function createMagicRing(x, y) {
    const ring = document.createElement('div');
    ring.className = 'magic-ring';
    ring.style.left = (x - 15) + 'px';
    ring.style.top = (y - 15) + 'px';
    ring.style.width = '30px';
    ring.style.height = '30px';
    particlesContainer.appendChild(ring);
    setTimeout(() => ring.remove(), 1000);
}

function spendParticleBudget(n) {
    // Never let the DOM accumulate unlimited live particles.
    const room = CONFIG.MAX_PARTICLES_ON_SCREEN - state.liveParticles;
    return Math.max(0, Math.min(n, room));
}

function createParticleBurst(x, y) {
    const requested = Math.round((8 + Math.floor(Math.random() * 8)) * CONFIG.PARTICLE_INTENSITY);
    const count = spendParticleBudget(requested);

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = 3 + Math.random() * 5;
        const angle = (Math.PI * 2 * i) / count;
        const distance = 30 + Math.random() * 30;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = `hsl(${40 + Math.random() * 20}, 100%, 70%)`;

        particlesContainer.appendChild(particle);
        state.liveParticles++;

        const anim = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${endX}px, ${endY}px) scale(0)`, opacity: 0 }
        ], { duration: 800 / CONFIG.ANIMATION_SPEED, easing: 'ease-out' });

        anim.onfinish = () => { particle.remove(); state.liveParticles--; };
    }
}

function growFlower(x, y, sceneHeight) {
    const type = getRandomFlowerType();
    const stemTarget = Math.max(30, sceneHeight - y); // reach from the ground up to the tap point
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.style.left = x + 'px';
    flower.dataset.type = type;
    flowersContainer.appendChild(flower);

    growStem(flower, type, stemTarget);

    state.flowerCount++;
    updateFlowerCounter();
    checkStoryProgression();
    createTapGlow(x, y);
}

function getRandomFlowerType() {
    const types = ['rose', 'tulip', 'cherryBlossom', 'daisy', 'hibiscus', 'fantasy'];
    return types[Math.floor(Math.random() * types.length)];
}

function growStem(flower, type, stemHeight) {
    const stem = document.createElement('div');
    stem.className = 'flower-stem';
    const stemWidth = 3 + Math.random() * 2;
    stem.style.height = '0px';
    stem.style.width = stemWidth + 'px';
    flower.appendChild(stem);

    const dur = 800 / CONFIG.ANIMATION_SPEED;
    stem.animate([{ height: '0px' }, { height: stemHeight + 'px' }], {
        duration: dur, easing: 'ease-out', fill: 'forwards'
    });

    setTimeout(() => addLeaves(flower, stemHeight), dur * 0.5);
    setTimeout(() => addFlowerBud(flower, type, stemHeight), dur * 1.25);
}

function addLeaves(flower, stemHeight) {
    const leafCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'flower-leaf';
        const leafSize = 15 + Math.random() * 10;
        const leafY = stemHeight * (0.3 + (i * 0.3));
        const side = i % 2 === 0 ? -1 : 1;

        leaf.style.width = leafSize + 'px';
        leaf.style.height = leafSize + 'px';
        leaf.style.left = '50%';
        leaf.style.bottom = leafY + 'px';
        leaf.style.transform = `translateX(-50%) rotate(${side * 45}deg) scale(0)`;
        flower.appendChild(leaf);

        leaf.animate([
            { transform: `translateX(-50%) rotate(${side * 45}deg) scale(0)` },
            { transform: `translateX(-50%) rotate(${side * 45}deg) scale(1)` }
        ], { duration: 500 / CONFIG.ANIMATION_SPEED, easing: 'ease-out', fill: 'forwards' });
    }
}

function addFlowerBud(flower, type, stemHeight) {
    const bud = document.createElement('div');
    bud.className = 'flower-bud';
    const budSize = 22 + Math.random() * 10;
    bud.style.width = budSize + 'px';
    bud.style.height = budSize + 'px';
    // Only `bottom` is set (no `top`) so it sits at the top of the
    // stem instead of the two properties fighting each other.
    bud.style.bottom = stemHeight + 'px';
    bud.style.transform = 'translateX(-50%) scale(0)';
    flower.appendChild(bud);

    bud.animate([
        { transform: 'translateX(-50%) scale(0)' },
        { transform: 'translateX(-50%) scale(1)' }
    ], { duration: 400 / CONFIG.ANIMATION_SPEED, easing: 'ease-out', fill: 'forwards' });

    addSepals(flower, stemHeight, budSize);
    setTimeout(() => bloomFlower(bud, type), 500 / CONFIG.ANIMATION_SPEED);
}

function addSepals(flower, stemHeight, budSize) {
    const count = 3;
    for (let i = 0; i < count; i++) {
        const sepal = document.createElement('div');
        sepal.className = 'flower-sepal';
        const size = budSize * 0.55;
        const rot = -50 + i * 50;
        sepal.style.width = size + 'px';
        sepal.style.height = size + 'px';
        sepal.style.bottom = (stemHeight - size * 0.35) + 'px';
        sepal.style.setProperty('--sepal-rot', rot + 'deg');
        sepal.style.animationDelay = (i * 60) + 'ms';
        flower.appendChild(sepal);
    }
}

function bloomFlower(bud, type) {
    const petalCount = getPetalCount(type);
    const petalLength = 22 + Math.random() * 14;
    const petalWidth = petalLength * (0.55 + Math.random() * 0.15);

    // Two layers for fuller-looking flowers (rose/hibiscus/fantasy):
    // an outer ring of larger petals, then a slightly smaller inner
    // ring rotated halfway between them.
    const layers = (type === 'rose' || type === 'hibiscus' || type === 'fantasy') ? 2 : 1;

    for (let layer = 0; layer < layers; layer++) {
        const count = layer === 0 ? petalCount : Math.max(3, Math.round(petalCount * 0.7));
        const sizeScale = layer === 0 ? 1 : 0.68;
        const offset = layer === 0 ? 0 : (360 / count) / 2;
        const baseDelay = layer === 0 ? 0 : petalCount * 45 + 120;

        for (let i = 0; i < count; i++) {
            const petal = document.createElement('div');
            petal.className = 'flower-petal';
            const angle = (360 / count) * i + offset;

            petal.style.width = (petalWidth * sizeScale) + 'px';
            petal.style.height = (petalLength * sizeScale) + 'px';
            petal.style.background = getPetalColor(type, layer);
            petal.style.setProperty('--rotation', angle + 'deg');
            petal.style.borderRadius = getPetalShape(type);
            bud.appendChild(petal);

            setTimeout(() => petal.classList.add('bloom'),
                (baseDelay + i * 45) / CONFIG.ANIMATION_SPEED);
        }
    }

    const totalPetals = layers === 2 ? petalCount + Math.max(3, Math.round(petalCount * 0.7)) : petalCount;
    setTimeout(() => addFlowerCenter(bud, type), (totalPetals * 45 + 250) / CONFIG.ANIMATION_SPEED);
    setTimeout(() => addFlowerGlow(bud), (totalPetals * 45 + 550) / CONFIG.ANIMATION_SPEED);
}

function getPetalCount(type) {
    return { rose: 8, tulip: 6, cherryBlossom: 5, daisy: 12, hibiscus: 5, fantasy: 7 }[type] || 6;
}

function getPetalColor(type, layer = 0) {
    // A light core fading to a deeper edge tone gives each petal a
    // soft glowing, dimensional look instead of a flat color chip.
    const hues = {
        rose: [350 + Math.random() * 20, 85, [92, 45]],
        tulip: [Math.random() * 30, 92, [88, 42]],
        cherryBlossom: [340 + Math.random() * 20, 65, [97, 78]],
        daisy: [50 + Math.random() * 10, 85, [99, 90]],
        hibiscus: [330 + Math.random() * 30, 82, [95, 48]],
        fantasy: [Math.random() * 360, 75, [95, 55]]
    };
    const [h, s, [lCore, lEdge]] = hues[type] || [330, 70, [95, 55]];
    const edgeShift = layer === 1 ? -8 : 0;
    return `radial-gradient(circle at 50% 85%, hsl(${h}, ${s}%, ${lCore}%) 0%, ` +
        `hsl(${h}, ${s}%, ${lEdge + edgeShift}%) 100%)`;
}

function getPetalShape(type) {
    const shapes = {
        rose: '50% 50% 50% 50% / 50% 50% 50% 50%',
        tulip: '50% 50% 0 50% / 50% 50% 50% 50%',
        cherryBlossom: '50% 50% 50% 50% / 50% 50% 50% 50%',
        daisy: '50% 50% 50% 50% / 50% 50% 50% 50%',
        hibiscus: '50% 0 50% 50% / 50% 50% 50% 50%',
        fantasy: '30% 70% 70% 30% / 30% 30% 70% 70%'
    };
    return shapes[type] || '50%';
}

function addFlowerCenter(bud, type) {
    const center = document.createElement('div');
    center.className = 'flower-center';
    const size = 8 + Math.random() * 6;
    center.style.width = size + 'px';
    center.style.height = size + 'px';
    center.style.background = { rose: '#8B4513', tulip: '#000', cherryBlossom: '#FFB6C1',
        daisy: '#8B4513', hibiscus: '#FF1493', fantasy: '#FFD700' }[type] || '#FFD700';
    bud.appendChild(center);
}

function addFlowerGlow(bud) {
    const glow = document.createElement('div');
    glow.className = 'flower-glow-pulse';
    glow.style.cssText += `position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
        width:160%; height:160%; background:radial-gradient(circle, rgba(255,255,200,0.32), transparent);
        border-radius:50%; pointer-events:none;`;
    bud.appendChild(glow);
    createFlowerParticles(bud);
}

function createFlowerParticles(bud) {
    const count = spendParticleBudget(3 + Math.floor(Math.random() * 3));
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = 2 + Math.random() * 3;
        const startX = Math.random() * 40 - 20;
        const startY = Math.random() * 40 - 20;

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.background = `hsl(${40 + Math.random() * 20}, 100%, 80%)`;
        particle.style.transform = `translate(${startX}px, ${startY}px)`;
        bud.appendChild(particle);
        state.liveParticles++;

        const anim = particle.animate([
            { transform: `translate(${startX}px, ${startY}px)`, opacity: 0.8 },
            { transform: `translate(${startX + (Math.random() * 20 - 10)}px, ${startY - 20}px)`, opacity: 0 }
        ], { duration: (2000 + Math.random() * 1000) / CONFIG.ANIMATION_SPEED, easing: 'ease-out' });

        anim.onfinish = () => { particle.remove(); state.liveParticles--; };
    }
}

function createTapGlow(x, y) {
    const glow = document.createElement('div');
    glow.className = 'tap-glow';
    glow.style.left = (x - 30) + 'px';
    glow.style.top = (y - 30) + 'px';
    glow.style.width = '60px';
    glow.style.height = '60px';
    particlesContainer.appendChild(glow);

    setTimeout(() => {
        const anim = glow.animate([{ opacity: 0.5 }, { opacity: 0 }], { duration: 1000, fill: 'forwards' });
        anim.onfinish = () => glow.remove();
    }, 3000);
}

function createTemporaryMagicEffect(x, y) {
    createMagicRing(x, y);
    createParticleBurst(x, y);

    const glow = document.createElement('div');
    glow.className = 'tap-glow';
    glow.style.left = (x - 40) + 'px';
    glow.style.top = (y - 40) + 'px';
    glow.style.width = '80px';
    glow.style.height = '80px';
    particlesContainer.appendChild(glow);

    const anim = glow.animate([
        { opacity: 0.8, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.5)' }
    ], { duration: 1500, fill: 'forwards' });
    anim.onfinish = () => glow.remove();
}

/* =========================================================
   FIREFLIES
   ========================================================= */
function startFireflies() {
    setInterval(() => {
        if (state.fireflyCount < CONFIG.MAX_FIREFLIES) createFirefly();
    }, CONFIG.FIREFLY_INTERVAL);
}

function createFirefly() {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';
    const rect = scene.getBoundingClientRect();
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height * 0.85;
    const moveX = (Math.random() - 0.5) * 200;
    const moveY = (Math.random() - 0.5) * 100;

    firefly.style.left = x + 'px';
    firefly.style.top = y + 'px';
    firefly.style.setProperty('--moveX', moveX + 'px');
    firefly.style.setProperty('--moveY', moveY + 'px');
    firefly.style.animationDelay = Math.random() * 2 + 's';

    firefliesContainer.appendChild(firefly);
    state.fireflyCount++;
    setTimeout(() => { firefly.remove(); state.fireflyCount--; }, 8000);
}

/* =========================================================
   STORY PROGRESSION
   ========================================================= */
function checkStoryProgression() {
    const count = state.flowerCount;
    const M = CONFIG.MILESTONES;

    if (count === M.FIRST_FLOWER) celebrateBurst(12);
    else if (count === M.MORE_FIREFLIES) boostFireflies();
    else if (count === M.MORE_PETALS) startFallingPetals();
    else if (count === M.BRIGHTER_SKY) brightenSky();
    else if (count === M.GARDEN_GLOW) gardenGlow();
    else if (count === M.FINAL_SEQUENCE && !state.finaleTriggered) {
        state.finaleTriggered = true;
        triggerFinalSequence();
    }
}

function celebrateBurst(n) {
    const rect = scene.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
        setTimeout(() => {
            createParticleBurst(Math.random() * rect.width, Math.random() * rect.height * 0.6 + rect.height * 0.3);
        }, i * 90);
    }
}

function boostFireflies() {
    const boosted = setInterval(() => {
        if (state.fireflyCount < CONFIG.MAX_FIREFLIES + 5) createFirefly();
    }, 500);
    setTimeout(() => clearInterval(boosted), 5000);
}

function startFallingPetals() {
    if (state.petalIntervalId) return;
    const interval = Math.max(600, 3000 / CONFIG.PETAL_INTENSITY);
    state.petalIntervalId = setInterval(createFallingPetal, interval);
}

function createFallingPetal() {
    if (spendParticleBudget(1) < 1) return;
    const petal = document.createElement('div');
    petal.className = 'particle';
    const rect = scene.getBoundingClientRect();
    const x = Math.random() * rect.width;

    petal.style.width = (8 + Math.random() * 6) + 'px';
    petal.style.height = (8 + Math.random() * 6) + 'px';
    petal.style.left = x + 'px';
    petal.style.top = '-20px';
    petal.style.background = `hsl(${340 + Math.random() * 40}, 70%, 80%)`;
    petal.style.borderRadius = '50%';
    particlesContainer.appendChild(petal);
    state.liveParticles++;

    const duration = (4000 + Math.random() * 2000) / CONFIG.ANIMATION_SPEED;
    const anim = petal.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${(Math.random() - 0.5) * 100}px, ${rect.height + 50}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
    ], { duration, easing: 'linear' });
    anim.onfinish = () => { petal.remove(); state.liveParticles--; };
}

function brightenSky() {
    document.querySelector('.sky').classList.add('magical');
}

function gardenGlow() {
    const glow = document.createElement('div');
    glow.style.cssText = `position:absolute; inset:0; pointer-events:none;
        background: radial-gradient(circle at center, rgba(255,200,100,0.1), transparent);
        animation: tapGlowPulse 4s ease-in-out infinite;`;
    gardenContainer.appendChild(glow);
}

/* =========================================================
   FINALE — flowers gather into a bouquet, a heart forms and
   breaks, and the three closing lines appear one by one.
   ========================================================= */
function triggerFinalSequence() {
    if (state.petalIntervalId) { clearInterval(state.petalIntervalId); state.petalIntervalId = null; }

    const rect = scene.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height * 0.55;

    const flowers = Array.from(flowersContainer.querySelectorAll('.flower'));
    flowers.forEach((flower, i) => {
        const fx = parseFloat(flower.style.left) || 0;
        const dx = centerX - fx;
        const dy = -(rect.height - centerY); // move upward toward the gather point
        setTimeout(() => {
            flower.style.transition = 'transform 1.6s cubic-bezier(.2,.7,.3,1), opacity 1.8s ease 0.6s';
            flower.style.transform = `translate(${dx}px, ${dy}px) scale(0.75) rotate(${(Math.random() - 0.5) * 20}deg)`;
            setTimeout(() => { flower.style.opacity = '0'; }, 1200);
        }, i * 60);
    });

    setTimeout(() => {
        finale.classList.add('show');
        finaleHeart.classList.add('show');

        setTimeout(() => finaleHeart.classList.add('pulse'), 600);
        setTimeout(() => {
            finaleHeart.classList.remove('pulse');
            finaleHeart.classList.add('break');
        }, 3200);

        setTimeout(() => finaleLine1.classList.add('reveal'), 800);
        setTimeout(() => finaleLine2.classList.add('reveal'), 2400);
        setTimeout(() => finaleLine3.classList.add('reveal'), 4200);

        celebrateBurst(state.reducedMotion ? 6 : 24);
    }, flowers.length * 60 + 1400);
}

/* =========================================================
   UI
   ========================================================= */
function updateFlowerCounter() {
    flowerCounter.textContent = `${state.flowerCount} flower${state.flowerCount === 1 ? '' : 's'}`;
}

function toggleMusic() {
    if (!CONFIG.MUSIC_SRC) return;
    if (state.isPlaying) {
        bgMusic.pause();
        state.isPlaying = false;
    } else {
        bgMusic.play().catch(() => {});
        state.isPlaying = true;
    }
    musicBtn.textContent = state.isPlaying ? '🔇' : '🎵';
    musicBtn.setAttribute('aria-pressed', String(state.isPlaying));
}

// Also try to autoplay music when page loads (may be blocked by browsers)
function attemptAutoplay() {
    if (CONFIG.MUSIC_SRC && !state.isPlaying) {
        bgMusic.play().then(() => {
            state.isPlaying = true;
            musicBtn.textContent = '🔇';
            musicBtn.setAttribute('aria-pressed', 'true');
        }).catch(() => {
            // Autoplay blocked - will start on first interaction
            console.log('Autoplay blocked - music will start on first interaction');
        });
    }
}

function startIdleSway() {
    let last = 0;
    function frame(t) {
        if (t - last > 50) {
            last = t;
            const sway = Math.sin(t / 1000) * 2;
            flowersContainer.querySelectorAll('.flower').forEach(f => {
                if (!f.style.transition) f.style.transform = `rotate(${sway}deg)`;
            });
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

/* =========================================================
   BOOT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    attemptAutoplay();
});
