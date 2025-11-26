import { useState, useEffect } from "react";
import AllRoutes from "./Routes";
import { Routes, Route, useMatch } from "react-router-dom";
import NavBar from "./components/Student/NavBar";
import { Toaster, toast } from "react-hot-toast";
import "quill/dist/quill.snow.css";
const App = () => {
  const isEducator = useMatch("/educator/*");

  // Ping server on app mount to verify client-server connectivity during development
  useEffect(() => {
    const ping = async () => {
      try {
        const res = await fetch("/api/ping");
        const json = await res.json();
        console.log("Server ping response:", json);
      } catch (err) {
        console.error("Failed to reach server /api/ping", err);
      }
    };
    ping();
  }, []);
  return (
    <div className="min-h-screen bg-white text-default">
      <Toaster />
      {!isEducator ? <NavBar /> : ""}
      <AllRoutes />
    </div>
  );
};

export default App;
