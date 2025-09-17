import React, { useRef, useState, useEffect } from 'react';
import enrolled from '../../icons/enrolled.svg';
import instructors from '../../icons/instructors.svg';
import active from '../../icons/active.svg';
import complete from '../../icons/complete.svg';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 6; // number of courses per page

const Profiledb = () => {
  const [summary, setSummary] = useState({
    total_enrolled_courses: 0,
    active_courses: 0,
    completed_courses: 0,
    unique_instructors: 0
  });
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/api/student/course-summary/');
        setSummary(res.data);
      } catch (error) {
        console.error("Failed to load course summary", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/student/enrolled-courses/');
        setCourses(res.data);
      } catch (error) {
        console.error("Failed to load enrolled courses", error);
      }
    };

    fetchSummary();
    fetchCourses();
  }, []);

  // --- Pagination logic ---
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

  const paginatedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
    if (totalPages <= 5) return true;
    if (currentPage <= 3) return page <= 5;
    if (currentPage >= totalPages - 2) return page >= totalPages - 4;
    return page >= currentPage - 2 && page <= currentPage + 2;
  });

  return (
    <div className='bg-white shadow-sm p-4'>
      {/* --- Summary cards --- */}
      <div className="mt-6 flex gap-6 text-sm justify-between">
        <div className="bg-[#F1F8FF] py-4 flex rounded w-56">
          <img src={enrolled} alt="Enrolled Courses" className="w-8 h-8 mb-2 my-auto mx-3" />
          <div>
            <p className="text-xl text-[#00113D]">{summary.total_enrolled_courses}</p>
            <p className="text-gray-500 mt-1">Enrolled Courses</p>
          </div>
        </div>
        <div className="bg-[#EBEBFF] py-4 flex rounded w-56">
          <img src={active} alt="Active Courses" className="w-8 h-8 mb-2 my-auto mx-3" />
          <div>
            <p className="text-xl text-[#00113D]">{summary.active_courses}</p>
            <p className="text-gray-500 mt-1">Active Courses</p>
          </div>
        </div>
        <div className="bg-[#E1F7E3] py-4 flex rounded w-56">
          <img src={complete} alt="Completed Courses" className="w-8 h-8 mb-2 my-auto mx-3" />
          <div>
            <p className="text-xl text-[#00113D]">{summary.completed_courses}</p>
            <p className="text-gray-500 mt-1">Completed Courses</p>
          </div>
        </div>
        <div className="bg-[#FFF2E5] py-4 flex rounded w-56">
          <img src={instructors} alt="Instructors" className="w-8 h-8 mb-2 my-auto mx-3" />
          <div>
            <p className="text-xl text-[#00113D]">{summary.unique_instructors}</p>
            <p className="text-gray-500 mt-1">Course Instructors</p>
          </div>
        </div>
      </div>

      {/* --- Courses section --- */}
      <div className="flex justify-between mt-10 mb-6">
        <span className="text-lg font-bold text-[#00113D]">Let’s start learning, Arjun</span>
      </div>

      {/* --- Courses Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedCourses.map((course) => (
          <div key={course.id} className="bg-white shadow overflow-hidden rounded">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/api${course.image}`}
              alt={course.title}
              className="w-full h-36 object-cover"
            />
            <div className="p-4">
              <h4 className="text-sm font-semibold leading-tight mb-1">{course.title}</h4>
              <p className="text-xs text-gray-600 mb-3">{course.lecture}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigate(`/student/watch-course/${course.id}`)}
                  className="text-blue-600 bg-blue-100 text-xs font-medium px-3 py-1 rounded hover:bg-blue-200"
                >
                  Watch Lecture
                </button>
                <span className="text-green-500 text-xs font-semibold">{course.progress} Finish</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Pagination --- */}
      <div className="flex justify-center items-center gap-2 mt-10 mb-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 disabled:opacity-40"
        >
          <FaArrowLeft />
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-full font-medium ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-blue-50 text-[#00113D]'
            } hover:bg-blue-100 flex items-center justify-center`}
          >
            {String(page).padStart(2, '0')}
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
    </div>
  );
};

export default Profiledb;
