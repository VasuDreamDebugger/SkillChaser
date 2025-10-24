import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-20  pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70">
      <h1 className="md:text-[48px] md:leading-[56px]   text-[28px] relative font-bold text-gray-800 max-w-3xl mx-auto">
        Empower your future with the courses designed to
        <span className="relative inline-block text-blue-600 px-2 font-serif italic">
          Fit your choice
          <img
            src={assets.sketch}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-1"
            alt="Sketch underline"
          />
        </span>
      </h1>
      <p className="md:block text-gray-500 md:max-w-2xl max-w-sm mx-auto mt-4">
        We bring together world-class instructors,interactive content, and a
        supportive community to help you achieve your personal and professional
        goals..
      </p>
      <SearchBar />
    </div>
  );
};

export default Hero;
