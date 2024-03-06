import * as THREE from "three";
import * as ZapparThree from "@zappar/zappar-threejs";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { getUserLocation } from "./location-tracking";
import { initializeMap } from "./mapbox";
const model = new URL("../assets/waving.glb", import.meta.url).href;
import "./index.css";

if (ZapparThree.browserIncompatible()) {
  ZapparThree.browserIncompatibleUI();
  throw new Error("Unsupported browser");
}

const manager = new ZapparThree.LoadingManager();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const camera = new ZapparThree.Camera();

ZapparThree.permissionRequestUI().then((granted) => {
  if (granted) camera.start();
  else ZapparThree.permissionDeniedUI();
});

ZapparThree.glContextSet(renderer.getContext());
scene.background = camera.backgroundTexture;

const instantTracker = new ZapparThree.InstantWorldTracker();
const instantTrackerGroup = new ZapparThree.InstantWorldAnchorGroup(
  camera,
  instantTracker
);

scene.add(instantTrackerGroup);

const gltfLoader = new GLTFLoader(manager);

gltfLoader.load(
  model,
  (gltf) => {
    instantTrackerGroup.add(gltf.scene);
  },
  undefined,
  () => {
    console.log("An error ocurred loading the GLTF model");
  }
);

const directionalLight = new THREE.DirectionalLight("white", 0.8);
directionalLight.position.set(0, 5, 0);
directionalLight.lookAt(0, 0, 0);
instantTrackerGroup.add(directionalLight);

const ambientLight = new THREE.AmbientLight("white", 0.4);
instantTrackerGroup.add(ambientLight);

// When the experience loads we'll let the user choose a place in their room for
// the content to appear using setAnchorPoseFromCameraOffset (see below)
// The user can confirm the location by tapping on the screen
let hasPlaced = false;
const placeButton =
  document.getElementById("tap-to-place") || document.createElement("div");
placeButton.addEventListener("click", () => {
  hasPlaced = true;
  placeButton.remove();
});

function render(): void {
  if (!hasPlaced) {
    instantTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -5);
  }

  camera.updateFrame(renderer);

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

// Get the map and marker from initializeMap function
const map = initializeMap();
const marker = map.getMarker();

getUserLocation(
  (coords) => {
    console.log("Receiving coordinates:", coords);
    // Start things off
    const { latitude, longitude } = coords;
    const markerLngLat: [number, number] = [longitude, latitude];
    marker.setLngLat(markerLngLat);
    map.flyTo(markerLngLat, 15);

    render();
  },
  (error) => {
    console.error("Error getting user location:", error.message);
  }
);
