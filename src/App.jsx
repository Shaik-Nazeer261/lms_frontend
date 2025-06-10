import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Common
import MainLayout from "./common/layouts/MainLayout.jsx";
import Home from "./common/pages/Home.jsx";

// Student
import StudentLogin from "./student/auth/Login.jsx";
import StudentSignup from "./student/auth/Signup.jsx";
import StudentLayout from "./student/layouts/StudentLayout.jsx";
import StudentDashboard from "./student/pages/Dashboard.jsx";
import ForgotPassword from "./student/auth/ForgotPassword.jsx";
import ResetPassword from "./student/auth/ResetPassword.jsx";
import CourseGrid from "./common/pages/courses.jsx";
import Cart from "./student/pages/Cart.jsx";
import Profile from "./student/pages/Profile.jsx";
import Profiledb from "./student/components/profiledb.jsx";
import CourseDetails from "./student/pages/CourseDetails.jsx";
import About from "./common/pages/About.jsx";
import Contact from "./common/pages/Contact.jsx";
import NotFoundPage from "./common/pages/NotFoundPage.jsx";
import Launch from "./common/pages/Launch.jsx";
import Career from "./common/pages/Career.jsx";
import BecomeInstructor from "./common/pages/BecomeInstructor.jsx";
import Layout from "./instructor/layouts/InstructorLayout.jsx";
import MyCourses from "./instructor/pages/MyCourses.jsx";
import CreateCourse from "./instructor/pages/CreateCourse.jsx";
import WatchCourse from "./student/pages/WatchCourse.jsx";
import AccountSettings from "./instructor/pages/Settings.jsx";
import Login from "./instructor/auth/Login.jsx";
import Dashboard from "./instructor/pages/Dashboard.jsx";
import AdminCreateJobs from "./admin/components/AdminCreateJobs.jsx";
import AdminJobs from "./admin/components/AdminJobs.jsx";
import SpecificJobPage from "./common/pages/SpecificJobPage.jsx";
import AdminApplications from "./admin/components/AdminApplications.jsx";
import CoursePlayer from "./instructor/pages/CourseReview.jsx";
import Faqs from "./instructor/pages/Faqs.jsx";
import PrivacyPolicy from "./instructor/pages/PrivacyPolicy.jsx";
import Disclaimer from "./instructor/pages/Desclaimer.jsx";
import TermsAndConditions from "./instructor/pages/Terms&Conditions.jsx";
import Message from "./instructor/pages/Message.jsx";
import CourseDetail from "./instructor/pages/CourseDetail.jsx";

// Instructor
// import InstructorLogin from "./instructor/auth/Login";
// import InstructorSignup from "./instructor/auth/Signup";
// import InstructorLayout from "./instructor/layouts/InstructorLayout";
// import InstructorDashboard from "./instructor/pages/Dashboard";

// Admin
import AdminLogin from "./admin/auth/Login.jsx";
import AdminLayout from "./admin/layouts/AdminLayout.jsx";
import AdminDashboard from "./admin/pages/Dashboard.jsx";
import AdminCourseDetail from "./admin/pages/ViewCourse.jsx";
import NotificationPanel from "./instructor/pages/NotificationPanel.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public shared home page */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/courses"
          element={
            <MainLayout>
              <CourseGrid />
            </MainLayout>
          }
        />
        
        <Route path="/launch" element={<Launch />} />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />

        <Route
          path="/career"
          element={
            <MainLayout>
              <Career />
            </MainLayout>
          }
        />

        <Route
          path="/career/:id"
          element={
            <MainLayout>
              <SpecificJobPage />
            </MainLayout>
          }
        />

        <Route
          path="/become-instructor"
          element={
            <MainLayout>
              <BecomeInstructor />
            </MainLayout>
          }
        />

        {/* Student Auth */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/student/reset-password/:uid/:token"
          element={<ResetPassword />}
        />

        {/* Instructor Auth */}
        {/* Instructor Auth */}
        <Route path="/instructor/login" element={<Login />} />
        {/* <Route path="/instructor/signup" element={<InstructorSignup />} /> */}
        <Route
          path="/instructor/dashboard"
          element={
            <Layout title="Dashboard">
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/instructor/my_courses"
          element={
            <Layout title="My Courses">
              <MyCourses />
            </Layout>
          }
        />
        <Route
          path="/instructor/create_course"
          element={
            <Layout title="Create a new course">
              <CreateCourse />
            </Layout>
          }
        />
        <Route
          path="/instructor/account-settings"
          element={
            <Layout title="Settings">
              <AccountSettings />
            </Layout>
          }
        />
        <Route
          path="/instructor/faqs"
          element={
            <Layout title="Faqs">
              <Faqs />
            </Layout>
          }
        />
        <Route
          path="/instructor/privacy"
          element={
            <Layout title="privacy">
              <PrivacyPolicy />
            </Layout>
          }
        />

        <Route
          path="/instructor/desclaimer"
          element={
            <Layout title="desclaimer">
              <Disclaimer />
            </Layout>
          }
        />

        <Route
          path="/instructor/notifications"
          element={
            <Layout title="Notifications">
              <NotificationPanel />
            </Layout>
          }
        />

        <Route
          path="/instructor/terms"
          element={
            <Layout title="terms&conditions">
              <TermsAndConditions />
            </Layout>
          }
        />

        <Route
          path="/instructor/messages"
          element={
            <Layout title="Message">
              <Message />
            </Layout>
          }
        />
        <Route
          path="/instructor/course-details/:id"
          element={
            <Layout title="Course Details">
              <CourseDetail />
            </Layout>
          }
        />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="createjob" element={<AdminCreateJobs />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="jobs/:id/applications" element={<AdminApplications />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route
            path="admincourseview/:courseId"
            element={<AdminCourseDetail />}
          />
        </Route>
        <Route
          path="/instructor/course-review"
          element={
            <Layout title="Create a new course">
              <CoursePlayer />
            </Layout>
          }
        />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* <Route path="/admin/signup" element={<AdminSignup />} /> */}

        {/* Role-based Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/student/dashboard"
            element={
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            }
          />
          <Route
            path="/student/cart"
            element={
              <StudentLayout>
                <Cart />
              </StudentLayout>
            }
          />
          <Route
            path="/student/profile"
            element={
              <StudentLayout>
                <Profile />
              </StudentLayout>
            }
          />
          <Route
            path="/student/profile-dashboard"
            element={
              <StudentLayout>
                <Profiledb />
              </StudentLayout>
            }
          />
          <Route
            path="/student/watch-course/:id"
            element={
              <StudentLayout>
                <WatchCourse />
              </StudentLayout>
            }
          />
          <Route
          path="/course-details/:id"
          element={
            <MainLayout>
              <CourseDetails />
            </MainLayout>
          }
        />



       
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
