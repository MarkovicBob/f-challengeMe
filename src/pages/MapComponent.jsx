import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubCategoryColor } from "../utils/ColorChange.js";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent = ({
  coordinates,
  isInteractive = true,
  zoomLevel = 12,
  hideControls = false,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const geocoderRef = useRef(null);

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const [mapStyle, setMapStyle] = useState(() => {
    const theme = localStorage.getItem("theme") || "dark";
    return theme === "dark" ? "dark-v11" : "outdoors-v12";
  });

  const addMarkersToMap = () => {
    if (!map.current || !locations.length || !challenges.length) return;

    locations.forEach((location, index) => {
      try {
        let coords = [...location];
        while (Array.isArray(coords[0]) && coords.length === 1) {
          coords = [...coords[0]];
        }

        if (!Array.isArray(coords) || coords.length !== 2) return;

        let [a, b] = coords.map(Number);
        let lngLat = Math.abs(a) <= 90 && Math.abs(b) <= 180 ? [b, a] : [a, b];
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

        const challengeId = challenges[index]?._id;
        const challengeTitle = challenges[index]?.challengeTitle || "Challenge";
        const subCategory = challenges[index]?.challengeSubCategory;

        const popupNode = document.createElement("div");
        // console.log(getSubCategoryColor(subCategory).split(" "));

        // Применяем класс к popupNode напрямую
        popupNode.className = `${getSubCategoryColor(
          subCategory
        )}  text-center  font-semibold p-4 rounded`;

        // Устанавливаем содержимое
        popupNode.textContent = challengeTitle;

        // Добавляем обработчик клика на весь popup
        popupNode.addEventListener("click", () => {
          if (challengeId) {
            navigate(`/start/home/${challengeId}`);
          }
        });

        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupNode))
          .addTo(map.current);
      } catch (e) {
        console.error("Marker error:", e);
      }
    });
  };

  const setupMap = (centerCoords) => {
    if (map.current) {
      map.current.remove();
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: centerCoords,
      zoom: zoomLevel,
      interactive: isInteractive,
    });

    map.current.on("load", () => {
      const popupNode = document.createElement("div");
      popupNode.className = "p-4 color-black";
      popupNode.textContent = "You are here";
      new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat(centerCoords)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupNode))
        .addTo(map.current);

      addMarkersToMap();

      // Удаляем старый геокодер, если есть
      if (geocoderRef.current) {
        geocoderRef.current.off("results", () => {}); // очищаем события, если нужно
        geocoderRef.current.clear(); // очищает поля
        geocoderRef.current = null;
        const existing = document.querySelector(".mapboxgl-ctrl-geocoder");
        if (existing) existing.remove(); // удаляет DOM элемент
      }

      if (!hideControls) {
        new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: false,
          proximity: {
            longitude: centerCoords[0],
            latitude: centerCoords[1],
          },
        }).addTo(map.current);
      }
    });
  };

  const changeMapStyle = (newStyle) => {
    setMapStyle(newStyle);
    if (map.current) {
      map.current.setStyle(`mapbox://styles/mapbox/${newStyle}`);
      map.current.on("style.load", () => {
        new mapboxgl.Marker({ color: "#FF0000" })
          .setLngLat(coordinates)
          .setPopup(new mapboxgl.Popup().setText("You are here"))
          .addTo(map.current);

        addMarkersToMap();

        // Удаляем старый геокодер, если есть
        if (geocoderRef.current) {
          geocoderRef.current.off("results", () => {}); // очищаем события, если нужно
          geocoderRef.current.clear(); // очищает поля
          geocoderRef.current = null;
          const existing = document.querySelector(".mapboxgl-ctrl-geocoder");
          if (existing) existing.remove(); // удаляет DOM элемент
        }

        if (!hideControls) {
          new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false,
            proximity: {
              longitude: coordinates[0],
              latitude: coordinates[1],
            },
          }).addTo(map.current);
        }
      });
    }
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

    let center;

    if (
      Array.isArray(coordinates) &&
      coordinates.length === 2 &&
      typeof coordinates[0] === "number" &&
      typeof coordinates[1] === "number"
    ) {
      center = coordinates; // koristi direktno [lng, lat]
    } else if (
      typeof coordinates === "object" &&
      coordinates !== null &&
      "lng" in coordinates &&
      "lat" in coordinates
    ) {
      center = [coordinates.lng, coordinates.lat];
    } else {
      console.error("Invalid coordinates format", coordinates);
      return;
    }

    setupMap(center);
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
