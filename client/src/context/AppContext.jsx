import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { AppContext } from "./AppContext";
import humanizeDuration from "humanize-duration";

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);

  //fetch all course
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  //calculate Avg rating

  const calculateAvgRating = (course) => {
    const { courseRatings } = course;

    {
      let totalRatings = 0;
      let l = 0;
      courseRatings.forEach((rating) => {
        totalRatings += rating.rating;
        l += 1;
      });

      if (l == 0) return 0;
      return totalRatings / l;
    }
  };

  //Function to calculate course chapter Time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    console.log(time);
    const du = humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
      language: "en",
    });
    console.log(du);
    return du;
  };
  //Function to Calculate Course duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  //Function to calculate No of lectures in course

  const calculateNoOflectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const value = {
    currency,
    allCourses,
    calculateAvgRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOflectures,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
