import * as THREE from "three";
import * as ZapparThree from "@zappar/zappar-threejs";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  getUserLocation,
  Coordinates,
  calculateDistance,
} from "./location-tracking";
const model = new URL("../assets/goldencoin.glb", import.meta.url).href;
// const model2 = new URL("../assets/keyd.glb", import.meta.url).href;
const coin = new URL("../assets/coin.png", import.meta.url).href;
import "./index.css";

if (ZapparThree.browserIncompatible()) {
  ZapparThree.browserIncompatibleUI();
  throw new Error("Unsupported browser");
}

let callRender = false;
let totalDistance = 0;
let totalpoints = 0;
let checkDist = 0;
let coinModel: THREE.Group;
// let keyModel: THREE.Group;
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
    coinModel.rotation.y = Math.PI / 2;
    coinModel.rotation.z = Math.PI;
    coinModel.position.z = -1;
    coinModel.position.y = 1;
    instantTrackerGroup.add(gltf.scene);
  },
  undefined,
  () => {
    console.log("An error ocurred loading the GLTF model");
  }
);

// gltfLoader.load(
//   model2,
//   (gltf) => {
//     console.log("loading keyModel", gltf);
//     keyModel = gltf.scene;
//     keyModel.rotation.x = Math.PI / 2;
//     keyModel.position.z = -1;
//     keyModel.position.y = 1;
//     keyModel.visible = false;
//     gltf.scene.traverse(function (child) {
//       // Check if the child is a mesh
//       if (child instanceof THREE.Mesh) {
//         // Add lights to the mesh material
//         const customMaterial = new THREE.MeshStandardMaterial({
//           map: child.material.map, // Use the default texture map
//           emissiveIntensity: 0.2, // Adjust emissive intensity as needed
//           emissive: new THREE.Color(0xffffff), // Set emissive color
//         });
//         child.material = customMaterial;
//       }
//     });
//     instantTrackerGroup.add(gltf.scene);
//   },
//   undefined,
//   () => {
//     console.log("An error ocurred loading the GLTF model");
//   }
// );

// ========= FLOOR3D =========

// Create a thin strip
// const stripGeometry = new THREE.PlaneGeometry(100, 3.5);
// const stripMaterial = new THREE.MeshBasicMaterial({
//   color: 0x5190cf,
//   transparent: true,
//   opacity: 0.6,
// });
// const strip = new THREE.Mesh(stripGeometry, stripMaterial);

// strip.rotation.x = -Math.PI / 2;
// strip.rotation.z = Math.PI / 2;
// strip.position.set(0, -3, 0); // Position the strip at the bottom of the screen
// instantTrackerGroup.add(strip);

// // Create the triangle arrow geometry
// const arrowShape = new THREE.Shape();
// arrowShape.moveTo(0, 0);
// arrowShape.lineTo(-1, 2); // Tip of the arrow
// arrowShape.lineTo(-0.5, 2); // Upper edge of the arrow
// arrowShape.lineTo(-0.5, 4); // Upper point of the tail
// arrowShape.lineTo(0.5, 4); // Lower point of the tail
// arrowShape.lineTo(0.5, 2); // Lower edge of the arrow
// arrowShape.lineTo(1, 2); // Tip of the arrow
// arrowShape.lineTo(0, 0); // Back to starting point

// const arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, {
//   depth: 0.4, // Adjust depth as needed
//   bevelEnabled: false, // Disable beveling
// });

// const arrowMaterial = new THREE.MeshBasicMaterial({
//   color: 0xffffff,
//   transparent: true,
//   opacity: 0.2,
// });
// const arrows: any = [];
// const arrowCount = 100;
// const gap = 3; // Gap between arrows
// for (let i = 0; i < arrowCount; i++) {
//   const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
//   arrow.scale.set(0.5, 0.5, 0.5);
//   arrow.rotation.z = Math.PI / 2;
//   arrow.position.set(i * gap - (arrowCount / 2) * gap, 0.001, 0); // Position arrows horizontally
//   strip.add(arrow); // Add arrows to the strip
//   arrows.push(arrow);
// }

const directionalLight = new THREE.DirectionalLight("white", 1);
directionalLight.position.set(0, -2, -7);
// const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
// const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
// instantTrackerGroup.add(helper, light);
// directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight("white", 1);
scene.add(ambientLight);

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
  // console.log("totalDist val", totalDist);
  if (!hasPlaced) {
    instantTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -15);
    if (coinModel) {
      coinModel.rotation.y += 0.01;
    }
    // arrows.forEach((arrow: any) => {
    //   arrow.position.x += 0.03; // Move arrows horizontally
    //   // Check if arrow has moved beyond a threshold
    //   if (arrow.position.x > (arrowCount / 2) * gap * 10) {
    //     arrow.position.x = -(arrowCount / 2) * gap; // Reset arrow position to the starting point
    //   }
    // });
    camera.updateFrame(renderer);
  } else {
    if (coinModel) {
      coinModel.rotation.y += 0.01;
      // keyModel.position.z += -0.025;
      // keyModel.rotation.z += 0.01;
      // totalDist = totalDist / 10000;
      camera.updateFrame(renderer);

      coinModel.scale.add(new THREE.Vector3(0.0002, 0.0002, 0.0002));
      console.log("Distance of the user from the origin:", checkDist);
      if (checkDist > 0.85 && coinModel.visible) {
        coinModel.visible = false;

        totalpoints += 1;
        // Create translucent background div
        const bgElement = document.createElement("div");
        bgElement.classList.add("popup-bg");
        bgElement.style.position = "fixed";
        bgElement.style.top = "50%";
        bgElement.style.left = "50%";
        bgElement.style.transform = "translate(-50%, -50%)";
        bgElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Adjust the alpha value for the desired transparency
        bgElement.style.padding = "20px"; // Add padding for the text
        bgElement.style.borderRadius = "10px"; // Add rounded corners
        document.body.appendChild(bgElement);

        // Create message div
        const messageElement = document.createElement("div");
        messageElement.classList.add("popup");
        messageElement.textContent = "Collect 4 more coins to get a ";
        const goldenKeySpan = document.createElement("span");
        goldenKeySpan.textContent = "Golden Key";
        goldenKeySpan.style.color = "gold"; // Set the color to gold
        messageElement.appendChild(goldenKeySpan);
        messageElement.style.fontSize = "16px";
        messageElement.style.color = "white";
        messageElement.style.textAlign = "center"; // Center text
        messageElement.style.whiteSpace = "nowrap"; // Prevent text wrapping
        messageElement.style.overflow = "hidden"; // Hide overflow text
        messageElement.style.textOverflow = "ellipsis"; // Show ellipsis for overflow text
        bgElement.appendChild(messageElement); // Append to the background div

        // Remove the temporary element after 2-3 seconds
        setTimeout(() => {
          messageElement.remove();
          bgElement.remove();
          // keyModel.visible = true;
        }, 3000); // 3000 milliseconds = 3 seconds
      }
    }
  }

  renderer.render(scene, camera);

  // Calculate the distance from the origin
  // const distanceFromOrigin = calculateDistanceFromOrigin();
  // console.log("Distance of the user from the origin:", distanceFromOrigin);

  // if (checkUserARposeDist()) {
  // }

  checkDist += 0.001;

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
    if (!callRender) {
      render(0);
      callRender = true;
    }
  },
  (error) => {
    console.error("Error getting user location:", error.message);
  }
);
