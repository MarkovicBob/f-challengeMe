import StarButton from "../components/StarButton";
import axios from "axios";
import mapa from "../assets/mapa.jpg";
import { useEffect, useState } from "react";
import { FaRepeat } from "react-icons/fa6";
import { GiDuration, GiMeditation, GiPaintBrush } from "react-icons/gi";
import { GoStar, GoStarFill } from "react-icons/go";
import { LuCoins } from "react-icons/lu";
import { MdCategory, MdOutlineSportsGymnastics } from "react-icons/md";
import { PiStepsBold } from "react-icons/pi";
import { TbGeometry } from "react-icons/tb";
import { useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import MapComponent from "./MapComponent";

import {
  getCategoryColor,
  getLevelColor,
  getSubCategoryColor,
} from "../utils/ColorChange";

function ChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await axios.get(
          `https://challengeme-server-ra24.onrender.com/api/v1/challenges/${id}`
        );
        setChallenge(res.data.data);
        console.log(res.data.data.location.coordinates[0][0]);
        setCoordinates(res.data.data.location.coordinates);
        const storedStatus = localStorage.getItem(`${id}_inProgress`);
        if (storedStatus === "true") {
          setChallengeStarted(true);
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [id]);

  const handleStartChallenge = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://challengeme-server-ra24.onrender.com/api/v1/users/${userId}/activeList/${challenge._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Challenge started:", res.data);
      if (
        res.data.message === "Successfully added challenge to active challenges"
      ) {
        localStorage.setItem(`${challenge._id}_inProgress`, "true");
        setChallengeStarted(true);
        return toast.success("Challenge succsessfully started.");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        return toast.error("Challenge already started.");
      } else {
        console.error("Error starting challenge", err);
      }
    }
  };

  const toggleDescription = () => {
    setShowDescription((prevState) => !prevState);
  };

  if (loading) return <p className="mt-15">Loading...</p>;
  if (!challenge) return <p className="mt-15">Challenge not found</p>;

  console.log(coordinates[0]);
  return (
    <div className="challenge mt-20 h-[100vh] flex flex-col ">
      <div className="w-full mb-3 overflow-hidden">
        {coordinates.length > 0 && coordinates[0]?.length === 2 ? (
          <MapComponent
            coordinates={{ lat: coordinates[0][0], lng: coordinates[0][1] }}
            isInteractive={false}
            zoomLevel={10}
            hideControls={true}
          />
        ) : (
          <p>Loading map...</p>
        )}
      </div>
      <div className="flex flex-col gap-1  px-4">
        <p
          className={`w-[70px] text-m text-center rounded-sm ${getLevelColor(
            challenge.standardLevel
          )}`}
        >
          {challenge.standardLevel}
        </p>
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-2xl font-extrabold mb-2 pt-4">
            {challenge.challengeTitle}
          </h3>
          <div className="favorite-container mt-[15px]">
            <StarButton
              challengeId={challenge._id}
              disabled={challengeStarted}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 px-4">
        <p
          className={`flex basis-2/3 pl-1.5 text-m text-center rounded-sm ${getCategoryColor(
            challenge.challengeCategory
          )}`}
        >
          {challenge.challengeCategory}
        </p>
        <p
          className={`flex basis-1/3 text-m justify-start pl-1.5 rounded-sm ${getSubCategoryColor(
            challenge.challengeSubCategory
          )}`}
        >
          {challenge.challengeSubCategory}
        </p>
      </div>

      <p className="pt-3 pb-5 px-4">{challenge.shortDescription}</p>

      <div className="flex flex-row items-center justify-evenly pt-4">
        <p className="flex flex-row items-center gap-2">
          <FaRepeat /> {challenge.frequence}
        </p>
        <p className="flex flex-row items-center gap-2">
          <GiDuration /> {challenge.duration}
        </p>
        <p className="flex flex-row items-center gap-2">
          <LuCoins /> {challenge.challengeReward} Points
        </p>
      </div>
      <div className="flex flex-col justify-around text-center p-4 gap-4 mt-5">
        <button
          onClick={handleStartChallenge}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={challengeStarted}
        >
          {challengeStarted ? "In Progress" : "Start Challenge"}
        </button>

        <button
          onClick={toggleDescription}
          className="bg-gray-500 rounded-md p-2 mb-10"
        >
          {showDescription ? "Show Less" : "View Full Description"}
        </button>

        {showDescription && (
          <div className="challenge-description mb-15">
            <p>{challenge.challengeDescription}</p>
          </div>
        )}
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default ChallengeDetail;
