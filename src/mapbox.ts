import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibXJpZ2VzaHRoYWt1ciIsImEiOiJjbDdwdjZ2MG4wbGVmM3JzMzVtb2U1MnJ0In0.nbEGuAgv1N1c-tXDyR7d4g";

export function initializeMap() {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [0, 0],
    zoom: 12,
  });

  const marker = new mapboxgl.Marker({
    color: "#FF0000",
    draggable: true,
  })
    .setLngLat([0, 0])
    .addTo(map);

  return {
    map,
    getMarker: () => marker,
    flyTo: (lngLat: any, zoom: any) => {
      console.log("running fly too fn ");
      map.flyTo({ center: lngLat, zoom });
    },
  };
}
