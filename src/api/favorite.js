import axios from "axios";

const API_URL = "https://challengeme-server-ra24.onrender.com/api/v1/users";

const getToken = () => localStorage.getItem("token");
const getUserId = () => localStorage.getItem("userId");

export const isFavorited = async (challengeId) => {
  const res = await axios.get(`${API_URL}/${getUserId()}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const favoriteList = res.data.data.favoriteList;

  return favoriteList.some((item) => {
    const favId = item.challengeRefId._id || item.challengeRefId;
    return favId.toString() === challengeId.toString();
  });
};

export const toggleFavorite = async (challengeId, currentlyFavorited) => {
  const config = {
    headers: { Authorization: `Bearer ${getToken()}` },
  };
  const url = `${API_URL}/${getUserId()}/favoriteList/${challengeId}`;

  if (currentlyFavorited) {
    await axios.delete(url, config);
  } else {
    await axios.post(url, {}, config);
  }
};
