import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const Assessments = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate(); // ✅ hook for navigation

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/instructor/courses/");
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-white shadow-sm px-6 py-8">
      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white shadow-md rounded hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/instructor/assessment-Evaluation/${course.id}`)} // ✅ navigate with courseId
          >
            <img
              src={course.course_image || "/fallback.jpg"}
              alt={course.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <div className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded inline-block mb-2 uppercase">
                {course.category?.name || "General"}
              </div>

              <h3 className="text-md font-semibold text-gray-800 mb-2 truncate">
                {course.title}
              </h3>

              <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                <span className="text-orange-500 mr-1">
                  ★{course.average_rating?.toFixed(1) || "0.0"}
                </span>
                <span className="ml-4 mr-1">
                  👥{course.enrolled_students_count?.toLocaleString() || 0} students
                </span>
              </div>

              <div className="text-sm font-bold">
                <span className="text-blue-700">
                  ₹{parseFloat(course.price || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assessments;
