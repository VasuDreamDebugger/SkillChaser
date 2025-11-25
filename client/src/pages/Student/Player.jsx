import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/Student/Footer";
import Rating from "../../components/Student/Rating";

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [openSection, setOpenSection] = useState({});

  const getCourseData = () => {
    const selectedCourse = enrolledCourses.find(
      (course) => course._id === courseId
    );
    setCourseData(selectedCourse);
  };

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    getCourseData();
  }, [enrolledCourses]);
  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-30">
        {/* Left section */}
        <div className="text-gray-800">
          <h1 className="text-xl font-semibold">Course Structure</h1>
          <div className="pt-5">
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
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
                            src={
                              false ? assets.blue_tick_icon : assets.play_icon
                            }
                            alt="play"
                            className="w-4 h-4 mt-1 cursor-pointer"
                            onClick={() => {
                              setPlayerData({
                                ...lecture,
                                chapter: index + 1,
                                lecture: i + 1,
                              });
                            }}
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-[13px]">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.lectureUrl && (
                                <p
                                  className="text-blue-500 cursor-pointer"
                                  onClick={() => {
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    });
                                  }}
                                >
                                  watch
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
          <div className="flex items-center gap-2 py-3 mt-10">
            <h1>Rate this Course :</h1>
            <Rating initialRating={0} />
          </div>
        </div>

        {/* Right section */}
        <div>
          {playerData ? (
            <div>
              <YouTube
                videoId={playerData.lectureUrl.split("/").pop()}
                opts={{
                  playerVars: {
                    autoplay: 1,
                  },
                }}
                iframeClassName="w-full aspect-video"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-[14px]">
                  {playerData.chapter}.{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>
                <button className="text-blue-500">
                  {false ? "completed" : "Mark as completed"}
                </button>
              </div>
            </div>
          ) : (
            <img src={courseData ? courseData.courseThumbnail : ""} />
          )}
        </div>
      </div>
    </>
  );
};

export default Player;
