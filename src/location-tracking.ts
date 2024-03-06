export type Coordinates = {
  latitude: number;
  longitude: number;
};

export function getUserLocation(
  callback: (coords: Coordinates) => void,
  errorCallback: (error: any) => void
): number | null {
  if (!navigator.geolocation) {
    prompt("Geolocation is not supported by your browser.");
    errorCallback(new Error("Geolocation is not supported by your browser."));
    return null;
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      callback({ latitude, longitude });
    },
    (error) => {
      errorCallback(error);
    }
  );

  return watchId;
}

// Function to calculate distance between two coordinates
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const earthRadius = 6371; // Earth radius in kilometers
  const lat1 = toRadians(coord1.latitude);
  const lon1 = toRadians(coord1.longitude);
  const lat2 = toRadians(coord2.latitude);
  const lon2 = toRadians(coord2.longitude);

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;
  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
