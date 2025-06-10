import React, { useRef, useState, useEffect } from "react";
import { FaClock, FaFolderOpen, FaPlay } from "react-icons/fa";
import {
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiLock,
} from "react-icons/fi";
import { BsFolder } from "react-icons/bs";
import { PiPlayCircle } from "react-icons/pi";
import { LuClock } from "react-icons/lu";
import cert from "../../student/images/cert.png";
import { useParams } from "react-router-dom";
import api from "../../api";
import unlock from "../../icons/unlock.svg";
import lock from "../../icons/lock.svg";
import checked from "../../icons/checked.svg";
import unchecked from "../../icons/unchecked.svg";
import select from "../../icons/select.svg";
import Vector from "../../icons/Vector.svg";
import moment from "moment";

const CourseDetail = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [course, setCourse] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);

  const descriptionRef = useRef(null);
  const notesRef = useRef(null);
  const filesRef = useRef(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showFinalExam, setShowFinalExam] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [evaluationDetails, setEvaluationDetails] = useState([]);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
const [rating, setRating] = useState(0);
const [feedback, setFeedback] = useState("");


  const { id } = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/api/instructor/course-detail/${id}/`);
        const data = res.data;
        setCourse(data);
        setActiveLecture(data.sections?.[0]?.lectures?.[0] || null);
      } catch (err) {
        console.error("Failed to fetch course", err);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return <div className="text-center p-10">Loading course...</div>;
  }

  const handleVideoComplete = async (lecture) => {
    try {
      await api.post(
        `/api/courses/${id}/content/${lecture.content_id}/auto-complete/`,
        {
          component_type: "video",
        }
      );

      // Update completed status in UI
      const updatedSections = course.sections.map((section) => {
        const updatedLectures = section.lectures.map((l) => {
          if (l.content_id === lecture.content_id) {
            return { ...l, completed: true };
          }
          return l;
        });
        return { ...section, lectures: updatedLectures };
      });

      setCourse((prev) => ({ ...prev, sections: updatedSections }));

      // Refresh progress
      const progressRes = await api.get(`/api/courses/${id}/progress/`);
      setCourse((prev) => ({
        ...prev,
        completedPercent: progressRes.data.progress_percentage,
      }));
    } catch (error) {
      console.error("Error marking video as complete:", error);
    }
  };

  const openPracticeQuiz = (questions) => {
    setQuizQuestions(questions);
    setShowQuiz(true);
  };

  const openFinalExam = () => {
    setQuizQuestions(course.finalAssignment);
    setShowFinalExam(true);
  };

  const handlePracticeSubmit = async () => {
    try {
      const answerPayload = {};
      quizQuestions.forEach((q, index) => {
        const questionId = q.id || index; // If your question has an id
        answerPayload[questionId] = answers[index];
      });

      const res = await api.post("/api/submit-quiz/", {
        quiz_type: "practice",
        lesson_id: course.sections[activeIndex].id, // Ensure lesson_id is sent from backend
        answers: answerPayload,
      });

      setResult(res.data);
    } catch (err) {
      console.error("Quiz submission failed", err);
    }
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setResult(null);
  };

  const handleFinalExamSubmit = async () => {
    try {
      const payload = {
        answers: {},
      };

      // Collect answers
      quizQuestions.forEach((q, index) => {
        payload.answers[q.id] = answers[index] || "";
      });

      // Submit assignment answers
      const resultRes = await api.post(
        `/api/courses/${id}/assignments/submit/`,
        payload
      );
      const { score, pass_status, evaluation } = resultRes.data;

      setEvaluationDetails(evaluation);
      setShowFinalExam(false);

      if (pass_status === "Pass") {
        // Issue certificate
        const certRes = await api.post(`/api/courses/${id}/issue-certificate/`);
        setCertificateUrl(certRes.data.certificate_url || null);
        setResultMessage("🎉 Congratulations! You passed the final exam.");
        setShowResultPopup(true);
      } else {
        setResultMessage(
          `❌ You scored ${score.toFixed(2)}%. Minimum 75% required to pass.`
        );
        setShowResultPopup(true);
      }
    } catch (error) {
      console.error(error);
      alert("❗ An error occurred while submitting the exam.");
    }
  };

  const getRatingLabel = (rating) => {
  if (rating === 5) return "Excellent";
  if (rating === 4) return "Good";
  if (rating === 3) return "Average";
  if (rating === 2) return "Poor";
  if (rating === 1) return "Terrible";
  return "Select Rating";
};


  return (
    <div className="bg-white text-[#00113D]">
      <div className="flex justify-between bg-[#F6F9FC] p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow">
            <span className="text-xl">→</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-[#00113D]">
              {course.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1 text-blue-600">
                <FaFolderOpen /> {course.sections?.length || 0} Sections
              </span>
              <span className="flex items-center gap-1 text-[#00113D]">
                <FaPlay />
                {course.sections?.reduce(
                  (acc, sec) => acc + (sec.lectures?.length || 0),
                  0
                ) || 0}{" "}
                Lectures
              </span>
              <span className="flex items-center gap-1 text-orange-500">
                <FaClock /> {course.duration || "N/A"}
              </span>
            </div>
          </div>
        </div>
      
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mx-auto mt-4">
        <div className="flex-1 space-y-4">
          {activeLecture?.video ? (
            <video
              key={activeLecture.video}
              controls
              className="w-full rounded-md shadow-md"
              poster="/cover.jpg"
              onEnded={() => handleVideoComplete(activeLecture)}
            >
              <source
                src={`${import.meta.env.VITE_BACKEND_URL}${
                  activeLecture.video
                }`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full rounded-md shadow-md bg-gray-100 text-center py-20 text-gray-500">
              Video not available for this lecture
            </div>
          )}

          {activeLecture && (
            <div className="bg-white shadow p-4 rounded-md mt-4">
              <h2 className="text-2xl font-semibold text-[#00113D] mb-2">
                {activeLecture.title}
              </h2>

              <div className="flex gap-10 mb-4  pb-2 text-sm text-gray-500">
                <button
                  onClick={() =>
                    descriptionRef.current?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                  className="border-b-2 border-blue-600 text-blue-600"
                >
                  Description
                </button>
                <button
                  onClick={() =>
                    notesRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Lecture Notes
                </button>
                <button
                  onClick={() =>
                    filesRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Attach File
                </button>
                <button>Message to Instructor</button>
              </div>

              {activeLecture.description && (
                <div ref={descriptionRef} className="mt-4">
                  <h3 className="font-semibold text-lg text-[#00113D] mb-2">
                    Lecture Description
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {activeLecture.description}
                  </p>
                </div>
              )}

              {activeLecture.notes && (
                <div ref={notesRef} className="mt-6  pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className=" font-semibold text-lg text-[#00113D]">
                      Lecture Notes
                    </h3>
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URL}${
                        activeLecture.notes.download
                      }`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-50 text-blue-600 px-4 py-2 rounded shadow-sm text-sm font-semibold hover:underline flex items-center gap-1"
                    >
                      📥 Download Notes
                    </a>
                  </div>
                  <div className="text-gray-700 text-sm space-y-4 leading-relaxed">
                    {activeLecture.notes.text}
                  </div>
                </div>
              )}

              {activeLecture.attachFile && (
                <div ref={filesRef} className="mt-4  pt-4">
                  <h3 className="font-semibold text-lg text-[#00113D] mb-2">
                    Attach Files
                  </h3>
                  <div className="flex justify-between items-center bg-[#F5F7FA] p-3 rounded-md">
                    <div>
                      <p className="text-sm text-[#00113D]">
                        📄 {activeLecture.attachFile?.split("/").pop()}
                      </p>
                      
                    </div>
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URL}${
                        activeLecture.attachFile
                      }`}
                      className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                      download
                    >
                      Download File
                    </a>
                  </div>
                </div>
              )}

            
              
{course.rating && course.rating_breakdown && (
  <div className="mt-6  pt-4">
    <h3 className="font-semibold text-lg text-[#00113D] mb-2 ">Course Rating</h3>

    <div className="flex flex-col lg:flex-row gap-8">
      <div className="bg-[#F9FAFB]  p-4 rounded-md   text-center">
        <p className="text-4xl font-bold text-[#00113D]">{course.rating}</p>
        <div className="flex justify-center mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill={star <= Math.floor(course.rating) ? "#3B82F6" : "none"}
              viewBox="0 0 24 24"
              stroke={star <= Math.floor(course.rating) ? "#3B82F6" : "#CBD5E0"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          ))}
        </div>
        <p className="mt-1 text-sm text-[#00113D]">Course Rating</p>
      </div>

<div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-3">
            <div className="flex gap-1 w-32">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className="w-4 h-4"
                  fill={s <= star ? "#3B82F6" : "none"}
                  stroke="#3B82F6"
                  strokeWidth="1"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 17.27L18.18 21 16.54 13.97 
                      22 9.24l-7.19-.61L12 2 9.19 
                      8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              ))}
            </div>
            <div className="flex-1 h-2 bg-[#FFEEDC] rounded">
              <div
                className="h-2 bg-blue-400 rounded"
                style={{ width: `${course.rating_breakdown[star] || 0}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-[#00113D] w-10 text-right">
              {course.rating_breakdown[star] > 0
                ? `${course.rating_breakdown[star]}%`
                : "< 1%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}


             {Array.isArray(course.feedback) && (
  <div className="mt-6  pt-6">
    <h3 className="font-semibold text-lg text-[#00113D] mb-4">Students Feedback</h3>
    <div className="space-y-6">
      {course.feedback.map((fb, index) => (
        <div key={index} className="flex items-start gap-4  pb-4">
          <img
            src={
              fb.image
                ? `${import.meta.env.VITE_BACKEND_URL}${fb.image}`
                : "/default-avatar.png"
            }
            alt="Student"
            className="w-10 h-10 rounded-full object-cover mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-[#00113D]">{fb.name}</span>
              <span className="text-xs text-gray-500">
  {moment.utc(fb.submitted_at).utcOffset('+05:30').fromNow()}
</span>

            </div>
            <div className="text-yellow-500 mb-2">
              {"★".repeat(fb.rating)}
              {"☆".repeat(5 - fb.rating)}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {fb.comment}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[30%]">
          <div className="bg-white p-4 rounded-md shadow w-full">
            <div className="flex justify-between items-center text-sm mb-3">
              <h2 className="text-xl font-bold text-[#00113D]">
                Course Contents
              </h2>
             
            </div>
            
            

            <div className="">
              {course.sections?.map((section, index) => (
                <div key={index}>
                  <div
                    className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      setActiveIndex(activeIndex === index ? -1 : index)
                    }
                  >
                    <div className="flex items-center gap-2">
                      {activeIndex === index ? (
                        <FiChevronDown />
                      ) : (
                        <FiChevronRight />
                      )}
                      <h3 className="font-medium text-[#00113D]">
                        {section.title}
                      </h3>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{section.lectureCount} lectures</span>
                      <span className="mx-2"></span>
                      <span>{section.total}</span>
                      <span className="mx-2"></span>
                      <span className="">
                        {section.sectionProgress || 0}% finish (
                        {section.completedLectures || 0}/{section.lectureCount})
                      </span>
                    </div>
                  </div>

                  {activeIndex === index && section.lectures && (
                    <>
                      <ul className="ml-6 mb-4">
                        {section.lectures.map((lecture, i) => (
                          <li
                            key={i}
                            onClick={() => setActiveLecture(lecture)}
                            className={`cursor-pointer flex justify-between items-center text-sm  py-2 rounded ${
                              activeLecture?.title === lecture.title
                                ? "bg-blue-50 font-semibold text-blue-800"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-2 ">
                             

                              <span>{`${i + 1}. ${lecture.title}`}</span>
                            </div>
                            <span className="text-gray-500 text-xs">
                              {lecture.duration}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                          <button
                            className="ml-6 mt-2 text-sm text-blue-600 underline"
                            onClick={() =>
                              openPracticeQuiz(section.practicePaper)
                            }
                          >
                            📘 Take Practice Quiz
                          </button>
                       
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Certificate */}
            <div className=" pt-4">
              <div className="flex justify-between items-center text-sm font-semibold text-[#00113D]">
                <span className="flex items-center gap-2">
                  
                    <button
                      className=" rounded mt-4 hover:bg-green-700 w-full"
                      onClick={openFinalExam}
                    >
                      🎓 Take Final Exam
                    </button>
                 
                </span>
                <span className="flex items-center gap-1 text-gray-500 ">
                  {" "}
                  {course.completedPercent === 100 ? (
                    <img
                      src={unlock}
                      className="text-green-600 w-4 h-4 "
                      title="Unlocked"
                    />
                  ) : (
                    <img
                      src={lock}
                      className="text-gray-400"
                      title="Locked until course completion"
                    />
                  )}
                </span>
              </div>
              <h3 className="text-center font-semibold text-lg mt-4">
                Certificate
              </h3>

              {course.certificateTemplate?.preview_image ? (
                // Case 1: Show preview image if available
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${
                    course.certificateTemplate.preview_image
                  }`}
                  alt="Course Certificate"
                  className="mx-auto mt-2 w-full max-w-md rounded shadow"
                />
              ) : course.certificateTemplate?.file_type === "html" &&
                course.certificateTemplate?.html_template ? (
                // Case 2: If no preview image but HTML template exists, render it
                <div
                  className="mx-auto mt-2 w-full max-w-2xs rounded shadow p-4 border"
                  dangerouslySetInnerHTML={{
                    __html: course.certificateTemplate.html_template,
                  }}
                />
              ) : (
                // Case 3: Fallback
                <p className="text-sm text-gray-500 text-center mt-2">
                  Certificate preview not available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showQuiz && (
        <div className="fixed inset-0 bg-[#000000B2] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Practice Quiz</h2>
            {quizQuestions.map((q, i) => (
              <div key={i} className="mb-4">
                <p className="font-semibold">
                  {i + 1}. {q.question}
                </p>
                <div className="ml-4 mt-2">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2 mb-1 text-sm text-gray-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${i}`}
                        value={opt}
                        checked={answers[i] === opt}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [i]: opt }))
                        }
                        className="accent-blue-600"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {!result ? (
              <>
                <div className="flex justify-end gap-4">
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handlePracticeSubmit}
                  >
                    Submit Quiz
                  </button>
                  <button
                    className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    onClick={() => {
                      setShowQuiz(false);
                      setQuizQuestions([]);
                      setAnswers({});
                      setResult(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-4 space-y-4">
                <p className="font-bold text-green-600">
                  You got {result.correct} out of {result.total} correct!
                </p>

                {result.wrong_details.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-1">
                      Review Incorrect Answers:
                    </h4>
                    <ul className="list-disc ml-6 text-sm">
                      {result.wrong_details.map((w, i) => (
                        <li key={i}>
                          <strong>Q:</strong> {w.question} <br />
                          <span className="text-red-600">
                            Your Answer: {w.your_answer}
                          </span>
                          <br />
                          <span className="text-green-600">
                            Correct Answer: {w.correct_answer}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-1">Suggested Content:</h4>
                    <ul className="list-disc ml-6 text-sm">
                      {result.suggestions.map((s, i) => (
                        <li key={i}>
                          {s.concept_title} - {s.content_title}
                          {s.video_url && (
                            <a
                              href={`${import.meta.env.VITE_BACKEND_URL}${
                                s.video_url
                              }`}
                              className="text-blue-600 underline ml-2"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Watch Video
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleRetakeQuiz}
                  >
                    Retake Quiz
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    onClick={() => {
                      setShowQuiz(false);
                      setQuizQuestions([]);
                      setAnswers({});
                      setResult(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showFinalExam && (
        <div className="fixed inset-0 bg-[#000000B2] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Final Exam</h2>

            {quizQuestions.map((q, i) => (
              <div key={i} className="mb-4">
                <p className="font-semibold">
                  {i + 1}. {q.question}
                </p>
                <div className="ml-4 mt-2">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2 mb-1 text-sm text-gray-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${i}`}
                        value={opt}
                        checked={answers[i] === opt}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [i]: opt }))
                        }
                        className="accent-blue-600"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => {
                  setShowFinalExam(false);
                  setQuizQuestions([]);
                  setAnswers({});
                  setResult(null);
                  setShowResultPopup(false);
                  setCertificateUrl(null);
                  setEvaluationDetails([]);
                }}
              >
                Close
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleFinalExamSubmit}
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
      {showResultPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-lg text-center">
            <h2 className="text-xl font-bold mb-2">Final Exam Result</h2>
            <p className="mb-4">{resultMessage}</p>

            {certificateUrl && (
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}${certificateUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                🎓 Download Certificate
              </a>
            )}

            <button
              onClick={() => {
                setShowResultPopup(false);
                setCertificateUrl(null);
                setEvaluationDetails([]);
                setShowFinalExam(false);
                setQuizQuestions([]);
                setAnswers({});
                setResult(null);
              }}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showReviewPopup && (
  <div className="fixed inset-0 bg-[#000000B2] flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#00113D]">Write a Review</h2>
        <button onClick={() => setShowReviewPopup(false)} className="text-gray-600 text-xl">×</button>
      </div>

      <div className="text-center">
<p className=" font-semibold">
  {rating > 0 ? `${rating}.0` : "--"}
  <span className="text-sm text-gray-500 ml-2">({getRatingLabel(rating)})</span>
</p>
        <div className="flex justify-center mt-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => setRating(star)}
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 cursor-pointer"
              fill={star <= rating ? "#FFA500" : "none"}
              viewBox="0 0 24 24"
              stroke={star <= rating ? "#FFA500" : "#CED1D9"}
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          ))}
        </div>
      </div>

      <label className="text-sm font-medium text-gray-700 mb-1 block">Feedback</label>
      <textarea
        className="w-full border border-[#E9EAF0] rounded px-3 py-2 text-sm"
        rows="4"
        placeholder="Write down your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      ></textarea>

      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded hover:bg-gray-200 "
          onClick={() => setShowReviewPopup(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-xs font-semibold text-white rounded hover:bg-blue-600"
          onClick={async () => {
  try {
    const res = await api.post(`/api/courses/${id}/feedback/submit/`, {
      rating,
      feedback_text: feedback,
    });
    alert("✅ Feedback submitted successfully!");
    setShowReviewPopup(false);
    setRating(0);
    setFeedback("");
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert(error.response.data?.error || "You already submitted feedback.");
    } else {
      alert("❌ Failed to submit feedback.");
    }
    console.error("Submit Feedback Error:", error);
  }
}}


        >
          Submit Review <img src={Vector} alt="Submit" className="inline-block ml-2 w-4 h-4 " />
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CourseDetail;
