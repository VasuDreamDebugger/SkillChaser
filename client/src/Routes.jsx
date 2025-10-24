import { Routes, Route } from "react-router-dom";
import Home from "./pages/Student/Home";
import CoursesList from "./pages/Student/CoursesList";
import CourseDetails from "./pages/Student/CourseDetails";
import MyEnrollments from "./pages/Student/MyEnrollments";
import Loading from "./components/Student/Loading";
import Player from "./pages/Student/Player";
import Educator from "./pages/Educator/Educator";
import Dashboard from "./pages/Educator/Dashboard";
import AddCourse from "./pages/Educator/AddCourse";
import MyCourses from "./pages/Educator/MyCourses";
import StudentsEnrolled from "./pages/Educator/StudentsEnrolled";
const AllRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/course-list" element={<CoursesList />} />
    <Route path="/course-list/:input" element={<CoursesList />} />
    <Route path="/course/:id" element={<CourseDetails />} />
    <Route path="/my-enrollments" element={<MyEnrollments />} />
    <Route path="/player/:courseId" element={<Player />} />
    <Route path="/loading/:path" element={<Loading />} />
    <Route path="/educator" element={<Educator />}>
      <Route path="educator" element={<Dashboard />} />
      <Route path="add-course" element={<AddCourse />} />
      <Route path="my-courses" element={<MyCourses />} />
      <Route path="student-enrolled" element={<StudentsEnrolled />} />
    </Route>
  </Routes>
);

export default AllRoutes;
