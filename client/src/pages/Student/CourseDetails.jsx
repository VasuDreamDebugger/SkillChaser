import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const {
    allCourses,
    calculateAvgRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOflectures,
  } = useContext(AppContext);
  const [rating, setRating] = useState(null);

  const fetchCourseData = async () => {
    const course = allCourses.find((each) => each._id === id);
    //console.log(course);
    if (!course) return;
    setRating(calculateAvgRating(course));
    // console.log(rating);
    setCourseData(course);
  };

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (allCourses.length > 0) {
      fetchCourseData();
    }
  }, [allCourses]);

  return courseData ? (
    <div className="flex md:flex-row  flex-col-reverse gap-10 relative items-start justify-between md:px-15 px-8  md:pt-10 pt-20 text-left">
      <div className="absolute top-0 left-0 w-full h-[500px] z-1 bg-gradient-to-b from-cyan-100/90"></div>
      {/* Left section */}
      <div className="max-w-xl z-10 text-gray-500">
        <h1 className="md:text-[36px] text-[26px] font-semibold text-gray-700">
          {courseData.courseTitle}
        </h1>
        <p
          className="pt-4 text-base text-sm"
          dangerouslySetInnerHTML={{
            __html: courseData.courseDescription.slice(0, 200),
          }}
        ></p>
        {/* reviews and ratingss */}
        <div className="flex items-center space-x-2 my-2">
          <p className="text-red-500">{rating}</p>
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
          <p></p>
          <p className="text-gray-500 ">
            {courseData.courseRatings.length}
            {courseData.courseRatings.length > 1 ? " ratings" : " rating"}
          </p>
        </div>
        <p>
          {courseData.enrolledStudents.length} Students Enrolled in this Course
        </p>
        <p className="text-base mt-2">
          Course offered by{" "}
          <span className="text-blue-400 underline">VasuDreamAchiever</span>
        </p>
        <div className="pt-8 text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">
            {courseData.courseContent.map((chapter, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-white/70 mb-2 rounded hover:scale-100"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none "
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={assets.down_arrow_icon}
                      alt="arrow"
                      className={`transform transition-transform ${
                        openSection[index] ? "rotate-180" : ""
                      }`}
                    />
                    <p className="font-medium md:text-base text-sm">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className="text-md md:text-[14px]">
                    {chapter.chapterContent.length} lectures -{" "}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                {/* lectures section */}
                <div
                  className={`overflow-hidden transition-all duration-700   ${
                    openSection[index] ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex items-center gap-2 py-1 ">
                        <img
                          src={assets.play_icon}
                          alt="play"
                          className="w-4 h-4 mt-1"
                        />
                        <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-[13px]">
                          <p>{lecture.lectureTitle}</p>
                          <div className="flex gap-2">
                            {lecture.isPreviewFree && (
                              <p className="text-blue-500 cursor-pointer">
                                preview
                              </p>
                            )}
                            <p>
                              {humanizeDuration(
                                lecture.lectureDuration * 60 * 1000,
                                { units: ["h", "m"] }
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-20 text-sm md:text-default">
          <h3 className="text-xl font-semibold text-gray-700">
            Course Description
          </h3>
          <p
            className="pt-3 rich-text"
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
          ></p>
        </div>
      </div>

      {/* Right section */}
    </div>
  ) : (
    "loading"
  );
};

export default CourseDetails;
