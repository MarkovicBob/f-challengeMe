import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getSubCategoryColor, getLevelColor } from "../utils/ColorChange";

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

        console.log(response.data);

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
        console.error("Error fetching user data:", error);
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

      console.log(response.data);

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
    } catch (error) {
      console.error("Upload failed:", error);
      setError(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-[6rem]">
      <div className="flex flex-row gap-8 justify-between px-8 mt-4">
        <div className="flex flex-col items-center">
          <div className="avatar avatar-placeholder">
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
              className="file-input file-input-bordered w-full max-w-xs"
            />
            {selectedImage && (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Profile Picture"}
              </button>
            )}
          </form>

          {error && <div className="text-red-500 mt-2">{error}</div>}

          <span className="mt-4">{userData.email}</span>

          <button className="btn mt-1.5 btn-m" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="stats">
          <ul>
            <li>{userData.favoriteList.length} Favourite</li>
            <li>{userData.activeList.length} Active</li>
            <li>{userData.stats.challengesCompleted} Completed</li>
          </ul>
        </div>
      </div>

      {/* name of each tab group should be unique */}
      <div className="tabs tabs-border mt-4 flex flex-row gap-4 px-8">
        <input
          type="radio"
          name="my_tabs_2"
          className="tab pl-0"
          aria-label="Favourite"
          defaultChecked
        />
        <div className="tab-content border-base-300 bg-base-100">
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
        <div className="tab-content border-base-300 bg-base-100">
          <ul>
            {userData.activeList.map((challenge) => (
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
            ))}
          </ul>
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          className="tab pr-0"
          aria-label="Completed"
        />
        <div className="tab-content border-base-300 bg-base-100">
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
