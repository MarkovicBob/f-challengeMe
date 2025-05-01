import Link from "daisyui/components/link";
import axios from "axios";
import { useEffect, useState } from "react";

function Home() {
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const challengeData = async () => {
      try {
        const res = await axios.get(
          `https://challengeme-server-ra24.onrender.com/api/v1/challenges`
        );
        // console.log('API Response:', res.data.data);
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
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 mt-13 mb-9">
      {/* <h1 className="text-2xl font-bold mb-4 text-center">Challenges</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <div key={challenge._id} className="border p-4 rounded shadow-sm">
            <img
              src="https://www.bergsteigerschule-watzmann.de/cdn/uploads/bergwandern-lernen-in-berchtesgaden.jpg"
              alt="challenge/image"
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h3 className="text-xl font-semibold mb-2">
              {challenge.challengeTitle}
            </h3>
            <p className="mb-2">
              <strong>Short Description:</strong> {challenge.shortDescription}
            </p>
            <p className="mb-2">
              <strong>Category:</strong> {challenge.challengeCategory}
            </p>
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
