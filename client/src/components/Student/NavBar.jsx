import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { SignIn, useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext.js";
import axios from "axios";
import { toast } from "react-hot-toast";

const NavBar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { isEducator, getToken, setIsEducator, backendUrl } =
    useContext(AppContext);
  const isCourseListPage = location.pathname.includes("/course-list");

  const becomeEducator = async () => {
    console.log("become edu clicked");
    try {
      if (user.publicMetadata.role === "educator") {
        navigate("/educator");
      } else {
        const token = await getToken();
        const { data } = await axios.post(
          backendUrl + "/api/educator/update-role",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.message) {
          setIsEducator(true);
          toast.success(data.message || "You are now an educator");
          navigate("/educator");
        } else {
          toast.error(data.error || "Failed to become educator");
        }
      }
    } catch (error) {
      console.log("Error in becoming educator:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Error in becoming educator";
      toast.error(errorMsg);
    }
  };
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
            <button onClick={() => becomeEducator()}>
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
            <button onClick={() => becomeEducator()}>Become Educator </button>|
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
