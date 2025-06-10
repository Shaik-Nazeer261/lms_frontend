import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [activeCourseCount, setActiveCourseCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
const [selectedCourseId, setSelectedCourseId] = useState(null);
const [disapprovalReason, setDisapprovalReason] = useState("");


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // Add inside the component
const [instructors, setInstructors] = useState([]);
const [pendingCourses, setPendingCourses] = useState([]);


const fetchInstructors = async () => {
  try {
    const res = await api.get("/api/instructors/"); // Adjust the URL if different
    setInstructors(res.data);
  } catch (err) {
    console.error("Error fetching instructors:", err);
  }
};

const fetchPendingCourses = async () => {
  try {
    const res = await api.get("/api/admin/pending-courses/");
    setPendingCourses(res.data);
  } catch (err) {
    console.error("Error fetching pending courses:", err);
  }
};


useEffect(() => {
  const token = localStorage.getItem("access");
  const email = localStorage.getItem("admin_email");

  if (!token) {
    navigate("/");
  } else {
    setAdminEmail(email);
    fetchActiveCourses();
    fetchInstructors(); // 👈 add this
    fetchPendingCourses(); // Add this
  }
}, [navigate]);


  const fetchActiveCourses = async () => {
    try {
      const res = await api.get("/api/instructor/courses/");
      const active = res.data.filter((course) => course.creation_progress === 100);
      setActiveCourseCount(active.length);
    } catch (err) {
      console.error("Error fetching instructor courses:", err);
    }
  };

 

 

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/add_teacher/", formData);
      setMessage({ type: "success", text: response.data.message || "Instructor added successfully!" });
      setFormData({ username: "", email: "", first_name: "", last_name: "" });
      setShowModal(false);
    } catch (error) {
      const err = error.response?.data || {};
      const errMsg = Object.values(err).flat().join(" ") || "Something went wrong.";
      setMessage({ type: "error", text: errMsg });
    }
  };

  const handleCourseAction = async (courseId, action, updateData = {}) => {
  try {
    const res = await api.post(`/api/admin/course/${courseId}/action/`, {
      action,
      ...updateData
    });

    setMessage({ type: "success", text: res.data.message });
    fetchPendingCourses(); // Refresh list
  } catch (error) {
    const err = error.response?.data || {};
    const errMsg = Object.values(err).flat().join(" ") || "Something went wrong.";
    setMessage({ type: "error", text: errMsg });
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
       

       

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-6 text-center shadow">
            <h2 className="text-xl font-semibold text-blue-800">Active Courses</h2>
            <p className="text-3xl font-bold text-blue-700 mt-2">{activeCourseCount}</p>
          </div>
        </div>

        {/* Instructors Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-blue-500">Manage Instructors</h3>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Add Instructor
            </button>
          </div>

          {message.text && (
            <div
              className={`p-3 rounded text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <ul className="list-disc list-inside text-gray-700 mt-6 space-y-2 pl-4">
  {instructors.length === 0 ? (
    <p className="text-gray-500">No instructors found.</p>
  ) : (
    <table className="w-full table-auto border mt-2 text-left">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-3 py-2 border">#</th>
          <th className="px-3 py-2 border">Username</th>
          <th className="px-3 py-2 border">Email</th>
          <th className="px-3 py-2 border">First Name</th>
          <th className="px-3 py-2 border">Last Name</th>
        </tr>
      </thead>
      <tbody>
        {instructors.map((inst, idx) => (
          <tr key={inst.id || idx}>
            <td className="px-3 py-2 border">{idx + 1}</td>
            <td className="px-3 py-2 border">{inst.username}</td>
            <td className="px-3 py-2 border">{inst.email}</td>
            <td className="px-3 py-2 border">{inst.first_name}</td>
            <td className="px-3 py-2 border">{inst.last_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</ul>

        </div>
        {/* Pending Courses Section */}
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow mb-6">
  <h3 className="text-2xl font-semibold text-blue-500 mb-4">Pending Course Approvals</h3>

  {pendingCourses.length === 0 ? (
    <p className="text-gray-500">No pending courses.</p>
  ) : (
    <table className="w-full table-auto border mt-2 text-left">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-3 py-2 border">#</th>
          <th className="px-3 py-2 border">Title</th>
          {/* <th className="px-3 py-2 border">Description</th> */}
          <th className="px-3 py-2 border">Instructor</th>
          <th className="px-3 py-2 border">Actions</th>
          <th className="px-3 py-2 border">Details</th>
        </tr>
      </thead>
      <tbody>
        {pendingCourses.map((course, idx) => (
          <tr key={course.id}>
            <td className="px-3 py-2 border">{idx + 1}</td>
            <td className="px-3 py-2 border">{course.title}</td>
            {/* <td className="px-3 py-2 border">{course.description}</td> */}
            <td className="px-3 py-2 border">{course.instructor}</td>
            <td className="px-3 py-2 border flex space-x-2">
              <button
                onClick={() => handleCourseAction(course.id, "approve")}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
  onClick={() => {
    setSelectedCourseId(course.id);
    setShowReasonModal(true);
  }}
  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
>
  Disapprove
</button>
              {/* Update example - optional */}
             
            </td>
            <td className="px-3 py-2 border">
      <button
        onClick={() => navigate(`/admin/admincourseview/${course.id}`)}
        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        View Details
      </button>
    </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000B2]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-red-500"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Add New Instructor</h2>
              <form onSubmit={handleAddInstructor} className="space-y-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        {showReasonModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000B2]">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
      <button
        className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-red-500"
        onClick={() => {
          setShowReasonModal(false);
          setDisapprovalReason("");
        }}
      >
        ×
      </button>
      <h2 className="text-xl font-semibold mb-4 text-red-600">Disapprove Course</h2>
      <textarea
        placeholder="Enter reason for disapproval"
        value={disapprovalReason}
        onChange={(e) => setDisapprovalReason(e.target.value)}
        className="w-full border px-3 py-2 rounded h-32"
        required
      />
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => {
            setShowReasonModal(false);
            setDisapprovalReason("");
          }}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            await handleCourseAction(selectedCourseId, "disapprove", {
              reason: disapprovalReason,
            });
            setShowReasonModal(false);
            setDisapprovalReason("");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Submit Reason
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default AdminDashboard;
