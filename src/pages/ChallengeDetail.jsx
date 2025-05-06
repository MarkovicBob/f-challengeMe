import StarButton from "../components/StarButton";
import axios from "axios";
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

import {
  getCategoryColor,
  getLevelColor,
  getSubCategoryColor,
} from "../utils/ColorChange";

function ChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await axios.get(
          `https://challengeme-server-ra24.onrender.com/api/v1/challenges/${id}`
        );
        setChallenge(res.data.data);
        // console.log(res.data.data);
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

  if (loading) return <p className="mt-15">Loading...</p>;
  if (!challenge) return <p className="mt-15">Challenge not found</p>;

  return (
    <div className="mt-20 p-2 max-h-screen ">
      <img
        src="https://www.bergsteigerschule-watzmann.de/cdn/uploads/bergwandern-lernen-in-berchtesgaden.jpg"
        alt="challenge/image"
        className="w-full h-48 object-cover rounded mb-3"
      />
      <div className="flex flex-row gap-4">
        <p
          className={`basis-2/3 text-m flex items-center justify-center text-center rounded-sm ${getCategoryColor(
            challenge.challengeCategory
          )}`}
        >
          {challenge.challengeCategory}
        </p>
        <p
          className={`basis-1/3 text-m flex items-center justify-center text-center rounded-sm ${getLevelColor(
            challenge.standardLevel
          )}`}
        >
          {challenge.standardLevel}
        </p>
      </div>
      <p
        className={`text-m text-center rounded-sm ${getSubCategoryColor(
          challenge.challengeSubCategory
        )}`}
      >
        {challenge.challengeSubCategory}
      </p>
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-2xl font-extrabold mb-2 pt-4">
          {challenge.challengeTitle}
        </h3>
        <div className="favorite-container">
          <StarButton challengeId={challenge._id} />
        </div>
      </div>

      <p className="mb-2">{challenge.shortDescription}</p>
      {/* <p>
        <strong>Full Description:</strong> {challenge.challengeDescription}
      </p> */}
      <div className="flex flex-row items-center justify-evenly pt-4">
        <img className="w-35 rounded-3xl" src="/src/assets/map.jpg" alt="map" />
        <div>
          <p className="flex flex-row items-center gap-2">
            <FaRepeat /> {challenge.frequence}
          </p>
          <p className="flex flex-row items-center gap-2">
            <GiDuration /> {challenge.duration} days
          </p>
          <p className="flex flex-row items-center gap-2">
            <LuCoins /> {challenge.challengeReward} Points
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-around text-center p-4 gap-3">
        <button
          onClick={handleStartChallenge}
          className={
            "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          }
        >
          Start Challenge
        </button>
        <button className="bg-gray-500 rounded-md p-2 mb-10">
          View full Description
        </button>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default ChallengeDetail;
