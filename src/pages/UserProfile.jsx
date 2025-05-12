import axios from "axios";
import { useEffect, useState } from "react";

function UserProfile() {
  const [userData, setUserData] = useState({
    email: "",
    favoriteList: [],
    activeList: [],
    stats: {
      challengesCompleted: 0,
    },
  });

  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" || !savedTheme;
  });

  const toggleTheme = (e) => {
    const isChecked = e.target.checked;
    const newTheme = isChecked ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setIsDark(isChecked);
  };

  useEffect(() => {
    const root = document.documentElement;
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
  }, [isDark]);

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

        <div className="stats flex flex-col">
          <label className="toggle theme-controller text-base-content mt-4 w-15 h-9">
            <input
              type="checkbox"
              checked={isDark}
              onChange={toggleTheme}
              className="theme-controller "
            />
            <svg
              aria-label="sun"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </g>
            </svg>
            <svg
              aria-label="moon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </g>
            </svg>
          </label>
          <ul>
            <li>{userData.email}</li>
            Stats:
            <li>{userData.favoriteList.length} Favorite Challenges</li>
            <li>{userData.activeList.length} Active Challenges</li>
            <li>{userData.stats.challengesCompleted} Completed</li>
          </ul>
        </div>
      </div>

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
