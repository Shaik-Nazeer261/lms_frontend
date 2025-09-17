import React, { useState, useEffect } from "react";
import QuizQuestionModal from "./QuizQuestionModal";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../../api";
import { useRef } from "react";

const Quiz = ({ courseId, goToTab }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [assignmentId, setAssignmentId] = useState(null); // to track existing assignment
  const audioRefs = useRef({}); // key by question index

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 3; // Show 3 questions per page

  const totalPages = Math.ceil(quizzes.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = quizzes.slice(
    startIndex,
    startIndex + questionsPerPage
  );
  const [timeLimit, setTimeLimit] = useState(""); // in minutes
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role; // "instructor" or "admin"
  const [suggestion, setSuggestion] = useState(null); // ✅ new
  const [approvalStatus, setApprovalStatus] = useState(null); // ✅ new
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");

  const openImageModal = (image) => {
    setPreviewImage(getPreviewUrl(image));
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setPreviewImage(null);
    setShowImageModal(false);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingIndex(null);
  };

  const handleSaveQuestion = (newQuestion) => {
    if (editingIndex !== null) {
      const updatedQuizzes = [...quizzes];
      updatedQuizzes[editingIndex] = {
        ...newQuestion,
        id: quizzes[editingIndex].id || null, // ✅ Preserve ID when updating
      };
      setQuizzes(updatedQuizzes);
    } else {
      setQuizzes([...quizzes, { ...newQuestion, id: null }]); // ✅ New question → ID is null
    }
    setShowModal(false);
    setEditingIndex(null);
  };

  const handleDelete = async (index) => {
    const question = quizzes[index];

    // If the question has an ID, delete it from the backend
    if (question.id) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this question?"
      );
      if (!confirmDelete) return;

      try {
        await api.delete(`/api/assignment-questions/${question.id}/delete/`);

        alert("Question deleted successfully");
      } catch (error) {
        console.error("Error deleting question:", error);
        alert(error.response?.data?.message || "Failed to delete question");
        return;
      }
    }

    // Remove it from the UI regardless
    const updatedQuizzes = quizzes.filter((_, i) => i !== index);
    setQuizzes(updatedQuizzes);

    // Adjust pagination if last item of last page is deleted
    if (currentPage > Math.ceil(updatedQuizzes.length / questionsPerPage)) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setShowModal(true);
  };

  const fetchAssignment = async () => {
    try {
      const response = await api.get(`/api/assignments/course/${courseId}/`);
      const data = response.data;

      if (data.status === "success" && data.assignment) {
        const assignment = data.assignment;
        setTimeLimit(assignment.time_limit || "");

        const questions = assignment.questions.map((q) => ({
          id: q.id, // ✅ Store question ID here
          questionType: q.question_type,
          question: q.question,
          paragraph: q.paragraph,
          options: q.options || [],
          mcqs: q.mcqs || [],
          answer: q.answer,
          image: q.image || null,
          audio: q.audio || null,
          wordLimit: q.word_limit || null,
        }));

        setQuizzes(questions);
        setAssignmentId(assignment.id);
        setApprovalStatus(data.is_quiz_approved);
        setSuggestion(data.quiz_suggestions || null);
      } else {
        setQuizzes([]);
        setTimeLimit("");
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
      alert("Error fetching assignment");
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [courseId]);

  const saveAssignment = async (saveAndNext = false) => {
  if (quizzes.length === 0) {
    alert("Please add at least one question");
    return;
  }

  const formData = new FormData();
  formData.append("course_id", courseId);
  formData.append("time_limit", timeLimit || 0);

  quizzes.forEach((q, index) => {
    formData.append(`questions[${index}][id]`, q.id || "");
    formData.append(`questions[${index}][question_type]`, q.questionType);
    formData.append(`questions[${index}][question]`, q.question || "");
    formData.append(`questions[${index}][paragraph]`, q.paragraph || "");

    // ✅ Handle MCQs
    if (q.questionType === "mcq") {
      formData.append(
        `questions[${index}][options]`,
        JSON.stringify(q.options || [])
      );
      formData.append(`questions[${index}][answer]`, q.answer || "");
    }

    // ✅ Handle Essay
    if (q.questionType === "essay") {
      formData.append(`questions[${index}][word_limit]`, q.wordLimit || 0);
      formData.append(`questions[${index}][answer]`, q.answer || "");
    }

    // ✅ Handle Paragraph with Nested MCQs
    if (q.questionType === "para_multiplechoice") {
      (q.mcqs || []).forEach((mcq, mcqIndex) => {
        // Send MCQ question & options separately
        formData.append(
          `questions[${index}][mcqs][${mcqIndex}][question]`,
          mcq.question || ""
        );
        formData.append(
          `questions[${index}][mcqs][${mcqIndex}][options]`,
          JSON.stringify(mcq.options || [])
        );

        if (mcq.image instanceof File)
          formData.append(
            `questions[${index}][mcqs][${mcqIndex}][image]`,
            mcq.image
          );

        if (mcq.audio instanceof File)
          formData.append(
            `questions[${index}][mcqs][${mcqIndex}][audio]`,
            mcq.audio
          );
      });
    }

    // ✅ Top-level image/audio
    if (q.image instanceof File)
      formData.append(`questions[${index}][image]`, q.image);
    if (q.audio instanceof File)
      formData.append(`questions[${index}][audio]`, q.audio);
  });

  // DEBUG: Log FormData
  for (let [key, value] of formData.entries()) {
    console.log("📝 FormData:", key, value);
  }

  try {
    let response;
    if (assignmentId) {
      response = await api.put(`/api/assignments/${assignmentId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      response = await api.post(`/api/assignments/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAssignmentId(response.data.assignment_id); // ✅ corrected
    }

    alert("✅ Assignment saved successfully");
    if (saveAndNext) goToTab("publish");
  } catch (error) {
    console.error("❌ Error saving assignment:", error.response?.data || error);
    alert(error.response?.data?.message || "Error saving assignment");
  }
};




  const getPreviewUrl = (fileOrUrl) => {
    if (!fileOrUrl) return "";

    if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
      return URL.createObjectURL(fileOrUrl);
    }

    // If it's already a full URL from backend
    if (typeof fileOrUrl === "string" && fileOrUrl.startsWith("http")) {
      return fileOrUrl;
    }

    // If backend returns relative path like `/media/...`
    return `${import.meta.env.VITE_BACKEND_URL}/api${fileOrUrl}`;
  };

  

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    currentQuestions.forEach((q, i) => {
      const audioEl = audioRefs.current[startIndex + i];
      if (audioEl) audioEl.load();
    });
  }, [currentQuestions, startIndex]);

  const handleSuggestionSubmit = async () => {
    try {
      const response = await api.put(
        `/api/admin/course-quiz-approval/${courseId}/`,
        {
          is_quiz_approved: false,
          quiz_suggestions: suggestionText,
        }
      );

      if (response.status === 200) {
        alert("Suggestion saved ");
        setSuggestion(response.data.basic_suggestions);
        setApprovalStatus(response.data.is_basic_approved);
        setShowSuggestionModal(false);
        setSuggestionText("");
      }
    } catch (err) {
      console.error("Error saving suggestion:", err);
      alert("Failed to save suggestion");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#001744]">
          Quiz Questions
        </h2>

        <button
          onClick={handleOpenModal}
          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          + Add New Question
        </button>
      </div>
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

      {/* Modal */}
      {showModal && (
        <QuizQuestionModal
          onClose={handleCloseModal}
          onSave={handleSaveQuestion}
          existingQuestion={
            editingIndex !== null ? quizzes[editingIndex] : null
          }
        />
      )}

      {/* Display saved questions */}
      {quizzes.length > 0 && (
        <div className="mt-6 space-y-6">
          {currentQuestions.map((q, index) => (
            <div
              key={startIndex + index}
              className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm relative"
            >
              {/* Edit & Delete */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(startIndex + index)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(startIndex + index)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              <p className="font-semibold mb-3 text-xl">
                Question {startIndex + index + 1}
              </p>

              {/* Question Content */}
              {q.questionType === "para_multiplechoice" && (
                <p className="mb-3">{q.paragraph}</p>
              )}
              {q.questionType === "essay" && (
                <>
                  <p className="mb-3">{q.question}</p>
                  {q.wordLimit && (
                    <p className="text-sm text-gray-500">
                      (Answer should not exceed {q.wordLimit} words)
                    </p>
                  )}
                </>
              )}

              {q.questionType === "multiplechoice" && (
                <p className="mb-3">{q.question}</p>
              )}

              {/* Media */}
              {q.image && (
                <div className="mb-3">
                  <img
                    src={getPreviewUrl(q.image)}
                    alt="Question"
                    className="w-64 h-40 object-cover rounded-lg shadow cursor-pointer transition-transform duration-200 hover:scale-105"
                    onClick={() => openImageModal(q.image)}
                  />
                </div>
              )}
              {q.audio && (
                <audio
                  controls
                  className="mb-3 w-full"
                  ref={(el) => (audioRefs.current[startIndex + index] = el)}
                >
                  <source src={getPreviewUrl(q.audio)} />
                </audio>
              )}

              {/* Options */}
              {q.questionType === "multiplechoice" && (
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex items-center border border-gray-300  rounded p-2 cursor-pointer hover:bg-gray-50 ${
                        opt.isCorrect ? "bg-green-100 border-green-400" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${startIndex + index}`}
                        className="mr-2"
                        checked={opt.isCorrect}
                        readOnly
                      />
                      {opt.text} {opt.isCorrect && "(Correct)"}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {quizzes.length > 0 && (
        <div className="mt-6">
          <label className="block mb-2 font-semibold text-[#001744]">
            Assignment Time Limit (minutes)
          </label>
          <input
            type="number"
            min={1}
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            placeholder="Enter time in minutes"
            className="w-40 border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
      )}

      {/* Pagination */}
      {quizzes.length > questionsPerPage && (
        <div className="flex items-center justify-center mt-10 space-x-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 rounded-full  flex items-center justify-center ${
              currentPage === 1
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <FiChevronLeft size={22} className="text-blue-500" />
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx + 1)}
              className={`w-8 h-8 rounded-full  flex items-center justify-center text-sm font-semibold ${
                currentPage === idx + 1
                  ? "bg-blue-400 text-white"
                  : "bg-white text-[#001744] hover:bg-gray-100"
              }`}
            >
              {String(idx + 1).padStart(2, "0")}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 rounded-full  flex items-center justify-center ${
              currentPage === totalPages
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <FiChevronRight size={22} className="text-blue-500" />
          </button>
        </div>
      )}

      <div className="flex justify-between pt-6 mt-10">
        <button
          className="px-6 py-2 border text-gray-600 rounded hover:bg-gray-100"
          onClick={() => goToTab("curriculum")} // Assuming goToTab is passed as a prop
        >
          Previous
        </button>

        {userRole === "instructor" ? (
          //  Instructor buttons
          <div className="flex gap-4">
            <button
              className="px-6 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              onClick={() => saveAssignment(false)}
            >
              Save
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => saveAssignment(true)}
            >
              Save & Next
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
            <button className="px-6 py-2 border text-gray-600 rounded-md hover:bg-gray-50"
            onClick={() => goToTab("publish")}
            >
              Next
            </button>
            <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={async () => {
              try {
                const response = await api.put(
                  `/api/admin/course-quiz-approval/${courseId}/`,
                  { is_quiz_approved: true, quiz_suggestions: "" }
                );
                if (response.status === 200) {
                  alert("Course approved ✅");
                  setApprovalStatus(true);
                  setSuggestion(null);
                  goToTab("publish");
                }
              } catch (err) {
                alert("Approval failed ");
              }
            }}
            disabled={approvalStatus}
          >
            {approvalStatus ? "Approved" : "Approve & Next"}
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

      {/* Image Preview Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-[#00000080] z-50"
          onClick={closeImageModal}
        >
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-screen rounded-lg shadow-lg"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2  text-black rounded-full px-3 py-1 hover:bg-gray-400"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
