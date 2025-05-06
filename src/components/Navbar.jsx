import logo from "../assets/logo.png";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

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
      <nav className="flex items-center w-full bg-gray-700 fixed top-0 z-50">
        <div className="ml-1 mt-1">
          <img className="w-15" src={logo} alt="logo" />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          {pageTitle}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
