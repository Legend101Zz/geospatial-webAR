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
const model2 = new URL("../assets/goldenkey.glb", import.meta.url).href;
const coin = new URL("../assets/coin.png", import.meta.url).href;
import "./index.css";

if (ZapparThree.browserIncompatible()) {
  ZapparThree.browserIncompatibleUI();
  throw new Error("Unsupported browser");
}

let totalDistance = 0;
let totalpoints = 0;
let coinModel: THREE.Group;
let keyModel: THREE.Group;
// Get the HTML element to display points
const pointElement =
  document.getElementById("points") || document.createElement("div");

function showModal() {
  var modal = document.getElementById("myModal");
  if (modal) modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById("myModal");
  if (modal) modal.style.display = "none";
}

const popupImage =
  document.getElementById("popupImage") || document.createElement("div");

const modalM =
  document.getElementById("closeM") || document.createElement("div");

modalM.addEventListener("click", () => {
  closeModal();
});

popupImage.addEventListener("click", () => {
  showModal();
});

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

// function checkUserARposeDist(): boolean {
//   const distanceThresholdCoin2 = 2;
//   const userPosition = new THREE.Vector3();
//   camera.getWorldPosition(userPosition);
//   const distanceToCoin2 = userPosition.distanceTo(goldenCoin2.position);

//   if (distanceToCoin2 < distanceThresholdCoin2) return true;

//   console.log("distanceToCoin2", distanceToCoin2);
//   return false;
// }

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
    coinModel.scale.set(0.5, 0.5, 0.5);
    coinModel.position.z = -1;
    coinModel.position.y = 1;
    instantTrackerGroup.add(gltf.scene);
  },
  undefined,
  () => {
    console.log("An error ocurred loading the GLTF model");
  }
);

gltfLoader.load(
  model2,
  (gltf) => {
    keyModel = gltf.scene;
    keyModel.scale.set(0.5, 0.5, 0.5);
    keyModel.position.z = -1;
    keyModel.position.y = 1;
    keyModel.visible = false;
    instantTrackerGroup.add(gltf.scene);
  },
  undefined,
  () => {
    console.log("An error ocurred loading the GLTF model");
  }
);

// adding objects

// Loading texture image for the golden material
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load(coin);

// const goldenMaterial = new THREE.MeshStandardMaterial({
//   // color: 0xffd700, // Golden color
//   emissive: 0xffd700,
//   // metalness: 1,
//   // roughness: 0,
//   map: texture,
// });

// const goldenMaterial2 = new THREE.MeshStandardMaterial({
//   color: 0xffd700, // Golden color
//   emissive: 0xffd700,
//   metalness: 1,
//   roughness: 0,
//   // wireframe: true,
//   // map: texture,
// });
// const coinGeometry = new THREE.SphereGeometry(2, 32, 32);
// const goldenCoin = new THREE.Mesh(coinGeometry, goldenMaterial);
// // goldenCoin.position.z = -3;
// goldenCoin.visible = false;
// instantTrackerGroup.add(goldenCoin);

// // golden coin 2

// const goldenCoin2 = new THREE.Mesh(coinGeometry, goldenMaterial2);
// // goldenCoin2.position.z = -3;
// // goldenCoin2.position.y = 2;
// goldenCoin2.visible = false;
// instantTrackerGroup.add(goldenCoin2);

// Create a thin strip
const stripGeometry = new THREE.PlaneGeometry(100, 3.5);
const stripMaterial = new THREE.MeshBasicMaterial({
  color: 0x5190cf,
  transparent: true,
  opacity: 0.6,
});
const strip = new THREE.Mesh(stripGeometry, stripMaterial);

strip.rotation.x = -Math.PI / 2;
strip.rotation.z = Math.PI / 2;
strip.position.set(0, -3, 0); // Position the strip at the bottom of the screen
instantTrackerGroup.add(strip);

// Create the triangle arrow geometry
const arrowShape = new THREE.Shape();
arrowShape.moveTo(0, 0);
arrowShape.lineTo(-1, 2); // Tip of the arrow
arrowShape.lineTo(-0.5, 2); // Upper edge of the arrow
arrowShape.lineTo(-0.5, 4); // Upper point of the tail
arrowShape.lineTo(0.5, 4); // Lower point of the tail
arrowShape.lineTo(0.5, 2); // Lower edge of the arrow
arrowShape.lineTo(1, 2); // Tip of the arrow
arrowShape.lineTo(0, 0); // Back to starting point

const arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, {
  depth: 0.4, // Adjust depth as needed
  bevelEnabled: false, // Disable beveling
});

const arrowMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.2,
});
const arrows: any = [];
const arrowCount = 100;
const gap = 3; // Gap between arrows
for (let i = 0; i < arrowCount; i++) {
  const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
  arrow.scale.set(0.5, 0.5, 0.5);
  arrow.rotation.z = Math.PI / 2;
  arrow.position.set(i * gap - (arrowCount / 2) * gap, 0.001, 0); // Position arrows horizontally
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

const startModal =
  document.querySelector(".task-button") || document.createElement("div");

placeButton.addEventListener("click", () => {
  hasPlaced = true;
  startModal.remove();
  placeButton.remove();
  popupImage.style.display = "block";
});

function render(totalDist: number): void {
  if (!hasPlaced) {
    instantTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -15);
    if (coinModel) {
      coinModel.rotation.y += 0.01;
    }
    arrows.forEach((arrow: any) => {
      arrow.position.x += 0.03; // Move arrows horizontally
      // Check if arrow has moved beyond a threshold
      if (arrow.position.x > (arrowCount / 2) * gap * 10) {
        arrow.position.x = -(arrowCount / 2) * gap; // Reset arrow position to the starting point
      }
    });
    camera.updateFrame(renderer);
  } else {
    if (coinModel && keyModel) {
      coinModel.rotation.y += 0.01;
      keyModel.rotation.y += 0.01;
    }
    arrows.forEach((arrow: any) => {
      arrow.position.x += 0.03; // Move arrows horizontally
      // Check if arrow has moved beyond a threshold
      if (arrow.position.x > (arrowCount / 2) * gap * 10) {
        arrow.position.x = -(arrowCount / 2) * gap; // Reset arrow position to the starting point
      }
    });
    totalDist = totalDist / 10000;
    camera.updateFrame(renderer);
    keyModel.position.z += -0.01;
    coinModel.scale.add(new THREE.Vector3(0.0002, 0.0002, 0.0002));
    console.log("Distance of the user from the origin:", totalDist);
    if (totalDist > 1.6 && coinModel.visible) {
      coinModel.visible = false;
      keyModel.visible = true;
      totalpoints += 1;
      // Create the temporary element with the text
      const messageElement = document.createElement("div");
      messageElement.textContent = "You have obtained a Golden shoe";
      messageElement.style.position = "fixed";
      messageElement.style.top = "50%";
      messageElement.style.left = "50%";
      messageElement.style.transform = "translate(-50%, -50%)";
      messageElement.style.fontSize = "24px";
      messageElement.style.color = "white";
      document.body.appendChild(messageElement);

      // Remove the temporary element after 2-3 seconds
      setTimeout(() => {
        messageElement.remove();
      }, 3000); // 3000 milliseconds = 3 seconds
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
