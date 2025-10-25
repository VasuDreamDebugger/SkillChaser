import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { SignIn, useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext.js";

const NavBar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { isEducator } = useContext(AppContext);
  const isCourseListPage = location.pathname.includes("/course-list");
  return (
    <div
      className={`flex items-center justify-between px-5 border-b border-gray-500 py-3 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 lg:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div>
        {/* For Desktop view */}
        <div className="hidden md:flex items-center gap-5 text-gray-500">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/educator")}>
              {isEducator ? "Educator Dashboard" : "Become Educator"}{" "}
            </button>
            |<Link to="/my-enrollments"> My Enrollments</Link>
          </div>
          {user ? (
            <UserButton />
          ) : (
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-white hover:text-blue-600"
              onClick={() => openSignIn()}
            >
              Get Account
            </button>
          )}
        </div>

        {/* For Mobile view */}
        <div className="flex md:hidden items-center gap-2 text-gray-600 ">
          <div className="flex items-center gap-2">
            <button>Become Educator </button>|
            <Link to="/my-enrollments"> My Enrollments</Link>
          </div>
          {user ? (
            <UserButton />
          ) : (
            <button onClick={() => openSignIn()}>
              <img src={assets.user_icon} alt="userIcon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
