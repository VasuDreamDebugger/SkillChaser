import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { AppContext } from "./AppContext";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import { jwtDecode } from "jwt-decode";
import { toast as toastify } from "react-toastify";
import { toast } from "react-hot-toast";
import axios from "axios";

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourse] = useState([]);
  const [userData, setUserData] = useState(null);
  const { getToken } = useAuth();
  const { user } = useUser();

  //fetch all course
  const fetchAllCourses = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/course/all");
      const { data } = response;
      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toastify.error(data.message);
        console.log("Error fetching courses:", data.message);
      }
    } catch (error) {
      console.log("Error fetching courses:", error);
      toastify.error("Error fetching courses");
    }
  };

  //Fetch user data
  const fetchUserData = async () => {
    try {
      let token = await getToken();
      const response = await axios.get(backendUrl + "/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { data } = response;
      if (data.success) {
        setUserData(data.user);
        toast.success("LoggedIn successfully");
        if (user.publicMetadata.role === "educator") {
          setIsEducator(true);
        }
      } else {
        toastify.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
      toastify.error("Error fetching user data");
    }
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

  //fetch user enrolled courses
  const fetchEnrolledCourse = async () => {
    try {
      let token = await getToken();
      const response = await axios.get(
        backendUrl + "/api/user/enrolled-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response;
      if (data.success) {
        setEnrolledCourse(data.enrolledCourses);
      }
    } catch (error) {
      console.log("Error fetching enrolled courses:", error);
    }
  };

  const logToken = async () => {
    const token = await getToken(); // returns a JWT string
    console.log(token); // just the token string
    const payload = jwtDecode(token);
    console.log(payload);
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (user) {
      logToken();
      fetchUserData();
      fetchEnrolledCourse();
    }
  }, [user]);

  const value = {
    currency,
    allCourses,
    calculateAvgRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOflectures,
    enrolledCourses,
    fetchEnrolledCourses: fetchEnrolledCourse,
    backendUrl,
    userData,
    setUserData,
    fetchAllCourses,
    getToken,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
