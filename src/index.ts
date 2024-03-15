import * as THREE from "three";
import * as ZapparThree from "@zappar/zappar-threejs";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  getUserLocation,
  Coordinates,
  calculateDistance,
} from "./location-tracking";
import { initializeMap } from "./mapbox";
const model = new URL("../assets/goldencoin.glb", import.meta.url).href;
const coin = new URL("../assets/coin.png", import.meta.url).href;
import "./index.css";

if (ZapparThree.browserIncompatible()) {
  ZapparThree.browserIncompatibleUI();
  throw new Error("Unsupported browser");
}

let totalDistance = 0;
let totalpoints = 0;
let coinModel: THREE.Group;
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

function calculateDistanceFromOrigin(): number {
  const userPosition = new THREE.Vector3();
  camera.getWorldPosition(userPosition); // Get the world position of the camera

  return userPosition.length();
}

function checkUserARposeDist(): boolean {
  const distanceThresholdCoin2 = 2;
  const userPosition = new THREE.Vector3();
  camera.getWorldPosition(userPosition);
  const distanceToCoin2 = userPosition.distanceTo(goldenCoin2.position);

  if (distanceToCoin2 < distanceThresholdCoin2) return true;

  console.log("distanceToCoin2", distanceToCoin2);
  return false;
}

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
    coinModel = gltf.scene;
    instantTrackerGroup.add(gltf.scene);
  },
  undefined,
  () => {
    console.log("An error ocurred loading the GLTF model");
  }
);

// adding objects

// Loading texture image for the golden material
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(coin);

const goldenMaterial = new THREE.MeshStandardMaterial({
  // color: 0xffd700, // Golden color
  emissive: 0xffd700,
  // metalness: 1,
  // roughness: 0,
  map: texture,
});

const goldenMaterial2 = new THREE.MeshStandardMaterial({
  color: 0xffd700, // Golden color
  emissive: 0xffd700,
  metalness: 1,
  roughness: 0,
  // wireframe: true,
  // map: texture,
});
const coinGeometry = new THREE.SphereGeometry(2, 32, 32);
const goldenCoin = new THREE.Mesh(coinGeometry, goldenMaterial);
// goldenCoin.position.z = -3;
goldenCoin.visible = false;
instantTrackerGroup.add(goldenCoin);

// golden coin 2

const goldenCoin2 = new THREE.Mesh(coinGeometry, goldenMaterial2);
// goldenCoin2.position.z = -3;
// goldenCoin2.position.y = 2;
goldenCoin2.visible = false;
instantTrackerGroup.add(goldenCoin2);

// Create a thin strip
const stripGeometry = new THREE.PlaneGeometry(10, 1);
const stripMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const strip = new THREE.Mesh(stripGeometry, stripMaterial);
// strip.position.set(0, -window.innerHeight / 2 + 20, 0); // Position the strip at the bottom of the screen
instantTrackerGroup.add(strip);

// Create small arrows
const arrowGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const arrows: any = [];
const arrowCount = 10;
const gap = 1; // Gap between arrows
for (let i = 0; i < arrowCount; i++) {
  const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
  arrow.position.set(i * gap - (arrowCount / 2) * gap, 0, 0); // Position arrows horizontally
  strip.add(arrow); // Add arrows to the strip
  arrows.push(arrow);
}

const directionalLight = new THREE.DirectionalLight("white", 0.8);
directionalLight.position.set(0, 5, 0);
directionalLight.lookAt(0, 0, 0);
instantTrackerGroup.add(directionalLight);

const ambientLight = new THREE.AmbientLight("white", 1);
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
    instantTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -15);
    if (coinModel) {
      coinModel.rotation.y += 0.01;
    }
    arrows.forEach((arrow: any) => {
      arrow.rotation.z += 0.1;
    });
    camera.updateFrame(renderer);
  } else {
    totalDist = totalDist / 10000;
    camera.updateFrame(renderer);
    goldenCoin.position.z += -0.01;
    goldenCoin2.scale.add(new THREE.Vector3(0.0002, 0.0002, 0.0002));
    console.log("Distance of the user from the origin:", totalDist);
    if (totalDist > 1.6 && goldenCoin2.visible) {
      goldenCoin2.visible = false;
      goldenCoin.visible = true;
      totalpoints += 1;
      pointElement.textContent = `Points : ${totalpoints} `;
    }

    // goldenCoin.position.z = -totalDist - 5;
  }

  renderer.render(scene, camera);

  // Calculate the distance from the origin
  // const distanceFromOrigin = calculateDistanceFromOrigin();
  // console.log("Distance of the user from the origin:", distanceFromOrigin);

  // if (checkUserARposeDist()) {
  // }

  requestAnimationFrame(render);
}

// Get the map and marker from initializeMap function
// const map = initializeMap();
// const marker = map.getMarker();

let lastKnownCoords: Coordinates | null = null;
const distanceThreshold = 1; //in kilometers

// Get the HTML element to display distance
const distanceElement =
  document.getElementById("distance") || document.createElement("div");

getUserLocation(
  (coords) => {
    // console.log("Receiving coordinates:", coords);

    // Check if we have previous coordinates to calculate distance
    if (lastKnownCoords) {
      const distance = calculateDistance(lastKnownCoords, coords);
      // console.log("Distance is:", distance);

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

    // const { latitude, longitude } = coords;
    // // const markerLngLat: [number, number] = [longitude, latitude];
    // // // marker.setLngLat(markerLngLat);
    // // // map.flyTo(markerLngLat, 15);

    lastKnownCoords = coords;
    console.log("totalDistance", totalDistance);
    render(totalDistance);
  },
  (error) => {
    console.error("Error getting user location:", error.message);
  }
);
