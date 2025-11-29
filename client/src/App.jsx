import { useState, useEffect } from "react";
import AllRoutes from "./Routes";
import { Routes, Route, useMatch } from "react-router-dom";
import NavBar from "./components/Student/NavBar";
import { Toaster, toast } from "react-hot-toast";
import "quill/dist/quill.snow.css";
import { ToastContainer, toast as toastify } from "react-toastify";
const App = () => {
  const isEducator = useMatch("/educator/*");

  // Ping server on app mount to verify client-server connectivity during development

  return (
    <div className="min-h-screen bg-white text-default">
      <Toaster />
      <ToastContainer />
      {!isEducator ? <NavBar /> : ""}
      <AllRoutes />
    </div>
  );
};

export default App;
