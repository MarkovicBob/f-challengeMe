import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapStyle, setMapStyle] = useState("streets-v12");

  const changeMapStyle = (newStyle) => {
    setMapStyle(newStyle);
    if (map.current) {
      map.current.setStyle(`mapbox://styles/mapbox/${newStyle}`);

      if (userLocation) {
        createInteractiveMarker(userLocation);
      }
    }
  };

  const createInteractiveMarker = (lngLat) => {
    if (marker.current) marker.current.remove();

    const el = document.createElement("div");
    el.className = "interactive-marker";
    el.innerHTML = `
      <div class="pulse-effect"></div>
      <div class="marker-core"></div>
    `;

    marker.current = new mapboxgl.Marker(el)
      .setLngLat(lngLat)
      .addTo(map.current);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(coords);
        map.current?.flyTo({ center: coords, zoom: 15 });
        createInteractiveMarker(coords);
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: userLocation || [13.38886, 52.517037],
      zoom: userLocation ? 15 : 10,
      antialias: true,
    });

    map.current.on("load", () => {
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        proximity: userLocation
          ? { longitude: userLocation[0], latitude: userLocation[1] }
          : undefined,
      }).addTo(map.current);
    });

    return () => map.current?.remove();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div ref={mapContainer} className="map-container" />
        <div className="style-controls flex flex-row gap-3">
          {["streets-v12", "outdoors-v12", "satellite-v9", "dark-v11"].map(
            (style) => (
              <button
                key={style}
                onClick={() => changeMapStyle(style)}
                className={`style-button ${mapStyle === style ? "active" : ""}`}
              >
                {style.split("-")[0]}
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default MapComponent;
