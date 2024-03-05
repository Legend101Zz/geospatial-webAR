import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Replace 'YOUR_MAPBOX_ACCESS_TOKEN' with your actual Mapbox access token
mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

function initializeMap(markerLngLat: [number, number]): void {
  const map = new mapboxgl.Map({
    container: "map", // Specify the container ID
    style: "mapbox://styles/mapbox/streets-v11", // Use a Mapbox style
    center: markerLngLat, // Initial center of the map (longitude, latitude)
    zoom: 1, // Initial zoom level
  });

  // Add a marker at the center (initially)
  const marker = new mapboxgl.Marker({
    color: "#FF0000", // Marker color (red)
    draggable: true, // Allow the user to drag the marker
  })
    .setLngLat(markerLngLat) // Set initial marker position
    .addTo(map);
}
