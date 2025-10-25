import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);
  return (
    <div className="mt-10">
      <h2 className="text-3xl font-medium text-gray-800">
        Learn from the <span className="text-green-600">Best..</span>
      </h2>
      <p className="text-sm md:text-base text-gray-500 mt-3">
        Discover our top-rated courses across various categories.From coding and
        design to Business Development
      </p>
      <div className="grid md:grid-cols-4 sm:grid-cols-2 px-4 md:px-20 md:mt-10 gap-4">
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
      <Link
        to={"/course-list"}
        className="text-blue-600 px-10 py-1 my-3 rounded flex items-center justify-center"
        onClick={() => {
          scrollTo(0, 0);
        }}
      >
        Show all courses
      </Link>
    </div>
  );
};

export default CoursesSection;
