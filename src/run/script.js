import { initializeMap } from "../mapbox";
import { getUserLocation } from "../location-tracking";

const expandBtn = document.querySelector(".expand-btn");
const cardContent = document.querySelector(".card-content");
expandBtn.addEventListener("click", () => {
  cardContent.classList.toggle("expanded");
  expandBtn.classList.toggle("expanded");
});

// Get the map and marker from initializeMap function
const map = initializeMap();
const marker = map.getMarker();

getUserLocation((coords) => {
  const { latitude, longitude } = coords;
  const markerLngLat = [longitude, latitude];
  marker.setLngLat(markerLngLat);
  map.flyTo(markerLngLat, 15);
});
