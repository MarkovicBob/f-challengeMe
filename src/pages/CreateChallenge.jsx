import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateChallenge() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [standardLevel, setStandardLevel] = useState("Easy");
  const [locationType, setLocationType] = useState("Point");

  // Initialize coordinates properly based on the location type
  const [coordinates, setCoordinates] = useState([
    [0, 0], // For Point: [lat, lng]
  ]);

  const [addresses, setAddresses] = useState([""]); // Start with one address for Point
  const geocoderContainerRefs = useRef([]);

  // Set up geocoder references
  useEffect(() => {
    // Clear existing geocoder containers
    if (geocoderContainerRefs.current) {
      geocoderContainerRefs.current.forEach((container) => {
        if (container) {
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        }
      });
    }

    // Create new geocoder instances
    addresses.forEach((_, index) => {
      if (geocoderContainerRefs.current[index]) {
        const geocoder = new MapboxGeocoder({
          accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
          placeholder: `Enter address for Point ${index + 1}`,
        });

        geocoder.on("result", (e) => handleGeocoderResult(index, e));
        geocoderContainerRefs.current[index].appendChild(geocoder.onAdd());
      }
    });
  }, [addresses.length, locationType]);

  const handleGeocoderResult = (index, result) => {
    const updatedCoordinates = [...coordinates];
    updatedCoordinates[index] = [
      result.result.center[1], // lat
      result.result.center[0], // lng
    ];
    setCoordinates(updatedCoordinates);

    // Update the address input field
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = result.result.place_name;
    setAddresses(updatedAddresses);
  };

  const handleCategory = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    switch (selectedCategory) {
      case "Movement, Hobby, Sports":
        setSubCategoryOptions([
          "Hiking",
          "Jogging",
          "Cycling",
          "Climbing",
          "Kayaking",
          "Gymnastics",
          "Fitness",
          "Fishing",
        ]);
        break;
      case "Mindfulness, Focus, Meditation":
        setSubCategoryOptions(["Yoga", "Meditation", "Breathing Exercises"]);
        break;
      case "Knowledge, Discovery, Geology":
        setSubCategoryOptions(["Geology", "Astronomy", "History"]);
        break;
      case "Photography, Creativity, Art":
        setSubCategoryOptions(["Photography", "Painting", "Sculpting"]);
        break;
      default:
        setSubCategoryOptions([]);
    }
  };

  const handleLocationTypeChange = (e) => {
    const selectedType = e.target.value;
    setLocationType(selectedType);

    if (selectedType === "Point") {
      // For Point, we need 1 address with [lat, lng]
      setAddresses([""]);
      setCoordinates([[0, 0]]);
    } else if (selectedType === "Route") {
      // For Route, we need 2 addresses, which will create 4 coordinates when flattened
      // [lat1, lng1, lat2, lng2]
      setAddresses(["", ""]);
      setCoordinates([
        [0, 0],
        [0, 0],
      ]);
    }
  };

  const handleAddressChange = (index, value) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = value;
    setAddresses(updatedAddresses);
  };

  const getCoordinates = async (address) => {
    if (!address.trim()) {
      console.error("Address is empty");
      return null;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center; // [lng, lat]
        return [lat, lng]; // Switch to [lat, lng] for consistency
      } else {
        throw new Error("No features found for the given address");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error.message);
      return [0, 0]; // Default coordinates
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // First get coordinates for all addresses
    const validCoordinates = [];
    for (const address of addresses) {
      if (address.trim()) {
        const coords = await getCoordinates(address);
        validCoordinates.push(coords);
      }
    }

    // Prepare coordinates based on location type
    let finalCoordinates;
    if (locationType === "Point") {
      finalCoordinates =
        validCoordinates.length > 0 ? validCoordinates : [[0, 0]];
    } else if (locationType === "Route") {
      // For Route, we need to have exactly 2 points to create 4 coordinates
      if (validCoordinates.length === 2) {
        // Flatten the array to match backend requirements [lat1, lng1, lat2, lng2]
        finalCoordinates = [
          validCoordinates[0][0],
          validCoordinates[0][1],
          validCoordinates[1][0],
          validCoordinates[1][1],
        ];
      } else {
        // Default if we don't have two valid points
        finalCoordinates = [0, 0, 0, 0];
      }
    }

    const formData = {
      challengeTitle: challengeTitle || "Default Title",
      challengeDescription: challengeDescription || "Default Description",
      shortDescription: "Description from AI",
      challengeCategory: category || "Default Category",
      challengeSubCategory: subCategory || "Default Subcategory",
      standardLevel: standardLevel,
      frequence: "Once",
      location: {
        type: locationType,
        coordinates: finalCoordinates,
      },
      challengeReward: 60,
      duration: 1,
    };

    try {
      const token = localStorage.getItem("token");
      console.log("Form data:", formData, "token:", token);
      const response = await axios.post(
        "https://challengeme-server-ra24.onrender.com/api/v1/challenges",
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const challengeId = response.data.data._id;

      // Reset form
      setCategory("");
      setSubCategory("");
      setSubCategoryOptions([]);
      setChallengeTitle("");
      setChallengeDescription("");
      setAddresses([""]);
      setCoordinates([[0, 0]]);
      e.target.reset();

      // Navigate to the challenge page
      navigate(`/start/home/${challengeId}`);
    } catch (error) {
      console.error(
        "Error submitting challenge:",
        error.response?.data || error.message
      );
      alert("Failed to create challenge. Please check console for details.");
    }
  };

  return (
    <div className="mt-15">
      <form
        className="mt-20 mx-auto flex flex-col justify-center items-center max-w-md w-[212px]"
        onSubmit={handleSubmit}
      >
        {/* Category */}
        <select
          name="category"
          value={category}
          className="select placeholder-gray-500 p-2 text-black bg-white rounded-md mt-4 w-full"
          onChange={handleCategory}
        >
          <option value="" disabled>
            Pick a category
          </option>
          <option>Movement, Hobby, Sports</option>
          <option>Mindfulness, Focus, Meditation</option>
          <option>Knowledge, Discovery, Geology</option>
          <option>Photography, Creativity, Art</option>
        </select>

        {/* Subcategory */}
        <select
          name="sub-category"
          value={subCategory}
          className="select placeholder-gray-500 p-2 text-black bg-white rounded-md mt-4 w-full"
          onChange={(e) => setSubCategory(e.target.value)}
          disabled={!subCategoryOptions.length}
        >
          <option value="" disabled>
            Pick a subcategory
          </option>
          {subCategoryOptions.map((sub, index) => (
            <option key={index} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        {/* Standard Level */}
        <select
          name="standardLevel"
          value={standardLevel}
          className="select placeholder-gray-500 p-2 text-black bg-white rounded-md mt-4 w-full"
          onChange={(e) => setStandardLevel(e.target.value)}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Difficult</option>
        </select>

        {/* Location */}
        <fieldset className="border border-gray-300 rounded-md p-4 mt-4 w-full">
          <legend className="text-lg font-semibold">Location</legend>

          <select
            name="locationType"
            value={locationType}
            className="select placeholder-gray-500 p-2 text-black bg-white rounded-md mt-2 w-full"
            onChange={handleLocationTypeChange}
          >
            <option value="Point">Point</option>
            <option value="Route">Route</option>
          </select>

          {addresses.map((address, index) => (
            <div key={index} className="mt-4">
              <label className="block mb-1">
                {locationType === "Point" ? "Location" : `Point ${index + 1}`}
              </label>

              {/* Geocoder container */}
              <div
                ref={(el) => (geocoderContainerRefs.current[index] = el)}
                className="mb-2"
              />

              {/* Manual address input
              <input
                type="text"
                placeholder={`Address for ${
                  locationType === "Point" ? "Location" : `Point ${index + 1}`
                }`}
                className="placeholder-gray-500 p-2 text-black bg-white rounded-md w-[212px]"
                value={address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
              /> */}

              {/* Show current coordinates */}
              {coordinates[index] && (
                <div className="text-xs mt-1">
                  Coordinates: [{coordinates[index][0].toFixed(5)},{" "}
                  {coordinates[index][1].toFixed(5)}]
                </div>
              )}
            </div>
          ))}
        </fieldset>

        <button
          type="submit"
          className="bg-green-700 px-4 py-2 rounded-md cursor-pointer mt-6 w-full mb-16"
        >
          Create Challenge
        </button>
      </form>
    </div>
  );
}

export default CreateChallenge;
