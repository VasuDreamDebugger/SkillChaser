import React, { useState, useEffect } from "react";
import Hero from "../../components/Student/Hero";
import Companies from "../../components/Student/Companies";
import CoursesSection from "../../components/Student/CoursesSection";
import Testimonials from "../../components/Student/Testimonials";
import CallToAction from "../../components/Student/CallToAction";
import Footer from "../../components/Student/Footer";
import { HomePageLoading } from "../../components/Student/LoadingEffects";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <HomePageLoading />;
  }

  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero />
      <Companies />
      <CoursesSection />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
