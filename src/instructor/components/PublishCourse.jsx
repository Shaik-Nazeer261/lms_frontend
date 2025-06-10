import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api.jsx';

const PublishCourse = ({ goToTab, courseId }) => {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [congratsMessage, setCongratsMessage] = useState('');
  const [instructors, setInstructors] = useState([
    { id: 1, name: 'Username', role: 'UI/UX Designer', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Username', role: 'UI/UX Designer', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  ]);
  const navigate=useNavigate()

  

  useEffect(() => {
    if (courseId) {
      const fetchPublishDetails = async () => {
        try {
          const res = await api.get(`/api/instructor/publish-course/${courseId}/`);
          setWelcomeMessage(res.data.welcome_message || '');
          setCongratsMessage(res.data.congratulation_message || '');
        } catch (err) {
          console.error("Failed to fetch publish details:", err.response?.data || err.message);
        }
      };
      fetchPublishDetails();
    }
  }, [courseId]);



  const handlePublish = async () => {
  if (!courseId) {
    alert("No course ID found.");
    return;
  }

  try {
    const response = await api.post(`/api/instructor/publish-course/${courseId}/`, {
      welcome_message: welcomeMessage,
      congratulation_message: congratsMessage,
    });
    alert("Course info saved. Proceed to next step.");
    navigate('/instructor/course-review', { state: { courseId } });
  } catch (err) {
    console.error("Publish error:", err.response?.data || err.message);
    alert("Failed to save publish info.");
  }
};

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#00113D]">Publish Course</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Welcome Message</label>
          <textarea
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="Enter course starting message here..."
            className="w-full border border-gray-300 rounded-md p-3 h-28"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Congratulations Message</label>
          <textarea
            value={congratsMessage}
            onChange={(e) => setCongratsMessage(e.target.value)}
            placeholder="Enter your course completed message here..."
            className="w-full border border-gray-300 rounded-md p-3 h-28"
          />
        </div>
      </div>

      {/* <div>
        <label className="block font-semibold mb-2">Add Instructor (0{instructors.length})</label>
        <input
          type="text"
          placeholder="Search by username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="flex items-center justify-between border rounded-md p-4 bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-[#00113D]">{instructor.name}</p>
                  <p className="text-xs text-gray-500">{instructor.role}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveInstructor(instructor.id)}
                className="text-gray-400 hover:text-red-500 text-lg font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div> */}

      {/* Bottom Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="px-6 py-2 border text-gray-600 rounded-md hover:bg-gray-100"
          onClick={() => goToTab('curriculum')}
        >
          Prev Step
        </button>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
            Save
          </button>
          <button
  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
  onClick={handlePublish}
>
  Submit For Review
</button>

        </div>
      </div>
    </div>
  );
};

export default PublishCourse;
