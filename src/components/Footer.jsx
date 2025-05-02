import React from "react";
import { BiSolidCameraPlus } from "react-icons/bi";
import { FaListAlt, FaPlusSquare } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { ImMap } from "react-icons/im";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const isChallengeDetailPage = /^\/start\/home\/[a-zA-Z0-9]+$/.test(
    location.pathname
  );

  return (
    <div className="fixed bottom-0 z-50 w-full bg-gray-700">
      <div className="flex flex-row justify-around items-center p-2">
        <NavLink
          className={({ isActive }) =>
            isChallengeDetailPage ? "" : isActive ? "active" : ""
          }
          to={"/start/home"}
        >
          <span className="text-3xl ">
            <FaListAlt />
          </span>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          to={"/start/takeaphoto"}
        >
          <span className="text-3xl" to={"/start/home"}>
            <BiSolidCameraPlus />
          </span>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          to={"/start/createchallenge"}
        >
          <span className="text-3xl">
            <FaPlusSquare />
          </span>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          to={"/start/map"}
        >
          <span className="text-3xl">
            <ImMap />
          </span>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          to={"/start/dashboard"}
        >
          <span className="text-3xl">
            <FaCircleUser />
          </span>
        </NavLink>
      </div>
    </div>
  );
}

export default Footer;
