import React from "react";
import { FaQuestion } from "react-icons/fa6";
import { FaList } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { FaMapLocation } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const isChallengeDetailPage = /^\/start\/home\/[a-zA-Z0-9]+$/.test(
    location.pathname
  );

  return (
    <div className="fixed bottom-0 z-50 w-full bg-[#42a200]">
      <div className="flex flex-row justify-between items-center p-4 ml-6 mr-6">
        <NavLink
          className={({ isActive }) =>
            isChallengeDetailPage ? "" : isActive ? "active" : ""
          }
          to={"/start/home"}
        >
          <span className="text-4xl ">
            <FaList />
          </span>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          to={"/start/createchallenge"}
        >
          <span className="text-4xl">
            <FaPlus />
          </span>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          to={"/start/map"}
        >
          <span className="text-4xl">
            <FaMapLocation />
          </span>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          to={"/start/dashboard"}
        >
          <span className="text-3xl">
            <FaUser />
          </span>
        </NavLink>
      </div>
    </div>
  );
}

export default Footer;
