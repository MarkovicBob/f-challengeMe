import StarButton from "../components/StarButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { GoStar, GoStarFill } from "react-icons/go";
import { useNavigate } from "react-router";
import { getCategoryColor, getLevelColor } from "../utils/ColorChange";

function Home() {
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  // const [filled, setFilled] = useState(false);
  // const [filledStars, setFilledStars] = useState({});
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/start/home/${id}`);
  };

  useEffect(() => {
    const challengeData = async () => {
      try {
        const res = await axios.get(
          `https://challengeme-server-ra24.onrender.com/api/v1/challenges`
        );
        // console.log("API Response:", res.data.data);
        setChallenges(res.data.data);
      } catch (error) {
        console.error("Fetching error", error);
      } finally {
        setLoading(false);
      }
    };
    challengeData();
  }, []);

  if (loading) {
    return <div className="mt-15">Loading...</div>;
  }

  return (
    <div className="p-4 mt-13 mb-9">
      {/* <h1 className="text-2xl font-bold mb-4 text-center">Challenges</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <div
            key={challenge._id}
            onClick={() => handleClick(challenge._id)}
            className="border p-4 rounded shadow-sm"
          >
            <img
              src="https://www.bergsteigerschule-watzmann.de/cdn/uploads/bergwandern-lernen-in-berchtesgaden.jpg"
              alt="challenge/image"
              className="w-full h-48 object-cover rounded mb-3"
            />
            <div className="flex flex-row gap-2">
              <p
                className={`basis-2/3 text-m flex items-center justify-start pl-1.5 rounded-sm ${getCategoryColor(
                  challenge.challengeCategory
                )}`}
              >
                {challenge.challengeCategory}
              </p>
              <p
                className={`basis-1/3 text-m flex items-center justify-start pl-1.5 rounded-sm ${getLevelColor(
                  challenge.standardLevel
                )}`}
              >
                {challenge.standardLevel}
              </p>
            </div>
            <div className="flex flex-row justify-between items-center mt-3">
              <h3 className="text-xl font-semibold mb-2">
                {challenge.challengeTitle}
              </h3>
              <div onClick={(e) => e.stopPropagation()}>
                <StarButton challengeId={challenge._id} />
              </div>
            </div>
            <p className="mb-2">{challenge.shortDescription}</p>
            {/* <p>
              <strong>Full Description:</strong>{" "}
              {challenge.challengeDescription}
            </p> */}
            {/* <p><strong>Subcategory:</strong> {challenge.challengeSubCategory}</p> */}
            {/* <p><strong>Fitness Level:</strong> {challenge.fitnessLevel}</p> */}
            {/* <p><strong>Frequency:</strong> {challenge.frequence}</p> */}
            {/* <p><strong>Duration:</strong> {challenge.duration} days</p> */}
            {/* <p><strong>Reward:</strong> {challenge.challengeReward} Points</p> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
