import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/Student/Footer";
import Rating from "../../components/Student/Rating";
import { toast } from "react-hot-toast";
import { PlayerLoading } from "../../components/Student/LoadingEffects";
import axios from "axios";

// Helper function to extract YouTube video ID from any full URL
function getYouTubeVideoId(url) {
  // Handles youtube.com, youtu.be, shorts, and playlist formats
  const regex =
    /(?:youtube\.com\/(?:.*v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    getToken,
    userData,
    fetchEnrolledCourses,
  } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);
  const [openNotes, setOpenNotes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        console.log("course data set in player:", course);
        course.courseRatings.map((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating);
          }
        });
      }
    });
    setIsLoading(false);
  };

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses]);

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/update-course-progress",
        { courseId, lectureId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/get-course-progress",
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/add-rating",
        { courseId, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchEnrolledCourses();
      }
    } catch (error) {}
  };

  useEffect(() => {
    getCourseProgress();
  }, []);

  if (isLoading) {
    return <PlayerLoading />;
  }

  return courseData ? (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-10">
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
                              progressData &&
                              progressData.lectureCompleted.includes(
                                lecture.lectureId
                              )
                                ? assets.blue_tick_icon
                                : assets.play_icon
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
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer mt-4"
            onClick={() => setOpenNotes(!openNotes)}
          >
            <img
              src={assets.down_arrow_icon}
              alt="arrow"
              className={`transform transition-transform ${
                openNotes ? "rotate-180" : ""
              }`}
            />
            <p className="font-medium md:text-xl text-lg">Read Notes</p>
          </div>
          <div
            className={`mt-2 text-gray-700 text-md overflow-auto transition-all duration-700 ${
              openNotes ? "max-h-96" : "max-h-0"
            }`}
          >
            {playerData && playerData.lectureNotes ? (
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <p className="text-sm md:text-base whitespace-pre-wrap">
                  {playerData.lectureNotes}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No notes available for this lecture
              </p>
            )}
          </div>
        </div>

        {/* Right section */}
        <div>
          {playerData ? (
            <div>
              {(() => {
                const videoId = getYouTubeVideoId(playerData.lectureUrl);

                if (!videoId) {
                  console.error("Invalid YouTube URL:", playerData.lectureUrl);
                  return (
                    <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded">
                      <p className="text-gray-600">Invalid video URL</p>
                    </div>
                  );
                }

                return (
                  <YouTube
                    videoId={videoId}
                    opts={{
                      playerVars: {
                        autoplay: 1,
                      },
                    }}
                    iframeClassName="w-full aspect-video"
                  />
                );
              })()}
              <div className="flex justify-between items-center mt-2">
                <p className="text-[14px]">
                  {playerData.chapter}.{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>
                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className="text-blue-500"
                >
                  {progressData &&
                  progressData.lectureCompleted.includes(playerData.lectureId)
                    ? "Completed"
                    : "Mark as completed"}
                </button>
              </div>
            </div>
          ) : (
            <img src={courseData ? courseData.courseThumbnail : ""} />
          )}
        </div>
      </div>
    </>
  ) : (
    <PlayerLoading />
  );
};

export default Player;
