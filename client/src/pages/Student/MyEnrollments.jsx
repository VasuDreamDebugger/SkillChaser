import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import EnrollmentCard from "../../components/Student/EnrollmentCard";
import Footer from "../../components/Student/Footer";
import axios from "axios";
const MyEnrollments = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    fetchEnrolledCourses,
    backendUrl,
    getToken,
    userData,
    calculateNoOflectures,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [progressArray, setProgressArray] = useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const response = await axios.post(
            backendUrl + `/api/user/get-course-progress`,
            { courseId: course._id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { data } = response;

          let totalLectures = calculateNoOflectures(course);
          const lecturesCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;

          return { totalLectures, lecturesCompleted };
        })
      );
      setProgressArray(tempProgressArray);
    } catch (error) {
      console.log("Error fetching course progress:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchEnrolledCourses();
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10 mb-50">
        <h1 className="text-2xl font-semibold"> My Enrollments</h1>
        <table className="md:table-[500px] p-10 table-fixed w-full overflow-hidden border mt-10">
          <thead className="text-gray-900 border-b border-gray-500/2 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold text-lg truncate">
                Course
              </th>
              <th className="px-4 py-3 font-semibold text-lg truncate">
                Duration
              </th>
              <th className="px-4 py-3 font-semibold text-lg truncate">
                Completed
              </th>
              <th className="px-4 py-3 font-semibold text-lg truncate">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700  gap-3 transform transition-all ease-in-out p-4">
            {enrolledCourses.map((course, index) => (
              <EnrollmentCard
                key={index}
                progressObj={
                  progressArray[index] || {
                    totalLectures: 0,
                    lecturesCompleted: 0,
                  }
                }
                course={course}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;
