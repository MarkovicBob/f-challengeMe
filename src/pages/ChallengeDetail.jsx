import MapComponent from "./MapComponent";
import StarButton from "../components/StarButton";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaRepeat } from "react-icons/fa6";
import { GiDuration } from "react-icons/gi";
import { LuCoins } from "react-icons/lu";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { ThemeContext } from "../Context/ThemeContext.jsx";

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
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await axios.get(
          `https://challengeme-server-ra24.onrender.com/api/v1/challenges/${id}`
        );
        const data = res.data.data;
        setChallenge(data);
        setCoordinates(data.location.coordinates);

        const started = localStorage.getItem(`${id}_inProgress`);
        const completed = localStorage.getItem(`${id}_completed`);

        if (started === "true") setChallengeStarted(true);
        if (completed === "true") {
          setChallengeStarted(true);
          setChallengeCompleted(true);
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.message.includes("added")) {
        localStorage.setItem(`${challenge._id}_inProgress`, "true");
        setChallengeStarted(true);
        toast.success("Challenge started.");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Challenge already started.");
      } else {
        console.error("Error starting challenge", err);
      }
    }
  };

  const handleCompleteChallenge = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://challengeme-server-ra24.onrender.com/api/v1/users/${userId}/activeList/${challenge._id}/complete`,
        { status: "completed" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.message.includes("completed")) {
        localStorage.setItem(`${challenge._id}_completed`, "true");
        setChallengeCompleted(true);
        toast.success("Challenge completed.");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Challenge already completed.");
      } else {
        console.error("Error completing challenge", err);
      }
    }
  };

  const toggleDescription = () => setShowDescription((prev) => !prev);

  if (loading) return <p className="mt-15">Loading...</p>;
  if (!challenge) return <p className="mt-15">Challenge not found</p>;

  return (
    <div className={` challenge mt-20 h-[100vh] flex flex-col ${
        theme === "dark" ? "bg-[#292929]" : "bg-[#FFFAF0] text-[#292929]"
      }`}>
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

      <div className="flex flex-col gap-1 px-4">
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
          <StarButton challengeId={challenge._id} disabled={challengeStarted} />
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
          disabled={challengeStarted || challengeCompleted}
        >
          {challengeCompleted
            ? "Completed"
            : challengeStarted
            ? "In Progress"
            : "Start Challenge"}
        </button>

        {challengeStarted && !challengeCompleted && (
          <button
            onClick={handleCompleteChallenge}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Complete
          </button>
        )}

        <button
          onClick={toggleDescription}
          className={`rounded-md p-2 mb-10 ${
        theme === "dark" ? "bg-gray-500" : "bg-gray-300"
      }`}
        >
          {showDescription ? "Show Less" : "View Full Description"}
        </button>

        {showDescription && (
          <div className="challenge-description mb-15">
            <p>{challenge.challengeDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChallengeDetail;
