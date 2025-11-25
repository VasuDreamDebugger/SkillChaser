import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/Educator/NavBar";
import SideBar from "../../components/Educator/SideBar";

const Educator = () => {
  return (
    <div className="min-h-screen text-default bg-white">
      <NavBar />
      <div className="flex">
        <SideBar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Educator;
