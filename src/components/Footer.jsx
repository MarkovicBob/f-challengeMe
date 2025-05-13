import React, { useContext } from "react";
import { FaQuestion, FaList, FaUser, FaMapLocation } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { ThemeContext } from "../Context/ThemeContext.jsx";

function Footer() {
  const location = useLocation();
  const isChallengeDetailPage = /^\/start\/home\/[a-zA-Z0-9]+$/.test(location.pathname);
  const { theme } = useContext(ThemeContext);

  const iconWrapperStyle = `w-14 h-14 rounded-xl flex items-center justify-center ${theme === "dark" ? "bg-[#292929]" : "bg-[#FFFAF0]"}`;

  return (
    <div className="fixed bottom-0 z-50 w-full h-20 bg-[#42a200]">
      <div className="flex flex-row justify-between items-center p-3 ml-8 mr-8">
        <NavLink
          className={({ isActive }) =>
            isChallengeDetailPage ? "" : isActive ? "active" : ""
          }
          to={"/start/home"}
        >
          <div className={iconWrapperStyle}>
            <FaList className={` text-3xl ${
        theme === "dark" ? "bg-[#292929]" : "bg-[FFFAF0] text-[#292929]"}`}/>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          to={"/start/createchallenge"}
        >
          <div className={iconWrapperStyle}>
            <FaPlus className={` text-3xl ${
        theme === "dark" ? "bg-[#292929]" : "bg-[FFFAF0] text-[#292929]"}`}/>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          to={"/start/map"}
        >
          <div className={iconWrapperStyle}>
            <FaMapLocation className={` text-3xl ${
        theme === "dark" ? "bg-[#292929]" : "bg-[FFFAF0] text-[#292929]"}`}/>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          to={"/start/dashboard"}
        >
          <div className={iconWrapperStyle}>
            <FaUser className={` text-3xl ${
        theme === "dark" ? "bg-[#292929]" : "bg-[FFFAF0] text-[#292929]"}`}/>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default Footer;
