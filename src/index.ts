import * as THREE from "three";
import * as ZapparThree from "@zappar/zappar-threejs";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  getUserLocation,
  Coordinates,
  calculateDistance,
} from "./location-tracking";
import { initializeMap } from "./mapbox";
const model = new URL("../assets/waving.glb", import.meta.url).href;
const coin = new URL("../assets/coin.png", import.meta.url).href;
import "./index.css";

if (ZapparThree.browserIncompatible()) {
  ZapparThree.browserIncompatibleUI();
  throw new Error("Unsupported browser");
}

let totalDistance = 0;
let totalpoints = 0;
// Get the HTML element to display points
const pointElement =
  document.getElementById("points") || document.createElement("div");

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

// const gltfLoader = new GLTFLoader(manager);

// gltfLoader.load(
//   model,
//   (gltf) => {
//     instantTrackerGroup.add(gltf.scene);
//   },
//   undefined,
//   () => {
//     console.log("An error ocurred loading the GLTF model");
//   }
// );

// adding objects

// Loading texture image for the golden material
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load(coin);

const goldenMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd700, // Golden color
  emissive: 0xffd700,
  metalness: 1,
  roughness: 0,
  // map: texture,
});

const goldenMaterial2 = new THREE.MeshStandardMaterial({
  color: 0x000, // Golden color
  // emissive: 0xffd700,
  metalness: 1,
  roughness: 0,
  wireframe: true,
  // map: texture,
});
const coinGeometry = new THREE.SphereGeometry(1.3, 32, 32);
const goldenCoin = new THREE.Mesh(coinGeometry, goldenMaterial);
goldenCoin.position.z = -1;
instantTrackerGroup.add(goldenCoin);

// golden coin 2

const goldenCoin2 = new THREE.Mesh(coinGeometry, goldenMaterial2);
goldenCoin2.position.z = -10;
goldenCoin2.position.y = 2;
goldenCoin2.visible = true;
instantTrackerGroup.add(goldenCoin2);

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

function render(totalDist: number): void {
  if (!hasPlaced) {
    instantTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -5);
  }

  camera.updateFrame(renderer);

  if (totalDist == 0.05) {
    goldenCoin.visible = false;
    totalpoints += 1;
    pointElement.textContent = `Points : ${totalpoints} `;
  }

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

// Get the map and marker from initializeMap function
const map = initializeMap();
const marker = map.getMarker();

let lastKnownCoords: Coordinates | null = null;
const distanceThreshold = 1; //in kilometers

// Get the HTML element to display distance
const distanceElement =
  document.getElementById("distance") || document.createElement("div");

getUserLocation(
  (coords) => {
    console.log("Receiving coordinates:", coords);

    // Check if we have previous coordinates to calculate distance
    if (lastKnownCoords) {
      const distance = calculateDistance(lastKnownCoords, coords);
      console.log("Distance is:", distance);

      // Update total distance
      totalDistance += distance;

      // Display the total distance in the HTML element
      distanceElement.textContent = `Distance : ${totalDistance.toFixed(2)} km`;
      // Check if the user has moved beyond the threshold
      if (distance >= distanceThreshold) {
        // Trigger Three.js code
        console.log("Distance is:", distance);
      }
    }

    const { latitude, longitude } = coords;
    const markerLngLat: [number, number] = [longitude, latitude];
    marker.setLngLat(markerLngLat);
    map.flyTo(markerLngLat, 15);

    lastKnownCoords = coords;
    render(totalDistance);
  },
  (error) => {
    console.error("Error getting user location:", error.message);
  }
);
