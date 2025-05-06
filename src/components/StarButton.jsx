import { useEffect, useState } from "react";
import { GoStar, GoStarFill } from "react-icons/go";
import { isFavorited, toggleFavorite } from "../api/favorite";

const StarButton = ({ challengeId }) => {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFavoriteStatus = async () => {
    setLoading(true);
    try {
      const status = await isFavorited(challengeId);
      setFavorited(status);
    } catch (err) {
      console.error("Greška pri proveri favorita", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteStatus();
  }, [challengeId]);

  const handleClick = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await toggleFavorite(challengeId, favorited);
    } catch (err) {
      if (err.response?.status !== 409) {
        console.error("Greška:", err);
      }
    } finally {
      await fetchFavoriteStatus();
      setLoading(false);
    }
  };

  if (loading)
    return (
      <span className="text-3xl">
        <GoStar />
      </span>
    );

  return (
    <button onClick={handleClick} className="text-yellow-500 text-3xl">
      {favorited ? <GoStarFill /> : <GoStar />}
    </button>
  );
};

export default StarButton;
