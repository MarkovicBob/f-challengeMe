import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent = ({
  coordinates,
  isInteractive = true,
  zoomLevel = 12,
  hideControls = false,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [mapStyle, setMapStyle] = useState("streets-v12");

  const changeMapStyle = (newStyle) => {
    setMapStyle(newStyle);
    if (map.current) {
      map.current.setStyle(`mapbox://styles/mapbox/${newStyle}`);
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: coordinates,
      zoom: coordinates ? 15 : 10,
      antialias: true,
    });

    // Добавляем маркер на карту
    new mapboxgl.Marker().setLngLat(coordinates).addTo(map.current);

    if (!hideControls) {
      map.current.on("load", () => {
        new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: false,
          proximity: coordinates
            ? { longitude: coordinates[0], latitude: coordinates[1] }
            : undefined,
        }).addTo(map.current);
      });
    }

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
