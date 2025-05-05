import { useState, useEffect, useRef } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateChallenge() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    challengeTitle: "",
    challengeDescription: "",
    shortDescription: "",
    challengeCategory: "",
    challengeSubCategory: "",
    fitnessLevel: "",
    frequence: "",
    location: {
      type: "Point",
      coordinates: [[41.8781, -87.6298]],
    },
    challengeReward: 60,
    duration: 1,
  });
  const [category, setCategory] = useState("");
  const [subCategory, setsubCategory] = useState("");
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [standardLevel, setStandardLevel] = useState("beginner");
  const [locationType, setLocationType] = useState("Point");
  const [coordinates, setCoordinates] = useState([
    [0, 0],
    [0, 0],
  ]);
  const [addresses, setAddresses] = useState(["", ""]);
  const geocoderContainerA = useRef(null);
  const geocoderContainerB = useRef(null);

  const handleGeocoderResult = (index, result) => {
    const updatedCoordinates = [...coordinates];
    updatedCoordinates[index] = [
      result.result.center[1], // lat
      result.result.center[0], // lng
    ];
    setCoordinates(updatedCoordinates);
  };

  useEffect(() => {
    const geocoderA = new MapboxGeocoder({
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
      placeholder: "Enter address for Point A",
    });

    geocoderA.on("result", (e) => handleGeocoderResult(0, e));

    if (geocoderContainerA.current) {
      geocoderContainerA.current.appendChild(geocoderA.onAdd());
    }

    const geocoderB = new MapboxGeocoder({
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
      placeholder: "Enter address for Point B",
    });

    geocoderB.on("result", (e) => handleGeocoderResult(1, e));

    if (geocoderContainerB.current) {
      geocoderContainerB.current.appendChild(geocoderB.onAdd());
    }
  }, []);

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
      setCoordinates([[0, 0]]);
    } else if (selectedType === "Route") {
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

  const handleGetCoordinates = async () => {
    const updatedCoordinates = [];
    for (const address of addresses) {
      if (!address.trim()) {
        updatedCoordinates.push(null);
        continue;
      }

      const coords = await getCoordinates(address);
      if (coords) {
        updatedCoordinates.push([coords.lat, coords.lng]);
      } else {
        updatedCoordinates.push(null);
      }
    }
    setCoordinates(updatedCoordinates);
    console.log("Coordinates:", updatedCoordinates);
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
        return { lat, lng };
      } else {
        throw new Error("No features found for the given address");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    const formData = {
      challengeTitle: challengeTitle || "Default Title",
      challengeDescription: challengeDescription || "Default Description",
      shortDescription: "Description from AI",
      challengeCategory: category || "Default Category",
      challengeSubCategory: subCategory || "Default Subcategory",
      standardLevel: standardLevel || "Beginner",
      frequence: "Once",
      location: {
        type: locationType || "Point", // Убедитесь, что type передаётся
        coordinates: coordinates || [41.8781, -87.6298], // Убедитесь, что coordinates передаётся
      },
      challengeReward: 60,
      duration: 1,
    };
    setFormData(formData);
    try {
      const token = localStorage.getItem("token");
      console.log("Form data:", formData, "token:", token, coordinates);
      const response = await axios.post(
        "http://localhost:8000/api/v1/challenges",
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const challengeId = response.data.data._id;

      navigate(`/home/${challengeId}`);

      setCategory("");
      setsubCategory("");
      setSubCategoryOptions([]);
      setChallengeTitle("");
      setAddresses(["", ""]);
      e.target.reset();
      navigate(`/home/${challengeId}`);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="mt-15 ">
      <form
        action=""
        className="mt-20 mx-auto flex flex-col justify-center items-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleGetCoordinates();
          handleSubmit(e);
        }}
      >
        <span className="">
          <select
            name="category"
            defaultValue="Pick a category"
            className="select placeholder-gray-500 p-2 text-black bg-white rounded-md mt-8"
            onChange={handleCategory}
          >
            <option disabled={true}>Pick a category</option>
            <option>Movement, Hobby, Sports</option>
            <option>Mindfulness, Focus, Meditation</option>
            <option>Knowledge, Discovery, Geology</option>
            <option>Photography, Creativity, Art</option>
          </select>
        </span>

        <select
          name="sub-category"
          defaultValue="Pick a sub-category"
          className="select placeholder-gray-500 p-2 text-black bg-white rounded-md mt-8 w-[212px]"
          onChange={(e) => {
            setsubCategory(e.target.value);
          }}
        >
          <option disabled>Pick a subcategory</option>
          {subCategoryOptions.map((sub, index) => (
            <option key={index} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        <select
          name="category"
          defaultValue="Beginner"
          className="select placeholder-gray-500 p-2 text-black bg-white rounded-md mt-8 w-[212px]"
          onChange={(e) => {
            setStandardLevel(e.target.value);
          }}
        >
          <option disabled={true}>Pick a Standard Level</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Difficult</option>
        </select>

        <fieldset className="border border-gray-300 rounded-md p-4 mt-8 w-[212px]">
          <legend className="text-lg font-semibold text-white-700">
            Location
          </legend>

          <select
            name="locationType"
            value={locationType}
            className="select placeholder-gray-500 p-2 text-black bg-white rounded-md mt-4 w-full"
            onChange={handleLocationTypeChange}
          >
            <option value="Point">Point</option>
            <option value="Route">Route</option>
          </select>

          {locationType === "Point" ? (
            <input
              type="text"
              placeholder="Address"
              className="placeholder-gray-500 p-2 text-black bg-white rounded-md mt-4 w-full"
              value={addresses[0]}
              onChange={(e) => handleAddressChange(0, e.target.value)}
            />
          ) : (
            addresses.map((address, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Address for Point ${index + 1}`}
                className="placeholder-gray-500 p-2 text-black bg-white rounded-md mt-4 w-full"
                value={address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
              />
            ))
          )}
        </fieldset>

        <button
          type="submit"
          className="bg-green-700 px-4 py-2 rounded-md cursor-pointer mt-4"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateChallenge;
