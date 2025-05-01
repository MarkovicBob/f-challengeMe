import axios from "axios";
import { useState, useEffect } from "react";

function CreateChallenge() {
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
  const [standardLevel, setstandardLevel] = useState("beginner");
  const [locationType, setLocationType] = useState("Point");
  const [coordinates, setCoordinates] = useState([""]);
  const [address, setAddress] = useState("");

  const getCoordinates = async (address) => {
    if (!address || address.trim() === "") {
      throw new Error("Address is required to fetch coordinates.");
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
      );
      const data = response.data;

      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      } else {
        throw new Error("City not found");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error.message);
      throw new Error("Failed to fetch coordinates. Please try again.");
    }
  };

  const challengeDetailBaseObject = {
    challengeTitle: "Create Art from Nature",
    challengeDescription: "Use natural materials to create a piece of art.",
    shortDescription: "Art from nature",
    challengeCategory: "Photography, Creativity, Art",
    challengeSubCategory: "Finding/creating art in nature",
    fitnessLevel: "Beginner",
    frequence: "Once",
    location: {
      type: "Point",
      coordinates: [[41.8781, -87.6298]],
    },
    challengeReward: 60,
    createdBy: "644b1e9f5f1b2c001c8e4d59",
    duration: 1,
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
      setCoordinates([""]);
    } else if (selectedType === "Route") {
      setCoordinates(["", ""]);
    }
  };

  const handleCoordinateChange = async (index, value) => {
    const updatedCoordinates = [...coordinates];
    updatedCoordinates[index] = value;
    setCoordinates(updatedCoordinates);

    try {
      const coords = await getCoordinates(value);
      // console.log(`Coordinates for ${value}:`, coords);
    } catch (error) {
      // console.error(`Failed to fetch coordinates for ${value}:`, error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Category:", category);
    console.log("Subcategory:", subCategory);
    setFormData({
      challengeTitle: challengeTitle,
      challengeDescription: challengeDescription,
      shortDescription: "",
      challengeCategory: category,
      challengeSubCategory: subCategory,
      fitnessLevel: fitnessLevel,
      frequence: "",
      location: {
        type: "Point",
        coordinates: [[41.8781, -87.6298]],
      },
      challengeReward: 60,
      duration: 1,
    });
    setCategory("");
    setsubCategory("");
    setSubCategoryOptions([]);
    setChallengeTitle("");
    e.target.reset();
  };

  useEffect(() => {
    console.log(formData);

    // Post Request with formData here
  }, [formData]);

  return (
    <div className="mt-15 ">
      <form
        action=""
        className="mt-20 mx-auto flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
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
            setFitnessLevel(e.target.value);
          }}
        >
          <option disabled={true}>Pick a Fitness Level</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Difficult</option>
        </select>

        <select
          name="locationType"
          value={locationType}
          className="select placeholder-gray-500 p-2 text-black bg-white rounded-md mt-8 w-[212px]"
          onChange={handleLocationTypeChange}
        >
          <option value="Point">Point</option>
          <option value="Route">Route</option>
        </select>

        {coordinates.map((coordinate, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Coordinate ${index + 1}`}
            className="placeholder-gray-500 p-2 text-black bg-white rounded-md mt-4"
            value={coordinate}
            onChange={(e) => handleCoordinateChange(index, e.target.value)}
          />
        ))}

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
