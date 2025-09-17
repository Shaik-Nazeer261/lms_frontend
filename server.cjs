const express = require('express');
const path = require('path');
const app = express();

const distPath = path.join(__dirname, 'dist');
const indexFile = path.join(distPath, 'index.html');

// Serve static assets
app.use(express.static(distPath));

// List all your frontend routes here:
const routes = [
  "/", 
  "/courses",
  "/launch",
  "/about",
  "/contact",
  "/career",
  "/career/:id",
  "/become-instructor",

  // Student Auth
  "/student/login",
  "/student/signup",
  "/student/forgot-password",
  "/student/reset-password/:uid/:token",

  // Student Protected
  "/student/dashboard",
  "/student/cart",
  "/student/profile",
  "/student/profile-dashboard",
  "/student/watch-course/:id",
  "/student/final-quiz/:id",

  // Course details
  "/course-details/:id",

  // Instructor Auth + Dashboard
  "/instructor/login",
  "/instructor/dashboard",
  "/instructor/my_courses",
  "/instructor/create_course",
  "/instructor/account-settings",
  "/instructor/faqs",
  "/instructor/privacy",
  "/instructor/desclaimer",
  "/instructor/notifications",
  "/instructor/terms",
  "/instructor/messages",
  "/instructor/course-details/:id",
  "/instructor/assessments",
  "/instructor/approvals",
  "/instructor/assessment-Evaluation/:courseId",
  "/instructor/course-review",

  // Admin
  "/admin/login",
  "/admin/createjob",
  "/admin/jobs",
  "/admin/jobs/:id/applications",
  "/admin/dashboard",
  "/admin/admincourseview/:courseId",
  "/admin/approvals",
  "/admin/suggestions",
];


// Redirect each route to index.html so React can handle it
routes.forEach((route) => {
  app.get(route, (req, res) => {
    res.sendFile(indexFile);
  });
});

// Start the server
const PORT = process.env.PORT || 3110;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
