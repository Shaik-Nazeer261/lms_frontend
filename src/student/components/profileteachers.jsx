import  { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa';
import api from '../../api.jsx'; // your configured Axios instance

const ITEMS_PER_PAGE = 20;

const Profileteachers = () => {
  const [instructors, setInstructors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
const [selectedInstructor, setSelectedInstructor] = useState(null);
const [messageText, setMessageText] = useState("");


  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await api.get('/api/student/enrolled-course-instructors/');
        setInstructors(res.data);
      } catch (err) {
        console.error("Failed to fetch instructors", err);
      }
    };

    fetchInstructors();
  }, []);

  const totalPages = Math.ceil(instructors.length / ITEMS_PER_PAGE);

  const paginatedInstructors = instructors.slice(
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
    <div className="bg-white shadow-sm px-6 py-8">
      <h2 className="font-semibold text-lg text-[#00113D] mb-6">Instructors ({instructors.length})</h2>

      {/* Instructor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedInstructors.map((instructor) => (
          <div key={instructor.id} className="shadow rounded overflow-hidden text-center">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${instructor.profile_picture}`}
              alt={instructor.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h4 className="text-lg font-bold text-[#00113D]">{instructor.name}</h4>
              <p className="text-gray-500 text-sm mb-4">{instructor.headline}</p>
              <div className="flex justify-between gap-6 items-center text-sm text-gray-700 mb-4">
                <div className="flex items-center gap-1 text-orange-500">
                  <FaStar className="text-sm" />
                  {instructor.average_rating?.toFixed(1) || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">{instructor.total_students?.toLocaleString()}</span> students
                </div>
              </div>
              <button
  className="text-blue-600 bg-blue-50 text-sm font-medium px-4 py-2 rounded hover:bg-blue-100 w-full"
  onClick={() => {
    setSelectedInstructor(instructor);
    setShowModal(true);
  }}
>
  Send Message
</button>

            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10">
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

      {showModal && selectedInstructor && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-2">Message to {selectedInstructor.name}</h3>
      <textarea
        className="w-full border border-gray-300 rounded p-2 mb-4"
        rows={5}
        placeholder="Type your message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />

      <div className="flex justify-end gap-4">
        <button
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
          onClick={() => {
            setShowModal(false);
            setMessageText("");
          }}
        >
          Cancel
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={async () => {
            try {
              const formData = new FormData();
              formData.append("message", messageText);

              await api.post(
                `/api/courses/${selectedInstructor.course_id}/chat/private/${selectedInstructor.id}/`,
                formData
              );

              alert("Message sent successfully!");
              setShowModal(false);
              setMessageText("");
            } catch (err) {
              console.error("Message send failed:", err);
              alert("Failed to send message.");
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Profileteachers;
