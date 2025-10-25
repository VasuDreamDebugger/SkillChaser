import React from "react";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0">
      <h1 className="text-xl md:text-4xl text-gray-600 font-semibold">
        Learn <span className="text-blue-600">A</span>nything,{" "}
        <span className="text-blue-600">A</span>nywhere,{" "}
        <span className="text-blue-600">A</span>
        nytime..
      </h1>
      <p className="text-gray-500 sm:text-sm px-19">
        AuralisLMS is a modern learning management system that enables seamless
        course delivery, progress tracking, and student engagement. Designed for
        flexibility and scalability, it empowers educators to manage content and
        assessments with ease.
      </p>
      <div className="flex items-center font-medium gap-6 mt-4">
        <button className="px-5 py-2 rounded-md text-white bg-blue-600 cursor-pointer">
          Get Started
        </button>
        <button className="flex items-center">
          Learn More <img src={assets.arrow_icon} />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
