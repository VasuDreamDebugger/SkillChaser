import React from "react";
import Hero from "../../components/Student/Hero";
import Companies from "../../components/Student/Companies";
import CoursesSection from "../../components/Student/CoursesSection";
const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero />
      <Companies />
      <CoursesSection />
    </div>
  );
};

export default Home;
