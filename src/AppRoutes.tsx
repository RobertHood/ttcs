import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Learning from './pages/Learning';
import Profile from './pages/Profile';
import RegisterCourse from './pages/RegisterCourse';
import Course from './pages/Course';
import ForgotPassword from './pages/ForgotPassword';
import CourseRegistrationForm from './pages/CourseRegisForm';
import CourseDetail from './pages/CourseDetail';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/learn" element={<Learning />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/course" element={<Course />} />
      <Route path="/registercourse" element={<RegisterCourse />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/course-regis" element={<CourseRegistrationForm />} />
      <Route path="/course/:id" element={<CourseDetail />} />
    </Routes>
  );
}