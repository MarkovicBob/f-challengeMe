import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent = ({
  coordinates,
  isInteractive = true,
  zoomLevel = 12,
  hideControls = false,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [mapStyle, setMapStyle] = useState("streets-v12");

  const changeMapStyle = (newStyle) => {
    setMapStyle(newStyle);
    if (map.current) {
      map.current.setStyle(`mapbox://styles/mapbox/${newStyle}`);
    }
  };

  const addMarkersToMap = () => {
    if (!map.current || !locations.length || !challenges.length) return;

    locations.forEach((location, index) => {
      try {
        let coords = [...location];

        // Распаковываем вложенные массивы
        while (Array.isArray(coords[0]) && coords.length === 1) {
          coords = [...coords[0]];
        }

        // Проверка валидности
        if (!Array.isArray(coords) || coords.length !== 2) return;

        let [a, b] = coords.map(Number);

        // Автоматическое определение порядка координат
        let lngLat =
          Math.abs(a) <= 90 && Math.abs(b) <= 180
            ? [b, a] // [lat, lng] → [lng, lat]
            : [a, b]; // [lng, lat] как надо

        const [lng, lat] = lngLat;

        if (
          isNaN(lng) ||
          isNaN(lat) ||
          lng < -180 ||
          lng > 180 ||
          lat < -90 ||
          lat > 90
        ) {
          console.warn("Invalid coordinates for marker", lngLat);
          return;
        }

        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3>${challenges[index]?.challengeTitle || "Challenge"}</h3>`
            )
          )
          .addTo(map.current);
      } catch (e) {
        console.error("Marker error:", e);
      }
    });
  };

  useEffect(() => {
    const challengeData = async () => {
      try {
        const res = await axios.get(
          `https://challengeme-server-ra24.onrender.com/api/v1/challenges`
        );

        const extractedLocations = res.data.data
          .map((el) =>
            el.location?.coordinates ? el.location.coordinates : null
          )
          .filter(Boolean);

        setLocations(extractedLocations);
        setChallenges(res.data.data);
      } catch (error) {
        console.error("Fetching error", error);
      } finally {
        setLoading(false);
      }
    };

    challengeData();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !coordinates || loading) return;

    if (map.current) {
      map.current.remove();
    }

    let center;

    if (
      typeof coordinates === "object" &&
      coordinates !== null &&
      "lat" in coordinates &&
      "lng" in coordinates
    ) {
      center = [coordinates.lng, coordinates.lat];
    } else if (
      Array.isArray(coordinates) &&
      coordinates.length === 2 &&
      typeof coordinates[0] === "number" &&
      typeof coordinates[1] === "number"
    ) {
      // Автоопределение порядка
      center =
        Math.abs(coordinates[0]) <= 90 && Math.abs(coordinates[1]) <= 180
          ? [coordinates[1], coordinates[0]]
          : [...coordinates];
    } else {
      console.error("Invalid coordinates format", coordinates);
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: coordinates,
      zoom: zoomLevel,
      interactive: isInteractive,
    });

    map.current.on("load", () => {
      addMarkersToMap();

      if (!hideControls) {
        new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: false,
          proximity: {
            longitude: center[0],
            latitude: center[1],
          },
        }).addTo(map.current);
      }
    });

    return () => map.current?.remove();
  }, [coordinates, loading, mapStyle, locations]);

  return (
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
  );
};

export default MapComponent;
