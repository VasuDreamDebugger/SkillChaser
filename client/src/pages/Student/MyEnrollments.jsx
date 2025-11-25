import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import EnrollmentCard from "../../components/Student/EnrollmentCard";
import Footer from "../../components/Student/Footer";
const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration } = useContext(AppContext);
  const navigate = useNavigate();
  const [progressArray, setProgressArray] = useState([
    { lecturesCompleted: 2, totalLectures: 4 },
    { lecturesCompleted: 5, totalLectures: 9 },
    { lecturesCompleted: 6, totalLectures: 6 },
    { lecturesCompleted: 1, totalLectures: 6 },
    { lecturesCompleted: 8, totalLectures: 8 },
    { lecturesCompleted: 7, totalLectures: 9 },
    { lecturesCompleted: 4, totalLectures: 7 },
    { lecturesCompleted: 8, totalLectures: 12 },
    { lecturesCompleted: 2, totalLectures: 4 },
  ]);

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
                progressObj={progressArray[index]}
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
