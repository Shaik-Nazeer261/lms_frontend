import React, { useEffect, useState } from 'react';
import search from '../../icons/search.svg';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import api from '../../api';
import { useNavigate } from 'react-router-dom';


const ITEMS_PER_PAGE = 20;

const ProfileCourses = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/student/enrolled-courses/');
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching enrolled courses", error);
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

  return (
    <div className="bg-white shadow-sm px-6 py-8">
      <div className="mb-6">
        <h2 className="font-semibold text-lg text-[#00113D] mb-2">
          Courses ({courses.length})
        </h2>

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
            <label className="text-sm text-gray-500 mb-2 block">Teacher:</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Teachers</option>
              <option>Arjun</option>
              <option>Leslie</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedCourses.map((course) => (
          <div key={course.id} className="bg-white shadow overflow-hidden">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${course.image}` || "/fallback.jpg"}
              alt={course.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h4 className="text-sm font-semibold mb-1 truncate">{course.title}</h4>
              <p className="text-xs text-gray-600 mb-3 truncate">{course.lecture}</p>
              <div className="flex justify-between items-center">
                <button
  onClick={() => navigate(`/student/watch-course/${course.id}`)}
  className="text-blue-600 bg-blue-100 text-xs font-medium px-3 py-1 rounded hover:bg-blue-200"
>
  Watch Lecture
</button>

                <span className="text-green-600 text-xs font-semibold">{course.progress}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

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
      )}
    </div>
  );
};

export default ProfileCourses;
