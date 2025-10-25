import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateAvgRating } = useContext(AppContext);
  const { courseThumbnail, courseTitle, educator, coursePrice, discount } =
    course;
  const rating = calculateAvgRating(course);
  return (
    <Link
      to={"/course/" + course._id}
      className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg transform transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
      onClick={() => {
        scrollTo(0, 0);
      }}
    >
      <img src={courseThumbnail} alt="course" className="w-full" />
      <div className="p-3 text-left">
        <h3 className="text-base font-semibold">{courseTitle}</h3>
        <p className="text-gray-500">{educator.name}</p>
        <div className="flex items-center space-x-2">
          <p className="text-yellow-700">{rating}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                alt="star"
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <p className="text-gray-500">{course.courseRatings.length}</p>
        </div>
        <p className="text-base font-semibold text-gray-800">
          {currency + " "}
          {(coursePrice - discount * (coursePrice / 100)).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
