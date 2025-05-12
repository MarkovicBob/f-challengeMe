import logo from "../assets/logo.png";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "../Context/ThemeContext";

function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const pageTitles = {
    "/start/home": "Challenges",
    "/start/createchallenge": "Create Challenge",
    "/start/challengeprogress": "Challenge Progress",
    "/start/map": "Map",
    "/start/takeaphoto": "Take a Photo",
    "/start/dashboard": "User Profile",
    "/onboarding": "Onboarding",
    "/": "Welcome",
  };

  let pageTitle = "Challenge ME";

  if (
    location.pathname.startsWith("/start/home/") &&
    location.pathname.split("/").length === 4
  ) {
    pageTitle = "Challenge Detail";
  } else if (pageTitles[location.pathname]) {
    pageTitle = pageTitles[location.pathname];
  }

  return (
    <>
      <nav
        className={`flex items-center w-full fixed top-[-1px] z-50 border-b-[2px] ${
          theme === "dark"
            ? "text-white bg-[#292929] border-[#686565]"
            : "text-black bg-white border-[#ccc]"
        }`}
      >
        <div className="ml-3 mt-2 mb-2">
          <img className="w-10" src={logo} alt="logo" />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          {pageTitle}
        </div>
        {/* <button onClick={toggleTheme} className="ml-auto mr-4">
          {theme === "dark" ? "🌞" : "🌙"}
        </button> */}
      </nav>
    </>
  );
}

export default Navbar;
