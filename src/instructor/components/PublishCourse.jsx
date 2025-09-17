import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const PublishCourse = ({ goToTab, courseId }) => {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [congratsMessage, setCongratsMessage] = useState("");
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role; // "instructor" or "admin"
  const [suggestion, setSuggestion] = useState(null); // new
  const [approvalStatus, setApprovalStatus] = useState(null); // new
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");

  useEffect(() => {
    if (courseId) {
      const fetchPublishDetails = async () => {
        try {
          const res = await api.get(`/api/instructor/publish-course/${courseId}/`);
          setWelcomeMessage(res.data.welcome_message || "");
          setCongratsMessage(res.data.congratulation_message || "");
          setApprovalStatus(res.data.is_publish_info_approved);
          setSuggestion(res.data.publish_suggestions);
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
      await api.post(`/api/instructor/publish-course/${courseId}/`, {
        welcome_message: welcomeMessage,
        congratulation_message: congratsMessage,
        submit_for_approval: true,
      });
      alert("submitted for approval");
    } catch (err) {
      console.error("Publish error:", err.response?.data || err.message);
      alert("Failed to save publish info.");
    }
  };

  const handleSuggestionSubmit = async () => {
    try {
      const response = await api.put(
        `/api/admin/final-course-approval/${courseId}/`,
        { is_publish_info_approved: false, publish_suggestions: suggestionText }
      );

      if (response.status === 200) {
        alert("Suggestion saved ✅");
        setApprovalStatus(false);
        setSuggestion(suggestionText);
        setShowSuggestionModal(false);
        setSuggestionText("");
      }
    } catch (err) {
      console.error("Error saving suggestion:", err);
      alert("Failed to save suggestion");
    }
  };

  const handlesendforrectification = async () => {
    try {
      const response = await api.put(
        `/api/admin/sendforrectification/${courseId}/`
      );
      if (response.status === 200) {
        alert("Course sent for rectification ✅");
        navigate("/admin/approvals");
      }
    } catch (err) {
      console.error("Error sending for rectification:", err);
      alert("Failed to send for rectification");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page Content */}
      <div className="flex-1 space-y-6 overflow-y-auto pb-28">
        <h2 className="text-xl font-bold text-[#00113D]">Publish Course</h2>
        {suggestion && (
  <div className="mb-6">
    <h3 className="text-base font-semibold text-[#00113D] mb-2">Suggestion</h3>
    <div>
      <p className="text-sm font-medium text-gray-700 mb-1">Message</p>
      <div className="bg-gray-100 border border-gray-300 rounded-md p-4 text-gray-800 text-sm">
        {suggestion}
      </div>
    </div>
  </div>
)}

        <div className="grid md:grid-cols-2 gap-6 ">
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
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-13 left-64 right-0 bg-white  shadow-md px-6 py-4 flex justify-between items-center z-50">
        <button
          className="px-6 py-2 border text-gray-600 rounded-md hover:bg-gray-100"
          onClick={() => goToTab("curriculum")}
        >
          Prev Step
        </button>
       {userRole === "instructor" ? (
          //  Instructor buttons
          <div className="flex gap-4">
            <button
              className="px-6 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              onClick={() => handlePublish(false)}
            >
              Save
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => handlePublish(true)}
            >
              Submit for review
            </button>
          </div>
        ) : (
          //  Admin buttons
          <div className="flex gap-4">
            <button
            className="px-6 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            onClick={() => setShowSuggestionModal(true)}
          >
            Add Suggestion
          </button>
           <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={async () => {
              try {
                const response = await api.put(
                  `/api/admin/final-course-approval/${courseId}/`,
                  { is_publish_info_approved: true, publish_suggestions: "" }
                );
                if (response.status === 200) {
                  alert("Course approved ✅");
                  setApprovalStatus(true);
                  setSuggestion(null);
                  navigate("/admin/approvals");
                }
              } catch (err) {
                alert("Approval failed ");
              }
            }}
            disabled={approvalStatus}
          >
            {approvalStatus ? "Approved" : "Approve & Next"}
          </button>
            <button
              className="px-6 py-2 border text-gray-600 rounded-md hover:bg-gray-50"
              onClick={() => handlesendforrectification()}
            >
              Send for Rectification
            </button>
          </div>
        )}
      </div>
      {showSuggestionModal && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Suggestion</h3>
            <textarea
              rows="4"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Enter suggestion..."
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 border rounded-md"
                onClick={() => setShowSuggestionModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleSuggestionSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishCourse;
