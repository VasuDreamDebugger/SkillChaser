import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/Student/Footer";
import Youtube from "react-youtube";
import toast from "react-hot-toast";
import { CourseDetailsLoading } from "../../components/Student/LoadingEffects";

import axios from "axios";
const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const navigate = useNavigate();
  const {
    allCourses,
    currency,
    calculateAvgRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOflectures,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);
  const [rating, setRating] = useState(null);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message || "Failed to fetch course data");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData) {
        toast.error("Please login to enroll in the course");
        return;
      }
      if (isAlreadyEnrolled) {
        navigate(`/player/${id}`);
      }
      if (!id) {
        toast.error("Course ID not found");
        return;
      }

      const token = await getToken();
      console.log("Enrollment initiated for course ID:", id);

      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        { courseId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Enrollment data:", data);

      if (data.success) {
        const sessionUrl = data.session_url || data.sessionUrl;
        if (sessionUrl) {
          window.location.replace(sessionUrl);
        } else {
          console.error("No session URL returned from server", data);
          toast.error("No session URL received from server");
        }
      } else {
        toast.error(data.message || "Failed to enroll in course");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to enroll"
      );
    }
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

  useEffect(() => {
    if (courseData && userData) {
      if (courseData.enrolledStudents.includes(userData._id)) {
        setIsAlreadyEnrolled(true);
      }
    }
  }, [courseData, userData]);

  return courseData ? (
    <>
      <div className="flex md:flex-row  flex-col-reverse gap-10 relative items-start justify-between md:px-20 px-8  md:pt-10 pt-20 text-left">
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
            {courseData?.enrolledStudents?.length} Students Enrolled in this
            Course
          </p>
          <p className="text-base mt-2">
            Course offered by{" "}
            <span className="text-blue-400 underline">
              {courseData.educator.name}
            </span>
          </p>
          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">
              {courseData?.courseContent?.map((chapter, index) => (
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
                                <p
                                  className="text-blue-500 cursor-pointer"
                                  onClick={() => {
                                    setPlayerData({
                                      videoId: lecture.lectureUrl
                                        .split("/")
                                        .pop(),
                                    });
                                  }}
                                >
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
        <div className="max-w-[500px] z-10 shadow-[5px_5px_15px_5px] shadow-cyan-100 rounded-t md:rounded overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
          {playerData ? (
            <Youtube
              videoId={playerData.videoId}
              opts={{
                playerVars: {
                  autoplay: 1,
                },
              }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="" />
          )}
          <div className="p-5">
            <div className="flex items-center gap-2">
              <img src={assets.time_left_clock_icon} alt="time left" />
              <p className="text-red-500 text-sm">
                <span>5 Days</span> only left at this Price!
              </p>
              {/* <p className="text-[17px] transform text-orange-600 hover:scale-105">
              Grab Now 🙋‍♂️
            </p> */}
            </div>

            <div className="flex gap-3 items-center pt-2">
              <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                {currency}
                {(
                  courseData.coursePrice -
                  courseData.discount * (courseData.coursePrice / 100)
                ).toFixed(2)}
              </p>
              <p className="md:text-lg text-gray-500">
                {currency}
                <span className="line-through">
                  {courseData.coursePrice + " "}
                </span>
                %Off
              </p>
            </div>
            <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star" />
                <p>{rating}</p>
              </div>

              <div className="h-5 w-px bg-gray-500/40"></div>

              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="star" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>

              <div className="h-5 w-px bg-gray-500/40"></div>

              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="star" />
                <p>{calculateNoOflectures(courseData)} lessons</p>
              </div>
            </div>
            <button
              onClick={enrollCourse}
              className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium cursor-pointer"
            >
              {isAlreadyEnrolled
                ? "Already Enrolled Learn Now"
                : "Enroll Now 🙋"}
            </button>
            <div className="pt-4">
              <h1 className="md:text-xl text-lg font-medium text-gray-800">
                What's in this course?
              </h1>
              <ul className="ml-4 pt-2 text-sm md:text-[13px] list-disc text-gray-500">
                <li>2 years access with free updates</li>
                <li>Step-by-step, hands-on project guidance</li>
                <li>Downloadable resource and source code </li>
                <li>Quizzess to test your knowledgement</li>
                <li>Certificates of Completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <CourseDetailsLoading />
  );
};

export default CourseDetails;
