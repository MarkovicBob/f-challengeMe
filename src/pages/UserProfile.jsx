import { useState, useEffect } from "react";
import axios from "axios";

function UserProfile() {
  const [userData, setUserData] = useState({
    email: "",
    favoriteList: [],
    activeList: [],
    stats: {
      challengesCompleted: 0,
    },
  });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://challengeme-server-ra24.onrender.com/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data.stats.challengesCompleted);

        setUserData((prevState) => ({
          ...prevState,
          email: response.data.data.email,
          favoriteList: response.data.data.favoriteList,
          activeList: response.data.data.activeChallenges,
          stats: {
            ...prevState.stats,
            challengesCompleted: response.data.data.stats.challengesCompleted,
          },
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <div className="container mt-[6rem]">
      <div className="flex flex-row gap-8 justify-between px-8 mt-4">
        <div className="flex flex-col">
          <div className="avatar">
            <div className="mask mask-squircle w-24">
              <img src="https://img.daisyui.com/images/profile/demo/distracted1@192.webp" />
            </div>
          </div>

          <button className="btn mt-1.5" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="stats">
          <ul>
            <li>{userData.email}</li>
            Stats:
            <li>{userData.favoriteList.length} Favorite Challenges</li>
            <li>{userData.activeList.length} Active Challenges</li>
            <li>{userData.stats.challengesCompleted} Completed</li>
          </ul>
        </div>
      </div>

      {/* name of each tab group should be unique */}
      <div className="tabs tabs-border px-8 mt-4">
        <input
          type="radio"
          name="my_tabs_2"
          className="tab mr-[auto]"
          aria-label="Active Challenges"
        />
        <div className="tab-content border-base-300 bg-base-100 p-10">
          <ul>
            {userData.activeList.map((challenge) => (
              <li
                key={challenge._id}
                className="flex flex-row gap-4 text-lg justify-between"
              >
                <span>{challenge.challengeRefId.challengeTitle}</span>
                <span>{challenge.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          className="tab"
          aria-label="Favorite Challenges"
          defaultChecked
        />
        <div className="tab-content border-base-300 bg-base-100 p-10">
          <ul>
            {userData.favoriteList.map((challenge) => (
              <li key={challenge._id} className="text-lg">
                {challenge.challengeRefId.challengeTitle}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
