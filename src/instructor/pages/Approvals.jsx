import React, { useEffect, useState } from "react";
import api from "../../api"; // ✅ your axios instance
import { useNavigate } from "react-router-dom";

const Approvals = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [sort, page]);

  const fetchCourses = async () => {
    try {
      const res = await api.get(
        `/api/instructor/courses/?page=${page}&sort=${sort}&search=${search}`
      );
      setCourses(res.data.results || res.data);
      setTotalPages(res.data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handlePublishToggle = async (id, isPublished) => {
    try {
      if (isPublished) {
        await api.post(`/courses/${id}/unpublish/`);
      } else {
        await api.post(`/courses/${id}/publish/`);
      }
      fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Course Review</h1>

      {/* Search + Sort */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search the course"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchCourses()}
          className="border rounded px-3 py-2 max-w-md"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-3 py-2 w-40"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between p-4 border rounded-md shadow-sm"
          >
            <div className="flex items-center gap-4">
              <img
                src={course.course_image}
                alt={course.title}
                className="w-20 h-16 object-cover rounded-md"
              />
              <div>
                <h2 className="font-semibold">{course.title}</h2>
                <p className="text-sm text-gray-500">
                  Course by {course.instructor_name || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button className="px-4 py-2 border rounded hover:bg-gray-100"
               onClick={() => {
            navigate("/instructor/create_course", {
              state: {
                courseId: course.id,
                activeTab: "basic",
              },
            });
          }}
              >
                View Course
              </button>

              {/* ✅ Approval Status */}
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  course.is_approved
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {course.is_approved ? "Approved" : "Pending"}
              </span>

              
            </div>
          </div>
        ))}

        {filteredCourses.length === 0 && (
          <p className="text-gray-500 text-center">No courses found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{`Page ${page} of ${totalPages}`}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Approvals;
