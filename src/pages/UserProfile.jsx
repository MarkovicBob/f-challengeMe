import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import { getSubCategoryColor, getLevelColor } from "../utils/ColorChange";
import { FaCheck } from "react-icons/fa6";
import { PiClockCountdownBold } from "react-icons/pi";
import { RiBookmark3Fill, RiBookmark3Line } from "react-icons/ri";
import { toast } from "react-toastify";

function UserProfile() {
  const [userData, setUserData] = useState({
    email: "",
    favoriteList: [],
    activeList: [],
    stats: {
      challengesCompleted: 0,
    },
    profilePictureUrl: "",
  });
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const inputRef = useRef(null);

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

        setUserData({
          email: response.data.data.email,
          favoriteList: response.data.data.favoriteList,
          activeList: response.data.data.activeChallenges,
          stats: {
            challengesCompleted: response.data.data.stats.challengesCompleted,
          },
          profilePictureUrl: response.data.data.profilePictureUrl || "",
        });
      } catch (error) {
        // console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [userId, token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!selectedImage) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `https://challengeme-server-ra24.onrender.com/api/v1/users/${userId}/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response.data);

      // Update user data with new profile picture
      setUserData((prevData) => ({
        ...prevData,
        profilePictureUrl: response.data.user.profilePictureUrl,
      }));

      // Reset form state
      setSelectedImage(null);
      if (inputRef.current) {
        inputRef.current.value = null;
      }
      setPreviewUrl("");
      toast.success("Profile picture updated successfully.");
    } catch (error) {
      // console.error("Upload failed:", error);
      toast.error(
        "Sorry, the file you tried to upload is too large. Max size: 5 MB:",
        error
      );
      setError(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`container mb-4 h-[100vh] pt-[6rem] ${
        theme === "dark" ? "bg-[#292929]" : "bg-[#FFFAF0] text-[#292929]"
      }`}
    >
      <div className="flex flex-row gap-8 justify-between px-8 mt-4">
        <div className="flex flex-col items-center">
          <div
            className="avatar avatar-placeholder"
            onClick={() => inputRef.current && inputRef.current.click()}
          >
            <div className="bg-neutral w-24 rounded-full">
              {previewUrl || userData.profilePictureUrl ? (
                <img
                  src={previewUrl || userData.profilePictureUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Image Upload Form */}
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col items-center justify-center gap-2 mt-4"
          >
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
              ref={inputRef}
              accept="image/*"
              className="hidden"
            />

            {selectedImage && (
              <button
                type="submit"
                className="btn bg-[#8B8989] border-0 shadow-none cursor-pointer active:inset-ring-2"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>

              /* background-color: #8B8989;
    border: none;
    box-shadow: none; */
            )}
          </form>
          <span className="">{userData.email}</span>

          {error && <div className="text-red-500 mt-2">{error}</div>}

          <button
            className="btn mt-4 btn-m bg-[#8B8989] border-0 shadow-none cursor-pointer active:inset-ring-2"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        <div className="stats flex flex-col">
          <label className="swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input
              type="checkbox"
              className="theme-controller"
              value="synthwave"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />

            {/* sun icon */}
            <svg
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>

          <ul className="mt-[1.7rem]">
            <li className="flex">
              <RiBookmark3Line className="mr-2 mt-[0.25rem]" />
              {userData.favoriteList.length} Favourite
            </li>
            <li className="flex">
              {" "}
              <PiClockCountdownBold className="mr-2 mt-[0.28rem]" />
              {
                userData.activeList.filter((challenge) => {
                  return challenge.status === "in-progress";
                }).length
              }{" "}
              Active
            </li>
            <li className="flex">
              <FaCheck className="mr-2 mt-[0.25rem]" />
              {userData.stats.challengesCompleted} Completed
            </li>
          </ul>
        </div>
      </div>

      <div className="tabs tabs-border mt-4 flex flex-row gap-4 px-8">
        <input
          type="radio"
          name="my_tabs_2"
          className="tab"
          aria-label="Favourite"
          defaultChecked
        />
        <div className="tab-content">
          <ul>
            {userData.favoriteList.map((challenge) => {
              return (
                <>
                  <li
                    key={challenge._id}
                    className="flex flex-row gap-4 justify-between mt-2"
                  >
                    <span
                      className={`${getSubCategoryColor(
                        challenge.challengeRefId.challengeSubCategory
                      )} basis-2/3 text-m flex items-center justify-start pl-1.5 rounded-sm`}
                    >
                      {challenge.challengeRefId.challengeTitle}
                    </span>
                    <span
                      className={`${getLevelColor(
                        challenge.challengeRefId.standardLevel
                      )} basis-1/3 text-m flex items-center justify-start pl-1.5 rounded-sm`}
                    >
                      {challenge.challengeRefId.standardLevel}
                    </span>
                  </li>
                </>
              );
            })}
          </ul>
        </div>
        <input
          type="radio"
          name="my_tabs_2"
          className="tab mx-auto"
          aria-label="Active"
        />
        <div className="tab-content">
          <ul>
            {userData.activeList.map((challenge) => {
              if (challenge.status === "in-progress") {
                return (
                  <li
                    key={challenge._id}
                    className="flex flex-row gap-4 justify-between mt-2"
                  >
                    <span
                      className={`${getSubCategoryColor(
                        challenge.challengeRefId.challengeSubCategory
                      )} basis-2/3 text-m flex items-center justify-start pl-1.5 rounded-sm`}
                    >
                      {challenge.challengeRefId.challengeTitle}
                    </span>
                    <span
                      className={`${getLevelColor(
                        challenge.challengeRefId.standardLevel
                      )} basis-1/3 text-m flex items-center justify-start pl-1.5 rounded-sm`}
                    >
                      {challenge.challengeRefId.standardLevel}
                    </span>
                  </li>
                );
              }
            })}
          </ul>
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          className="tab"
          aria-label="Completed"
        />
        <div className="tab-content">
          <ul>
            {userData.activeList.map((challenge) => {
              if (challenge.status === "completed") {
                return (
                  <li
                    key={challenge._id}
                    className="flex flex-row gap-4 justify-between mt-2"
                  >
                    <span
                      className={`${getSubCategoryColor(
                        challenge.challengeRefId.challengeSubCategory
                      )} basis-2/3 text-m flex items-center justify-start pl-1.5 rounded-sm`}
                    >
                      {challenge.challengeRefId.challengeTitle}
                    </span>
                    <span
                      className={`${getLevelColor(
                        challenge.challengeRefId.standardLevel
                      )} basis-1/3 text-m flex items-center justify-start pl-1.5 rounded-sm`}
                    >
                      {challenge.challengeRefId.standardLevel}
                    </span>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
