import React, { useEffect, useRef, useState } from "react";
import search from "../../icons/search.svg";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 20;

const Mycourses = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [draftCourses, setDraftCourses] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [deletedCourse, setDeletedCourse] = useState(null);
const undoTimeoutRef = useRef(null);


  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [publishedRes, draftRes] = await Promise.all([
          api.get("/api/instructor/courses/"),
          api.get("/api/instructor/draft-courses/"),
        ]);
        setPublishedCourses(publishedRes.data);
        setDraftCourses(draftRes.data);
        setCourses(publishedRes.data); // Default to published
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };

    fetchCourses();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

 const handleDeleteCourse = async (courseId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this course?");

  if (!confirmDelete) return;

  try {
    const courseToDelete =
      publishedCourses.find(c => c.id === courseId) ||
      draftCourses.find(c => c.id === courseId);

    await api.delete(`/api/delete-course/${courseId}/`);

    // Optimistically remove the course from all views
    setPublishedCourses(prev => prev.filter(c => c.id !== courseId));
    setDraftCourses(prev => prev.filter(c => c.id !== courseId));
    setCourses(prev => prev.filter(c => c.id !== courseId));

    // Save deleted course for undo
    setDeletedCourse(courseToDelete);

    // Start timeout to clear undo after 10 seconds
    undoTimeoutRef.current = setTimeout(() => {
      setDeletedCourse(null);
    }, 10000);
  } catch (error) {
    console.error("Delete failed", error);
    alert("Failed to delete the course.");
  }
};


const handleUndoDelete = async () => {
  try {
    if (!deletedCourse) return;

    await api.post(`/api/courses/${deletedCourse.id}/restore/`);

    const updatedCourses = [...courses, deletedCourse];
    setCourses(updatedCourses);
    
    // Add back to published/draft depending on type
    if (deletedCourse.is_published) {
      setPublishedCourses(prev => [...prev, deletedCourse]);
    } else {
      setDraftCourses(prev => [...prev, deletedCourse]);
    }

    setDeletedCourse(null);
    clearTimeout(undoTimeoutRef.current);
  } catch (error) {
    console.error("Restore failed", error);
    alert("Failed to restore the course.");
  }
};



  return (
    <div className="bg-white shadow-sm px-6 py-8">
      <div className="mb-6">
        <h2 className="font-semibold text-lg text-[#00113D] mb-2">
          Courses ({courses.length})
        </h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              courses === publishedCourses
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => {
              setCourses(publishedCourses);
              setCurrentPage(1);
            }}
          >
            Published ({publishedCourses.length})
          </button>
          <button
            className={`px-4 py-2 rounded ${
              courses === draftCourses
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => {
              setCourses(draftCourses);
              setCurrentPage(1);
            }}
          >
            Drafts ({draftCourses.length})
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="text-sm text-gray-500 mb-2 block">Search:</label>
            <div className="relative">
              <img
                src={search}
                alt="search"
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search in your courses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Sort by:</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Latest</option>
              <option>Oldest</option>
              <option>Name A-Z</option>
              <option>Name Z-A</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Status:</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Courses</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Not Started</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Rating:</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Teachers</option>
              <option>Arjun</option>
              <option>Leslie</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedCourses.map((course) => (
          <div
            key={course.id}
            className={`relative bg-white shadow-md rounded hover:shadow-lg transition-shadow duration-300 ${
              !course.is_published ? "cursor-pointer" : ""
            }`}
            onClick={() => {
              if (!course.is_published) {
                navigate("/instructor/create_course", {
                  state: {
                    courseId: course.id,
                    activeTab: "basic", // or 'advance', 'curriculum' etc. if needed
                  },
                });
              }
            }}
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

              {/* Draft Progress Bar */}
              {!course.is_published && (
                <div className="mb-3" title="Creation Progress">
                  <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
                    <span>Creation Progress</span>
                    <span>{course.creation_progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${course.creation_progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                <span className="text-orange-500 mr-1">
                  ★{course.average_rating?.toFixed(1) || "0.0"}
                </span>
                <span className="ml-4 mr-1">
                  👥{course.enrolled_students_count?.toLocaleString() || 0}{" "}
                  students
                </span>
              </div>

              <div className="text-sm font-bold mb-3 flex items-center justify-between">
                <span className="text-blue-700">
                  ₹{parseFloat(course.price || 0).toFixed(2)}
                </span>

                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === course.id ? null : course.id
                      )
                    }
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    ⋯
                  </button>

                  {activeDropdown === course.id && (
                    <div className="absolute bottom-full mt-2 w-40 bg-white border border-gray-200 shadow-md rounded z-[999]">
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
                        onClick={() =>
                          navigate(`/instructor/course-details/${course.id}`)
                        }
                      >
                        View Details
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          console.log("Edit", course.id);
                          navigate("/instructor/create_course", {
                            state: {
                              courseId: course.id,
                              activeTab: "basic", // or 'advance', 'curriculum', etc.
                            },
                          });
                        }}
                      >
                        Edit Course
                      </button>
                     <button
  className="w-full text-left px-4 py-2 text-sm hover:bg-red-100"
  onClick={() => handleDeleteCourse(course.id)}
>
  Delete Course
</button>

                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 disabled:opacity-40"
          >
            <FaArrowLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              if (totalPages <= 5) return true;
              if (currentPage <= 3) return page <= 5;
              if (currentPage >= totalPages - 2) return page >= totalPages - 4;
              return page >= currentPage - 2 && page <= currentPage + 2;
            })
            .map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full font-medium ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-blue-50 text-[#00113D]"
                } hover:bg-blue-100 flex items-center justify-center`}
              >
                {String(page).padStart(2, "0")}
              </button>
            ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 disabled:opacity-40"
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {deletedCourse && (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-blue-500 shadow-lg px-6 py-3 rounded-full flex items-center gap-4 z-50">
    <span className="text-sm text-gray-700">
      Course <strong>{deletedCourse.title}</strong> deleted.
    </span>
    <button
      className="text-blue-600 font-semibold hover:underline"
      onClick={handleUndoDelete}
    >
      Undo
    </button>
  </div>
)}

    </div>
  );
};

export default Mycourses;
