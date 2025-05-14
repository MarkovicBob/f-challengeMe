import { useEffect, useState } from "react";
import MapComponent from "./MapComponent";

const FullMapPage = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(coords);
      },
      (err) => {
        // console.error("Geolocation error:", err)
      }
    );
  }, []);

  return (
    <div className="w-full h-[100vh]">
      {userLocation ? (
        <MapComponent
          coordinates={userLocation}
          isInteractive={true}
          zoomLevel={10}
        />
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default FullMapPage;
