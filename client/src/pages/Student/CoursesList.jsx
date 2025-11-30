import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "../../components/Student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/Student/Footer";
import { CourseListLoading } from "../../components/Student/LoadingEffects";

// Skeleton loader component
const SkeletonCard = () => (
  <div className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg animate-pulse">
    <div className="bg-gray-300 w-full h-40" /> {/* Thumbnail placeholder */}
    <div className="p-3 text-left space-y-2">
      <div className="h-5 bg-gray-300 rounded w-3/4" /> {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-1/2" /> {/* Educator name */}
      <div className="flex items-center space-x-2">
        <div className="h-4 bg-gray-300 rounded w-6" /> {/* Rating number */}
        {/* <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 bg-gray-300 rounded" />
          ))}
        </div> */}
        <div className="h-4 bg-gray-200 rounded w-6" /> {/* Rating count */}
      </div>
      <div className="h-5 bg-gray-300 rounded w-1/3" /> {/* Price */}
    </div>
  </div>
);

const CoursesList = () => {
  const { input } = useParams();
  const { allCourses } = useContext(AppContext);
  const [courseInput, setCourseInput] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullPageLoader, setShowFullPageLoader] = useState(true);

  const getFilteredCourse = () => {
    setLoading(true);
    setTimeout(() => {
      if (courseInput) {
        const filtered = allCourses.filter((eachCourse) =>
          eachCourse.courseTitle
            .toLowerCase()
            .includes(courseInput.toLowerCase())
        );
        setFilteredCourses(filtered);
      } else {
        setFilteredCourses(allCourses);
      }
      setLoading(false);
    }, 1500); // 1.5 seconds delay
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFullPageLoader(false);
      getFilteredCourse();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getFilteredCourse();
  }, [courseInput, allCourses]);

  const courseInputHandler = (e) => {
    e.preventDefault();
    getFilteredCourse();
  };

  if (showFullPageLoader) {
    return <CourseListLoading />;
  }

  return (
    <>
      <div className="relative md:px-20 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div className="flex flex-col gap-2">
            <h1>Course List</h1>
            <p>
              <Link to="/" className="text-blue-600 cursor-pointer">
                Home
              </Link>
              / <Link>Course list</Link>
            </p>
          </div>

          <form
            onSubmit={courseInputHandler}
            className="max-w-xl w-full md:h-14 h-12 p-0 flex items-center bg-white border border-gray-500/20 rounded"
          >
            <img
              src={assets.search_icon}
              alt="Search"
              className="md:w-auto w-10 px-3"
            />
            <input
              type="text"
              placeholder="Search for Courses.."
              className="w-full h-full outline-none text-gray-500/80"
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 rounded text-white md:px-10 px-7 md:py-2 py-1 mx-1 cursor-pointer hover:bg-gray-200 hover:text-blue-600"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      {courseInput && (
        <div className="inline-flex items-center gap-4 px-3 ml-20 py-2 border rounded mt-8 text-gray-700">
          <p>{courseInput}</p>
          <img
            src={assets.cross_icon}
            alt="cross"
            className="cursor-pointer"
            onClick={() => setCourseInput("")}
          />
        </div>
      )}

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-20 gap-5 px-2 md:px-20">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : filteredCourses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;
