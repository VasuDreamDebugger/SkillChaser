import React, { useState, useContext, useEffect } from "react";
import { dummyStudentEnrolled } from "../../assets/assets";
import Loading from "../../components/Student/Loading";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const { backendUrl, getToken, isEducator } = useContext(AppContext);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      if (!isEducator) {
        toast.error("You are not authorized to view this page.");
        return;
      }
      const { data } = await axios.get(
        backendUrl + `/api/educator/enrolled-students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Enrolled students data", data);
      data.success && setEnrolledStudents(data.enrolledStudents.reverse());
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
      toast.error("Failed to fetch enrolled students.");
    }
  };

  useEffect(() => {
    isEducator && fetchEnrolledStudents();
  }, [isEducator]);
  return enrolledStudents ? (
    <div className="min-h-screen flex flex-col items-start gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <h1 className="text-base text-gray-600 text-bold text-[20px]">
        Enrolled Students
      </h1>
      <div
        className="flex flex-col items-center max-w-4xl w-full overflow-hidden
         rounded-md bg-white border border-gray-500/20 "
      >
        <table className="table-fixed md:table-auto w-full overflow-hidden">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center sm:table-cell ">
                #
              </th>
              <th className="px-4 py-3 font-semibold">Student Name</th>

              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="px-4 py-3 font-semibold">Enrolled Date</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  {index + 1}
                </td>
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3 ">
                  <img
                    src={item.student.imageUrl}
                    alt="profile"
                    className="w-9 h-9 rounded-full"
                  />
                  <span className="truncate">{item.student.name}</span>
                </td>
                <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                <td className="px-4 py-3 truncate hidden md:table-cell">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;
