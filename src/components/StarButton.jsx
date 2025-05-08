import { useEffect, useState } from "react";
import { RiBookmark3Fill, RiBookmark3Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import { isFavorited, toggleFavorite } from "../api/favorite";

const StarButton = ({ challengeId, disabled }) => {
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
    if (disabled) {
      toast.warning("You cannot favorite a challenge while it's in progress!");
      return;
    }
    setLoading(true);
    try {
      await toggleFavorite(challengeId, favorited);
      toast(
        favorited
          ? "Challenge removed from Favourites!"
          : "Challenge added to Favourites!",
        {
          type: favorited ? "warning" : "success",
        }
      );
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
        <RiBookmark3Line />
      </span>
    );

  return (
    <>
      <button
        onClick={handleClick}
        className="text-yellow-500 text-3xl"
        disabled={disabled}
      >
        {favorited ? <RiBookmark3Fill /> : <RiBookmark3Line />}
      </button>
      <ToastContainer position="top-center" />
    </>
  );
};

export default StarButton;
