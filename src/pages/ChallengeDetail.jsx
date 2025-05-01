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

function ChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filled, setFilled] = useState(false);

  // const getCategoryIcon = (category) => {
  //   switch (category) {
  //     case "Movement, Hobby, Sports":
  //       return <MdOutlineSportsGymnastics />;
  //     case "Mindfulness, Focus, Meditation":
  //       return <GiMeditation />;
  //     case "Knowledge, Discovery, Geology":
  //       return <TbGeometry />;
  //     case "Photography, Creativity, Art":
  //       return <GiPaintBrush />;
  //   }
  // };

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await axios.get(
          `https://challengeme-server-ra24.onrender.com/api/v1/challenges/${id}`
        );
        setChallenge(res.data.data);
      } catch (error) {
        console.error("Error fetching challenge:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [id]);

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
        <p className=" bg-green-600 basis-2/3 text-m flex items-center justify-center text-center rounded-sm">
          {/* {getCategoryIcon(challenge.challengeCategory)} */}
          {challenge.challengeCategory}
        </p>
        <p className="bg-yellow-600 basis-1/3 text-center rounded-sm gap-3">
          {challenge.fitnessLevel}
        </p>
      </div>
      <p>
        {/* <MdCategory /> */}
        {challenge.challengeSubCategory}
      </p>
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-2xl font-extrabold mb-2 pt-4">
          {challenge.challengeTitle}
        </h3>
        <p className="text-3xl" onClick={() => setFilled(!filled)}>
          {filled ? <GoStarFill /> : <GoStar />}
        </p>
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
      <div className="flex flex-col justify-around text-center p-4">
        <button className="bg-green-900 rounded-md p-2 mb-4">
          Start Challenge
        </button>
        <button className="bg-gray-500 rounded-md p-2 mb-10">
          View full Description
        </button>
      </div>
    </div>
  );
}

export default ChallengeDetail;
