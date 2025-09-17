import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // your axios instance

const QuizList = ({ onSelectCourse }) => {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest"); // latest, duration
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const navigate = useNavigate();

  // Fetch evaluated assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/api/student/evaluated-assignments/");
        setAssignments(res.data.evaluated_assignments || []);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    };
    fetchAssignments();
  }, []);

  // Filter + sort
  const filteredAssignments = assignments
    .filter((a) =>
      a.course_title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "latest") return new Date(b.submitted_at) - new Date(a.submitted_at);
      if (sort === "duration") return a.time_taken - b.time_taken;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAssignments.length / perPage);
  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Format time taken (seconds → min:sec)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="p-6 bg-white rounded shadow w-full">
      <h2 className="text-2xl font-semibold mb-4">Evaluated Assignments</h2>

      {/* Search + Sort */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-1/3">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by course title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-3 py-2 border rounded w-full text-sm"
          />
        </div>
        <div>
          <label className="mr-2 text-sm">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="latest">Latest</option>
            <option value="duration">Time Taken</option>
          </select>
        </div>
      </div>

      {/* Assignment List */}
      <div className="w-full border-t border-gray-200">
        {paginatedAssignments.map((a) => (
         <div
  key={a.assignment_id}
  className="flex items-center justify-between py-4 border-b border-gray-200"
>
  {/* Left side - Image + Course details */}
  <div className="flex items-start gap-4">
    {/* Course Image */}
    <img
      src={a.course_image || "/placeholder.png"}
      alt={a.course_title}
      className="w-32 h-20 object-cover rounded"
    />

    {/* Course Info */}
    <div>
      {/* Rating + Reviews (dummy for now, can come from API) */}
      

      {/* Course Title */}
      <p className="font-semibold text-gray-800 text-lg">
        {a.course_title}
      </p>

      {/* Instructor Name */}
      <p className="text-sm text-gray-600">
        Course by: <span className="font-medium">{a.instructor_name}</span>
      </p>
    </div>
  </div>

  {/* Right side - Buttons */}
  <div className="flex gap-2">
    <button
      className="px-4 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200"
      onClick={() => onSelectCourse(a.course_id)} // ✅ call parent
    >
      View Report
    </button>
    <button className="px-4 py-1 border rounded text-sm bg-blue-500 text-white hover:bg-blue-600">
      Retake Test
    </button>
  </div>
</div>

        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default QuizList;
