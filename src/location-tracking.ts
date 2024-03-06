type Coordinates = {
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
