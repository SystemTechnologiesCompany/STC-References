import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const collections = {
  maps: [
    ['vintage_globe.glb', 'modelVintageGlobe', 'modelVintageBlurb'],
    ['simplistic_globe.glb', 'modelModernGlobe', 'modelSimpleBlurb'],
    ['old_world_map.glb', 'modelAtlas', 'modelAtlasBlurb'],
    ['scroll_map.glb', 'modelScroll', 'modelScrollBlurb'],
    ['map.glb', 'modelWorldMap', 'modelMapBlurb']
  ],
  research: [
    ['magnifying_glass.glb', 'modelMagnifier', 'modelMagnifierBlurb'],
    ['detective_board.glb', 'modelBoard', 'modelBoardBlurb'],
    ['gaming_laptop.glb', 'modelLaptop', 'modelLaptopBlurb'],
    ['map_pointer_3d_icon.glb', 'modelPointer', 'modelPointerBlurb']
  ],
  library: [
    ['bibliotheque_antique__antique_library.glb', 'modelLibraryRoom', 'modelLibraryBlurb'],
    ['table_from_a_gothic_library.glb', 'modelDesk', 'modelTableBlurb'],
    ['book_cabinet_vintage.glb', 'modelCabinet', 'modelCabinetBlurb'],
    ['medieval_book_stack.glb', 'modelBooks', 'modelStackBlurb'],
    ['book_red.glb', 'modelClassic', 'modelRedBookBlurb']
  ]
};

const copy = {
  en: {
    modelVintageGlobe: 'A vintage globe', modelVintageBlurb: 'A well-travelled view of the world, ready for a new question.',
    modelModernGlobe: 'Global studies globe', modelSimpleBlurb: 'A clean view of places, patterns, and possibilities.',
    modelAtlas: 'An antique atlas', modelAtlasBlurb: 'An old atlas for tracing big ideas back to their source.',
    modelScroll: 'A cartographer’s scroll', modelScrollBlurb: 'A cartographer’s scroll with room for new discoveries.',
    modelWorldMap: 'World maps', modelMapBlurb: 'A world map that invites the next line of inquiry.',
    modelPointer: 'Mark a destination', modelPointerBlurb: 'Mark a place and follow the thread of a new idea.',
    modelMagnifier: 'Look closer', modelMagnifierBlurb: 'Bring the details of a question into focus.',
    modelBoard: 'Connect the clues', modelBoardBlurb: 'Gather the clues, connect the dots, and find your way through.',
    modelLaptop: 'Digital study desk', modelLaptopBlurb: 'A digital workspace for the next generation of research.',
    modelLibraryRoom: 'The old-world library', modelLibraryBlurb: 'A quiet hall of knowledge, built for long afternoons of discovery.',
    modelDesk: 'A scholar’s reading table', modelTableBlurb: 'A scholar’s desk, set for patient work and bright ideas.',
    modelCabinet: 'The reference cabinet', modelCabinetBlurb: 'A handsome home for the references worth keeping.',
    modelBooks: 'Books & archives', modelStackBlurb: 'Well-worn volumes, waiting to be opened.',
    modelClassic: 'A classic volume', modelRedBookBlurb: 'One striking volume. A thousand possible beginnings.',
    modelLoading: 'Preparing the collection', modelProgress: 'Loading object', modelError: 'This object could not be loaded. Choose another to continue.'
  },
  fr: {
    modelVintageGlobe: 'Globe ancien', modelVintageBlurb: 'Une vision du monde façonnée par les voyages, prête pour une nouvelle question.',
    modelModernGlobe: 'Globe des études mondiales', modelSimpleBlurb: 'Une vision épurée des lieux, des motifs et des possibles.',
    modelAtlas: 'Atlas ancien', modelAtlasBlurb: 'Un atlas ancien pour remonter aux sources des grandes idées.',
    modelScroll: 'Carte de cartographe', modelScrollBlurb: 'Un rouleau de cartographe ouvert aux nouvelles découvertes.',
    modelWorldMap: 'Cartes du monde', modelMapBlurb: 'Une carte du monde qui invite à poursuivre l’exploration.',
    modelPointer: 'Marquer une destination', modelPointerBlurb: 'Marquez un lieu et suivez le fil d’une nouvelle idée.',
    modelMagnifier: 'Regarder de plus près', modelMagnifierBlurb: 'Mettez les détails de votre question au point.',
    modelBoard: 'Relier les indices', modelBoardBlurb: 'Rassemblez les indices et reliez les idées.',
    modelLaptop: 'Bureau d’étude numérique', modelLaptopBlurb: 'Un espace numérique pour la recherche d’aujourd’hui.',
    modelLibraryRoom: 'Bibliothèque ancienne', modelLibraryBlurb: 'Une bibliothèque paisible, faite pour découvrir et apprendre.',
    modelDesk: 'Table de lecture du chercheur', modelTableBlurb: 'Une table de chercheur pour le travail patient et les idées neuves.',
    modelCabinet: 'L’armoire de référence', modelCabinetBlurb: 'Un bel écrin pour les références à conserver.',
    modelBooks: 'Livres et archives', modelStackBlurb: 'Des ouvrages patinés, prêts à être ouverts.',
    modelClassic: 'Un classique', modelRedBookBlurb: 'Un livre remarquable. Mille débuts possibles.',
    modelLoading: 'Préparation de la collection', modelProgress: 'Chargement de l’objet', modelError: 'Cet objet n’a pas pu être chargé. Choisissez-en un autre.'
  }
};

const stage = document.querySelector('#worldStage');
const canvas = document.querySelector('#worldCanvas');
const loading = document.querySelector('#worldLoading');
const title = document.querySelector('#worldModelName');
const blurb = document.querySelector('#worldModelBlurb');
const indexLabel = document.querySelector('#worldModelIndex');
const objectNumber = document.querySelector('#worldObjectNumber');
const progress = document.querySelector('#worldProgress');
const loader = new GLTFLoader();

let groupName = 'maps';
let modelIndex = 0;
let currentModel = null;
let activeModelKey = '';
let requestId = 0;
let visible = false;
let frame = 0;
let renderer;
let scene;
let camera;
let pivot;
let pointerYaw = 0;
let pointerPitch = 0;
let manualYaw = 0;
let manualPitch = 0;
let dragging = false;
let lastPointer = { x: 0, y: 0 };
let startTime = 0;
let previousTime = 0;

function currentItem() {
  return collections[groupName][modelIndex];
}

function refreshCopy() {
  const item = currentItem();
  const language = document.documentElement.lang === 'fr' ? 'fr' : 'en';
  title.textContent = copy[language][item[1]];
  blurb.textContent = copy[language][item[2]];
  const number = String(modelIndex + 1).padStart(2, '0');
  indexLabel.textContent = `${number} / ${String(collections[groupName].length).padStart(2, '0')}`;
  objectNumber.textContent = number;
  progress.style.width = `${((modelIndex + 1) / collections[groupName].length) * 100}%`;
  loading.querySelector('span').textContent = copy[language].modelLoading;
}

function disposeModel(gltf) {
  if (!gltf?.scene) return;
  gltf.scene.traverse((object) => {
    object.geometry?.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.filter(Boolean).forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value?.isTexture) value.dispose();
      });
      material.dispose();
    });
  });
}

function tintModel(gltf, palette) {
  const tint = new THREE.Color(palette.tint);
  const accent = new THREE.Color(palette.accent);
  gltf.scene.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = false;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    object.material = materials.map((source) => {
      const material = source.clone();
      if (material.color) material.color.lerp(tint, material.map ? 0.3 : 0.52);
      if (material.emissive) {
        material.emissive.lerp(accent, 0.18);
        material.emissiveIntensity = Math.max(material.emissiveIntensity || 0, 0.045);
      }
      if ('roughness' in material) material.roughness = Math.min(0.82, Math.max(0.24, material.roughness));
      return material;
    });
  });
}

function initializeRenderer() {
  if (renderer) return true;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setClearColor(0x000000, 0);
    scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffeee2, 0x32101e, 2.1));
    const key = new THREE.DirectionalLight(0xffe9d5, 4.2);
    key.position.set(-4, 6, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xb87176, 2.0);
    fill.position.set(5, 1, -3);
    scene.add(fill);
    const rim = new THREE.PointLight(0xe6c6a3, 3.1, 12);
    rim.position.set(2, 3, 4);
    scene.add(rim);
    camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
    pivot = new THREE.Group();
    scene.add(pivot);
    return true;
  } catch (error) {
    stage.classList.add('load-error');
    loading.querySelector('span').textContent = copy[document.documentElement.lang === 'fr' ? 'fr' : 'en'].modelError;
    return false;
  }
}

function mountModel(gltf, item) {
  if (currentModel) {
    pivot.remove(currentModel.scene);
    disposeModel(currentModel);
  }
  const box = new THREE.Box3().setFromObject(gltf.scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const largest = Math.max(size.x, size.y, size.z, 0.001);
  const targetSize = item[3]?.scale || 3.3;
  const scale = targetSize / largest;
  gltf.scene.position.sub(center);
  gltf.scene.scale.setScalar(scale);
  tintModel(gltf, item[3]?.palette || palettes[groupName]);
  pivot.add(gltf.scene);
  currentModel = gltf;

  const fittedHeight = Math.max(size.y, largest * 0.72) * scale;
  const distance = fittedHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.15;
  camera.position.set(0, fittedHeight * 0.12, Math.max(3.1, distance));
  camera.lookAt(0, 0, 0);
  stage.classList.remove('is-loading', 'load-error');
  stage.classList.add('has-model');
  stage.classList.add('object-arrive');
  requestAnimationFrame(() => stage.classList.remove('object-arrive'));
}

const palettes = {
  maps: { tint: '#d8b49d', accent: '#7f1736' },
  research: { tint: '#c98587', accent: '#651329' },
  library: { tint: '#ead9c4', accent: '#7b263e' }
};

function loadCurrentModel() {
  if (!visible || !initializeRenderer()) return;
  const item = currentItem();
  const modelKey = `${groupName}:${item[0]}`;
  if (activeModelKey === modelKey) return;
  activeModelKey = modelKey;
  const request = ++requestId;
  stage.classList.add('is-loading');
  loading.classList.add('visible');
  const modelUrl = new URL(`models-web/${item[0]}`, import.meta.url).href;
  loader.load(modelUrl, (gltf) => {
    if (request !== requestId || !visible) {
      disposeModel(gltf);
      return;
    }
    mountModel(gltf, item);
    loading.classList.remove('visible');
  }, (event) => {
    if (request !== requestId || !event.lengthComputable || !event.total) return;
    const language = document.documentElement.lang === 'fr' ? 'fr' : 'en';
    const percent = Math.round((event.loaded / event.total) * 100);
    loading.querySelector('span').textContent = `${copy[language].modelProgress} · ${percent}%`;
  }, () => {
    if (request !== requestId) return;
    activeModelKey = '';
    stage.classList.add('load-error');
    loading.querySelector('span').textContent = copy[document.documentElement.lang === 'fr' ? 'fr' : 'en'].modelError;
    loading.classList.add('visible');
  });
}

function selectItem(index) {
  const items = collections[groupName];
  modelIndex = (index + items.length) % items.length;
  refreshCopy();
  loadCurrentModel();
}

function selectGroup(nextGroup) {
  if (!collections[nextGroup]) return;
  groupName = nextGroup;
  stage.dataset.group = nextGroup;
  modelIndex = 0;
  document.querySelectorAll('[data-world-group]').forEach((button) => {
    const selected = button.dataset.worldGroup === nextGroup;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  refreshCopy();
  loadCurrentModel();
}

function animate(now) {
  if (!visible || document.hidden || !renderer) {
    frame = 0;
    return;
  }
  frame = requestAnimationFrame(animate);
  const width = Math.max(1, stage.clientWidth);
  const height = Math.max(1, stage.clientHeight);
  if (canvas.width !== Math.round(width * renderer.getPixelRatio()) || canvas.height !== Math.round(height * renderer.getPixelRatio())) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  const elapsed = (now - startTime) / 1000;
  const delta = Math.min((now - previousTime) / 1000, 0.05);
  previousTime = now;
  const autoTurn = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : elapsed * 0.12;
  pivot.rotation.y += (autoTurn + pointerYaw - pivot.rotation.y) * Math.min(1, delta * 3.5);
  pivot.rotation.x += (pointerPitch - pivot.rotation.x) * Math.min(1, delta * 3.5);
  renderer.render(scene, camera);
}

const worldSection = document.querySelector('.reference-world');
const worldStage = document.querySelector('#worldStage');
const previousButton = document.querySelector('#worldPrevious');
const nextButton = document.querySelector('#worldNext');

document.querySelectorAll('[data-world-group]').forEach((button) => {
  button.addEventListener('click', () => selectGroup(button.dataset.worldGroup));
});
previousButton.addEventListener('click', () => selectItem(modelIndex - 1));
nextButton.addEventListener('click', () => selectItem(modelIndex + 1));

worldStage.addEventListener('pointermove', (event) => {
  const bounds = worldStage.getBoundingClientRect();
  if (dragging) {
    pointerYaw += event.movementX * 0.009;
    pointerPitch = THREE.MathUtils.clamp(pointerPitch + event.movementY * 0.006, -0.38, 0.38);
  } else {
    pointerYaw = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.42;
    pointerPitch = (0.5 - (event.clientY - bounds.top) / bounds.height) * 0.25;
  }
});
worldStage.addEventListener('pointerdown', (event) => {
  dragging = true;
  lastPointer = { x: event.clientX, y: event.clientY };
  worldStage.setPointerCapture(event.pointerId);
  worldStage.classList.add('is-dragging');
});
worldStage.addEventListener('pointerup', (event) => {
  dragging = false;
  worldStage.classList.remove('is-dragging');
  if (worldStage.hasPointerCapture(event.pointerId)) worldStage.releasePointerCapture(event.pointerId);
});
worldStage.addEventListener('pointercancel', () => {
  dragging = false;
  worldStage.classList.remove('is-dragging');
});
worldStage.addEventListener('pointerleave', () => {
  if (!dragging) {
    pointerYaw = 0;
    pointerPitch = 0;
  }
});
worldStage.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    pointerYaw += event.key === 'ArrowRight' ? 0.28 : -0.28;
  }
});

document.addEventListener('stc:language', refreshCopy);
refreshCopy();

const worldObserver = new IntersectionObserver((entries) => {
  const entry = entries[0];
  visible = entry.isIntersecting;
  if (visible) {
    if (!startTime) startTime = performance.now();
    loadCurrentModel();
    if (!frame) {
      previousTime = performance.now();
      frame = requestAnimationFrame(animate);
    }
  } else if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}, { rootMargin: '180px 0px', threshold: 0.02 });
worldObserver.observe(worldSection);

document.addEventListener('visibilitychange', () => {
  if (document.hidden && frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  } else if (!document.hidden && visible && !frame) {
    previousTime = performance.now();
    frame = requestAnimationFrame(animate);
  }
});
