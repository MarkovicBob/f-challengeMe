import StarButton from "../components/StarButton";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { GoStar, GoStarFill } from "react-icons/go";
import { useNavigate } from "react-router";
import { getCategoryColor, getLevelColor } from "../utils/ColorChange";
import { ThemeContext } from "../Context/ThemeContext.jsx";
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  // const [filled, setFilled] = useState(false);
  // const [filledStars, setFilledStars] = useState({});
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const handleClick = (id) => {
    navigate(`/start/home/${id}`);
  };

  useEffect(() => {
    const challengeData = async () => {
      try {
        const res = await axios.get(
          `https://challengeme-server-ra24.onrender.com/api/v1/challenges`
        );

        console.log("API Response:", res.data.data);
        setChallenges([...res.data.data].reverse());
      } catch (error) {
        console.error("Fetching error", error);
      } finally {
        setLoading(false);
      }
    };
    challengeData();
    AOS.init({ duration: 1000 });
  }, []);

  if (loading) {
    return <div className="mt-15">Loading...</div>;
  }
  const handleStarButtonClick = (e) => {
    e.stopPropagation();
    setIsButtonLoading(true); // Set button as loading when clicked

    // Simulate AI data processing or some async logic
    setTimeout(() => {
      // Assuming some async operation here (like saving or fetching AI data)
      setIsButtonLoading(false); // Reset button loading after operation
      // You can add your custom logic here for AI processing
    }, 2000); // Simulate a 2-second delay
  };

  return (
    <div
      className={` px-4 mt-13 mb-20 ${
        theme === "dark" ? "bg-[#292929]" : "bg-[#FFFAF0]"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <div
            key={challenge._id}
            onClick={() => handleClick(challenge._id)}
            data-aos="zoom-in"
            className={` border-b-[2px] py-4 ${
              theme === "dark"
                ? "bg-[#292929] shadow-sm  border-[#DCDCDC]"
                : "bg-[FFFAF0] text-[#292929] border-[#292929]"
            }`}
          >
            <img
              src={challenge.imageUrl}
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
              <div onClick={(e) => handleStarButtonClick(e, challenge._id)}>
                {/* Conditionally render button content based on loading state */}
                {isButtonLoading ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  <StarButton challengeId={challenge._id} />
                )}
              </div>
            </div>
            <p className="mb-2">{challenge.shortDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
