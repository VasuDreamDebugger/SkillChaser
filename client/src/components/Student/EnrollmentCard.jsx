import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Line } from "rc-progress";

const EachEnrollemet = (props) => {
  const { calculateCourseDuration } = useContext(AppContext);
  const { progressObj = { totalLectures: 0, lecturesCompleted: 0 }, course } =
    props;
  const navigate = useNavigate();
  const totalLectures = progressObj.totalLectures || 0;
  const lecturesCompleted = progressObj.lecturesCompleted || 0;
  const isLecturesCompleted =
    totalLectures > 0 && lecturesCompleted / totalLectures === 1;
  const completionPercentage =
    totalLectures > 0
      ? Math.floor((lecturesCompleted / totalLectures) * 100)
      : 0;
  console.log(completionPercentage);
  return (
    <tr
      className="border border-gray-500/80 hover:scale-100  hover:text-xl cursor-pointer"
      onClick={() => navigate("/player/" + course._id)}
    >
      <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
        <img
          src={course.courseThumbnail}
          alt=""
          className="w-14 sm:w-24 md:w-28 rounded"
        />
        <div className="flex-1">
          <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
        </div>
      </td>
      <td className="px-4 py-3 max-sm:hidden">
        {calculateCourseDuration(course)}
      </td>
      <td className="px-4 py-3 max-sm:hidden pl-10">
        {`${progressObj.lecturesCompleted} / ${progressObj.totalLectures}`}
        <Line
          percent={completionPercentage}
          strokeWidth={3}
          strokeColor={
            completionPercentage < 40
              ? "#f53f3fff" // red-700
              : completionPercentage < 75
              ? "#2563eb" // blue-600
              : "#15803d" // green-700
          }
        />
      </td>
      <td className="px-4 py-3 max-sm:text-right">
        <button
          className={`cursor-pointer  font-semibold text-white h-md w-auto p-1 rounded ${
            isLecturesCompleted ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          {isLecturesCompleted ? "Completed 😎" : "On Going✌️"}
        </button>
      </td>
    </tr>
  );
};

export default EachEnrollemet;
