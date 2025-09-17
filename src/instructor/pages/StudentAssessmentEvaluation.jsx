import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import api from "../../api"; // axios instance
import User from "../../icons/user.svg"; // fallback user image
import { FaSearch, FaRegLightbulb } from "react-icons/fa";

// Utility: split essay into annotated segments
function segmentText(text, annotations) {
  const cuts = new Set([0, text.length]);
  annotations.forEach((a) => {
    cuts.add(a.start);
    cuts.add(a.end);
  });
  const points = Array.from(cuts).sort((a, b) => a - b);

  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const segText = text.slice(start, end);
    const covering = annotations.filter(
      (a) => a.start <= start && a.end >= end
    );
    segments.push({ start, end, text: segText, anns: covering });
  }
  return segments;
}

// Selection offsets
function getSelectionOffsets(containerEl) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  if (
    !containerEl.contains(range.startContainer) ||
    !containerEl.contains(range.endContainer)
  )
    return null;

  const walker = document.createTreeWalker(
    containerEl,
    NodeFilter.SHOW_TEXT,
    null
  );
  let offset = 0,
    startOffset = null,
    endOffset = null;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node === range.startContainer) startOffset = offset + range.startOffset;
    if (node === range.endContainer) endOffset = offset + range.endOffset;
    offset += node.nodeValue.length;
  }

  if (startOffset == null || endOffset == null) return null;

  const a = Math.min(startOffset, endOffset);
  const b = Math.max(startOffset, endOffset);
  if (a === b) return null;

  return { start: a, end: b };
}

const StudentAssessmentEvaluation = () => {
  const { courseId } = useParams();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [search, setSearch] = useState("");

  // Annotations per answerId
  const [annotations, setAnnotations] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({
    answerId: null,
    start: 0,
    end: 0,
    selected_text: "",
    suggestion: "",
    comment: "",
  });

  const [activeEssay, setActiveEssay] = useState(null); // track essay being annotated
  const essayRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentEssay, setCurrentEssay] = useState(null);
  const [editingAnnotation, setEditingAnnotation] = useState(null);
  const [editText, setEditText] = useState("");

  const formatSubmittedTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString([], { month: "short", day: "numeric" }) +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Fetch list of students who submitted the assignment
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get(`/api/course/${courseId}/submissions/`);
        setContacts(res.data.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [courseId]);

  // Fetch answers when a student is selected

  const fetchStudentAnswers = async () => {
    if (!selectedContact) return;

    try {
      const res = await api.get(
        `/api/courses/${courseId}/students/${selectedContact.student_id}/answers/`
      );
      // Map answer_id → id for consistency
      const answersWithId = (res.data.student_submission.answers || []).map(
        (ans) => ({
          ...ans,
          id: ans.answer_id, // ✅ important: map API answer_id to id
        })
      );
      setSelectedAnswers(answersWithId);
    } catch (error) {
      console.error("Error fetching student answers:", error);
      setSelectedAnswers([]);
    }
  };

  useEffect(() => {
    fetchStudentAnswers();
  }, [selectedContact, courseId]);

  // Handle text selection
  const handleMouseUp = (ansId, essay) => {
    if (!essayRef.current) return;
    const off = getSelectionOffsets(essayRef.current);
    if (!off) return;

    const { start, end } = off;
    const selected_text = essay.slice(start, end);

    setDraft({
      answerId: ansId,
      start,
      end,
      selected_text,
      suggestion: "",
      comment: "",
    });
    setActiveEssay(ansId);
    setShowForm(true);
    window.getSelection()?.removeAllRanges();
  };

  // Save annotation
  const createAnnotation = (e) => {
    e.preventDefault();
    const newAnnotation = {
      id: Date.now(),
      start: draft.start,
      end: draft.end,
      selected_text: draft.selected_text,
      suggestion: draft.suggestion,
      comment: draft.comment,
    };
    setAnnotations((prev) => ({
      ...prev,
      [draft.answerId]: [...(prev[draft.answerId] || []), newAnnotation],
    }));
    setShowForm(false);
    setDraft({
      answerId: null,
      start: 0,
      end: 0,
      selected_text: "",
      suggestion: "",
      comment: "",
    });
  };

  const deleteAnnotation = async (ansId, suggestionId) => {
    try {
      await api.delete(`/api/suggest/delete/${suggestionId}/`);
      // Remove from local state after successful delete
      setAnnotations((prev) => ({
        ...prev,
        [ansId]: prev[ansId].filter((a) => a.id !== suggestionId),
      }));
      alert("Suggestion deleted successfully ✅");
    } catch (error) {
      console.error("Error deleting suggestion:", error);
      alert("Failed to delete suggestion ❌");
    }
  };

  // Accept/Reject API
  const handleAcceptReject = async (answerId, isCorrect) => {
    try {
      await api.post(`api/answers/accept-reject/`, {
        student_answer: answerId,
        is_correct: isCorrect,
      });
      alert(isCorrect ? "Answer Accepted ✅" : "Answer Not Accepted ❌");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update answer status");
    }
  };

  // Suggestion API
  const handleSuggestion = async (answerId, suggestion) => {
    try {
      const payload = {
        student_answer: answerId,
        selected_text: suggestion.selected_text,
        start_index: suggestion.start,
        end_index: suggestion.end,
        suggestion_text: suggestion.suggestion,
        is_correct: suggestion.is_correct, // optional
      };
      await api.post(`/api/suggest/`, payload);
      // Refresh suggestions
      fetchSuggestions(answerId);
    } catch (error) {
      console.error("Error saving suggestion:", error);
      alert("Failed to save suggestion");
    }
  };

  const handleSaveEdit = async (ansId, suggestionId, newText) => {
    // Optimistically update local state
    setAnnotations((prev) => ({
      ...prev,
      [ansId]: prev[ansId].map((a) =>
        a.id === suggestionId ? { ...a, suggestion: newText } : a
      ),
    }));
    setEditingAnnotation(null);
    setEditText("");

    try {
      // Update on backend
      await api.put(`/api/suggest/edit/${suggestionId}/`, {
        suggestion_text: newText,
      });
    } catch (error) {
      console.error("Error editing suggestion:", error);
      alert("Failed to save suggestion on server");
      // Optionally: revert the change if API fails
      fetchSuggestions(ansId);
    }
  };

  // Accept Button Logic
  const handleAccept = async (answerId, suggestions) => {
    if (suggestions.length > 0) {
      // Loop through all suggestions → save them
      for (let s of suggestions) {
        await handleSuggestion(answerId, { ...s, is_correct: true });
      }
      await fetchStudentAnswers(); // Refresh answers to reflect status
    } else {
      // No suggestions → directly accept
      await handleAcceptReject(answerId, true);
    }
  };

  // Not Accept Button Logic
  const handleReject = async (answerId, suggestions) => {
    if (suggestions.length > 0) {
      for (let s of suggestions) {
        await handleSuggestion(answerId, { ...s, is_correct: false });
      }
      await fetchStudentAnswers(); // Refresh answers to reflect status
    } else {
      await handleAcceptReject(answerId, false);
    }
  };

  const filteredContacts = contacts.filter((user) =>
    user.student_name.toLowerCase().includes(search.toLowerCase())
  );

  //  Add this before return (top of component body)
  const memoizedAnswers = useMemo(() => {
    return selectedAnswers.map((ans) => {
      const isEssay = ans.question_type === "essay" && ans.answer; //  check question_type
      const segs = isEssay
        ? segmentText(ans.answer, annotations[ans.id] || [])
        : [];
      return { ...ans, isEssay, segs };
    });
  }, [selectedAnswers, annotations]);

  const fetchSuggestions = async (answerId) => {
    try {
      const res = await api.get(`/api/suggest/${answerId}/`);
      // res.data.suggestions contains all suggestions
      setAnnotations((prev) => ({
        ...prev,
        [answerId]: res.data.suggestions.map((s) => ({
          ...s,
          suggestion: s.suggestion_text,
        })),
      }));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    if (selectedAnswers.length) {
      selectedAnswers.forEach((ans) => {
        if (ans.question_type === "essay") {
          fetchSuggestions(ans.id);
        }
      });
    }
  }, [selectedAnswers]);

  const markAssignmentEvaluated = async () => {
    if (!selectedContact) return;

    try {
      await api.post("/api/assignment/evaluate/", {
        student_id: selectedContact.student_id,
        course_id: courseId,
      });
      alert("Review submitted and marked evaluated ✅");
    } catch (error) {
      console.error("Error marking assignment evaluated:", error);
      alert("Failed to mark assignment evaluated ❌");
    }
  };

  return (
    <div className="flex h-screen w-full font-sans">
      {/* Left Panel */}
      <div className="w-80 h-full flex flex-col border border-gray-300">
        <div className="relative px-4 pb-3 mt-7">
          <FaSearch className="absolute top-3 left-6 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-3 py-2 rounded w-full text-sm bg-white text-black border"
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {filteredContacts.map((user) => (
            <div
              key={user.student_id}
              className={classNames(
                "flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100",
                selectedContact?.student_id === user.student_id && "bg-blue-50"
              )}
              onClick={() => setSelectedContact(user)}
            >
              <img
                src={
                  user.profile_picture
                    ? `${import.meta.env.VITE_BACKEND_URL}/api${
                        user.profile_picture
                      }`
                    : User
                }
                alt={user.student_name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-gray-900">
                    {user.student_name}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatSubmittedTime(user.submitted_at)}
                  </span>
                </div>
                {/* <p className="text-xs text-gray-600 truncate max-w-[180px]">
                  Submitted assignment
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Central Panel */}

      <div className="flex-1 bg-gray-50 flex flex-col border border-gray-300 overflow-y-auto">
        {selectedContact ? (
          <div className="p-4">
            {memoizedAnswers.map((ans, idx) => (
              <div
                key={idx}
                className="p-3 mb-3 bg-white rounded shadow-sm border"
              >
                {/* Question or Paragraph */}
                <p className="font-semibold text-sm mb-2">
                  Q{idx + 1}: {ans.question_text || ans.paragraph}
                </p>

                {/* Question Image */}
                {ans.question_image && (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/api${
                      ans.question_image
                    }`}
                    alt="question"
                    className="w-full max-w-xs my-2 rounded"
                  />
                )}

                {/* Question Audio */}
                {ans.question_audio && (
                  <audio controls className="my-2 w-full">
                    <source
                      src={`${import.meta.env.VITE_BACKEND_URL}/api${
                        ans.question_audio
                      }`}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                )}

                {/* Multiple Choice Options */}
                {ans.question_type === "multiplechoice" && ans.options && (
                  <div className="flex flex-col gap-1 text-sm mt-2">
                    {ans.options.map((opt, i) => {
                      const isCorrect = opt.isCorrect;
                      const isSelected = opt.text === ans.answer;
                      return (
                        <div
                          key={i}
                          className={classNames(
                            "px-2 py-1 rounded border",
                            isCorrect ? "bg-green-100 border-green-400" : "",
                            !isCorrect && isSelected
                              ? "bg-red-100 border-red-400"
                              : "",
                            !isCorrect && !isSelected
                              ? "bg-gray-50 border-gray-200"
                              : ""
                          )}
                        >
                          {opt.text}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Essay with annotation */}
                {ans.isEssay && (
                  <div className="mt-2">
                    <div
                      ref={essayRef}
                      onMouseUp={() => handleMouseUp(ans.id, ans.answer)}
                      className="border rounded p-2 bg-gray-50 text-xs text-gray-800 whitespace-pre-wrap cursor-text"
                    >
                      {ans.segs.map((seg, i) => (
                        <span
                          key={i}
                          title={
                            seg.anns.length > 0
                              ? seg.anns.map((a) => a.suggestion).join("\n")
                              : ""
                          }
                          style={{
                            background:
                              seg.anns.length > 0
                                ? "rgba(255, 221, 0, 0.35)"
                                : "transparent",
                            borderBottom:
                              seg.anns.length > 0 ? "2px solid orange" : "none",
                          }}
                        >
                          {seg.text}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    {/* Action buttons */}
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        className={classNames(
                          "px-4 py-1 rounded text-sm border",
                          ans.is_correct === true
                            ? "bg-green-300 text-white border-green-600"
                            : "bg-white border-blue-500 text-blue-700"
                        )}
                        onClick={() =>
                          handleAccept(ans.id, annotations[ans.id] || [])
                        }
                      >
                        Accept
                      </button>

                      <button
                        className={classNames(
                          "px-4 py-1 rounded text-sm border",
                          ans.is_correct === false
                            ? "bg-red-300 text-white border-red-600"
                            : "bg-white border-blue-500 text-blue-700"
                        )}
                        onClick={() =>
                          handleReject(ans.id, annotations[ans.id] || [])
                        }
                      >
                        Not Accept
                      </button>

                      {/* Suggestions Button */}
                      <button
                        onClick={() => {
                          setCurrentEssay(ans);
                          setShowSuggestions(true);
                        }}
                        className="flex items-center gap-1 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-1 rounded text-sm"
                      >
                        <FaRegLightbulb /> Suggestions given
                      </button>
                    </div>
                  </div>
                )}

                {/* Para Multiple Choice MCQs */}
                {ans.question_type === "para_multiplechoice" && ans.mcqs && (
                  <div className="mt-2 flex flex-col gap-2 text-sm">
                    {ans.mcqs.map((mcq, mIdx) => (
                      <div key={mIdx} className="border p-2 rounded bg-gray-50">
                        <p className="font-medium">{mcq.question}</p>

                        {/* MCQ Image */}
                        {mcq.image && (
                          <img
                            src={`${
                              import.meta.env.VITE_BACKEND_URL
                            }/api/media/${mcq.image}`}
                            alt="mcq"
                            className="w-full max-w-xs my-1 rounded"
                          />
                        )}

                        {/* MCQ Audio */}
                        {mcq.audio && (
                          <audio controls className="my-1 w-full">
                            <source
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/api/media/${mcq.audio}`}
                              type="audio/mpeg"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        )}

                        {/* MCQ Options */}
                        <div className="flex flex-col gap-1 mt-1">
                          {mcq.options.map((opt, oIdx) => {
                            const isCorrect = opt.isCorrect;
                            const isSelected = opt.text === mcq.answer; // if student answered
                            return (
                              <div
                                key={oIdx}
                                className={classNames(
                                  "px-2 py-1 rounded border",
                                  isCorrect
                                    ? "bg-green-100 border-green-400"
                                    : "",
                                  !isCorrect && isSelected
                                    ? "bg-red-100 border-red-400"
                                    : "",
                                  !isCorrect && !isSelected
                                    ? "bg-gray-50 border-gray-200"
                                    : ""
                                )}
                              >
                                {opt.text}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Submit Review Button */}
            {selectedContact && (
              <div className="w-full p-4 border-t flex justify-end bg-white">
                <button
                  onClick={() => {
                    console.log("Review submitted:", {
                      student: selectedContact,
                      annotations,
                    });
                    // Call backend to mark evaluated
                    markAssignmentEvaluated();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm font-medium shadow"
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a student to view details
          </div>
        )}
      </div>

      {/* Suggestion Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={createAnnotation}
            className="bg-white p-6 rounded-lg w-96"
          >
            <h3 className="font-semibold mb-3">Add Suggestion</h3>
            <p className="text-xs text-gray-600 mb-2">
              Selected: <em>{draft.selected_text}</em>
            </p>
            <textarea
              required
              value={draft.suggestion}
              onChange={(e) =>
                setDraft({ ...draft, suggestion: e.target.value })
              }
              placeholder="Enter suggestion..."
              className="w-full border p-2 rounded mb-3 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {showSuggestions && currentEssay && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
            <h3 className="font-semibold mb-3 text-lg">Suggestions</h3>

            {/* Essay text segmented */}
            <div className="border rounded p-3 bg-gray-50 text-sm mb-4 whitespace-pre-wrap">
              {currentEssay.segs.map((seg, i) => (
                <span
                  key={i}
                  style={{
                    background:
                      seg.anns.length > 0
                        ? "rgba(255, 221, 0, 0.35)"
                        : "transparent",
                    borderBottom:
                      seg.anns.length > 0 ? "2px solid orange" : "none",
                  }}
                  className="cursor-help"
                  title={
                    seg.anns.length > 0
                      ? seg.anns.map((a) => a.suggestion).join("\n")
                      : ""
                  }
                >
                  {seg.text}
                </span>
              ))}
            </div>

            {/* List of suggestions */}
            {(annotations[currentEssay.id] || []).length > 0 ? (
              <table className="w-full border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-1 text-left w-1/3">
                      Selected Text
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-left">
                      Suggestion
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-center w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(annotations[currentEssay.id] || []).map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-1 align-top">
                        <em>"{a.selected_text}"</em>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 align-top">
                        {editingAnnotation === a.id ? (
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full border p-2 rounded text-sm"
                          />
                        ) : (
                          <p className="text-gray-700">{a.suggestion}</p>
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        {editingAnnotation === a.id ? (
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() =>
                                handleSaveEdit(a.id, editText, currentEssay.id)
                              }
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                            >
                              Save
                            </button>

                            <button
                              onClick={() => {
                                setEditingAnnotation(null);
                                setEditText("");
                              }}
                              className="bg-gray-300 px-2 py-1 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => {
                                setEditingAnnotation(a.id);
                                setEditText(a.suggestion);
                              }}
                              className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                deleteAnnotation(currentEssay.id, a.id)
                              }
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm italic text-center">
                No suggestions given.
              </p>
            )}

            {/* Close button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSuggestions(false)}
                className="px-4 py-1 rounded bg-blue-500 text-white text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssessmentEvaluation;
