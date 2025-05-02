import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

if (!mapboxToken) {
  throw new Error("You need a Mapbox token to run this application");
}

mapboxgl.accessToken = mapboxToken;

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const geocoder = useRef(null);
  const [mapStyle, setMapStyle] = useState("outdoors-v12");
  const [markerCoords, setMarkerCoords] = useState(null);
  const markerRef = useRef(null);

  const changeMapStyle = (style) => {
    setMapStyle(style); // triggeruje re-render
  };

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: `mapbox://styles/mapbox/${mapStyle}`,
        center: [13.38886, 52.517037],
        zoom: 10,
      });

      geocoder.current = new MapboxGeocoder({
        accessToken: mapboxToken,
        mapboxgl: mapboxgl,
        marker: false,
        flyTo: { zoom: 12, essential: true },
        placeholder: "Search location",
        language: "en",
        countries: "all",
        types: "place,address,locality,neighborhood",
        minLength: 2,
        limit: 5,
      });

      const geocoderContainer = document.createElement("div");
      geocoderContainer.className =
        "absolute top-5 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-[500px]";
      map.current.getContainer().appendChild(geocoderContainer);
      geocoderContainer.appendChild(geocoder.current.onAdd(map.current));

      const input = geocoderContainer.querySelector(
        ".mapboxgl-ctrl-geocoder input"
      );
      if (input) {
        input.className =
          "w-full p-2.5 text-base text-black rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
      }

      geocoder.current.on("result", (e) => {
        const { center } = e.result;
        map.current.flyTo({ center, zoom: 12, essential: true });
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const { latitude, longitude } = coords;
            map.current.flyTo({ center: [longitude, latitude], zoom: 14 });
          },
          (error) => console.error("Location error:", error)
        );
      }

      map.current.on("click", (e) => {
        const lngLat = e.lngLat;
        setMarkerCoords(lngLat); // čuvamo poslednji klik za ponovni prikaz markera posle promene stila
      });
    } else if (map.current) {
      map.current.setStyle(`mapbox://styles/mapbox/${mapStyle}`);

      map.current.once("style.load", () => {
        if (markerCoords) {
          if (markerRef.current) markerRef.current.remove();

          markerRef.current = new mapboxgl.Marker({ color: "#e11d48" })
            .setLngLat([markerCoords.lng, markerCoords.lat])
            .addTo(map.current);
        }

        if (geocoder.current) {
          const geocoderContainer = document.createElement("div");
          geocoderContainer.className =
            "absolute top-5 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-[500px]";
          map.current.getContainer().appendChild(geocoderContainer);
          geocoderContainer.appendChild(geocoder.current.onAdd(map.current));
        }

        map.current.on("click", (e) => {
          const lngLat = e.lngLat;
          setMarkerCoords(lngLat);
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapStyle]);

  useEffect(() => {
    if (map.current && markerCoords) {
      if (markerRef.current) markerRef.current.remove();

      markerRef.current = new mapboxgl.Marker({ color: "#e11d48" })
        .setLngLat([markerCoords.lng, markerCoords.lat])
        .addTo(map.current);
    }
  }, [markerCoords]);

  return (
    <div className="w-full h-screen relative overflow-hidden mt-12">
      <div
        ref={mapContainer}
        className="h-[65%] mt-17 mx-auto p-2.5 rounded-lg"
      />
      <div className="text-center mt-2.5 p-1.5">
        {["streets-v12", "outdoors-v12", "satellite-v9", "dark-v11"].map(
          (style) => (
            <button
              key={style}
              onClick={() => changeMapStyle(style)}
              className="px-4 py-2.5 text-base text-black font-sans bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200 mx-1 capitalize"
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
