import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import StudentFooter from "../components/StudentFooter";
import { FaRegClock } from "react-icons/fa";
import api from "../../api";

const FinalQuiz = () => {
  const { id } = useParams(); // ✅ Get assignment ID from URL
  const [questions, setQuestions] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [started, setStarted] = useState(false);
  const [markedForReview, setMarkedForReview] = useState({});

   useEffect(() => {
  if (!started) return; // only start when quiz started

  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {  // <=1 because next tick will be 0
        clearInterval(interval);
        submitAssignment(); // ⬅️ auto-submit when time finishes
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [started]);

  const handleStart = async () => {
    await startAssignment(); // starts assignment and sets timeLeft
    startQuiz(); // fullscreen
  };

  const startAssignment = async () => {
    try {
      const response = await api.post(`/api/course/${id}/assignment/start/`);
      if (response.data) {
        setTimeLeft(response.data.remaining_time);
        setStarted(true);
      }
    } catch (error) {
      console.error("Error starting assignment:", error);
    }
  };

  const startQuiz = () => {
    setStarted(true);
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen request failed:", err);
    }
  };

useEffect(() => {
  if (!started || assignment?.completed) return; // ⬅️ stop if not started or already submitted

  const saveAnswers = async () => {
    try {
      await api.put(`/api/course/${id}/assignment/`, {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: parseInt(questionId, 10),
          answer:
            typeof answer === "object" && !Array.isArray(answer)
              ? {
                  mcq_answers: Object.entries(answer).map(
                    ([mcqId, val]) => ({ mcq_id: mcqId, value: val })
                  ),
                }
              : answer || "",
        })),
      });
    } catch (error) {
      console.error("Error saving answers:", error);
    }
  };

  const interval = setInterval(saveAnswers, 10000);
  return () => clearInterval(interval);
}, [answers, started, assignment?.completed, id]);


  // ✅ Fetch assignment details
  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        // Fetch assignment details
        const assignmentRes = await api.get(`/api/student/assignment/${id}/`);
        const assignmentData = assignmentRes.data.assignment;
        setAssignment(assignmentData);
        setQuestions(assignmentData.questions);

        // Fetch student's progress
        const studentRes = await api.get(`/api/course/${id}/assignment/`);
        const data = studentRes.data;

        setAnswers(
          data.answers.reduce((acc, curr) => {
            acc[curr.question_id] = curr.answer;
            return acc;
          }, {})
        );

        setTimeLeft(data.remaining_time ?? assignmentData.time_limit * 60);
        setStarted(Boolean(data.started_at));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (!started) return; // only start when quiz started

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hrs: String(hrs).padStart(2, "0"),
      mins: String(mins).padStart(2, "0"),
      secs: String(secs).padStart(2, "0"),
    };
  };

  const handleOptionSelect = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleEssayChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleQuestionChange = (index) => {
    setCurrentQuestion(index);
  };

  const handleClearResponse = () => {
    const qId = questions[currentQuestion].id;
    setAnswers({ ...answers, [qId]: null }); // instead of deleting the property
  };

  const getWordCount = (text) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  if (loading) {
    return <p className="text-center text-lg mt-10">Loading assignment...</p>;
  }

  if (!assignment) {
    return (
      <p className="text-center text-lg mt-10 text-red-500">
        No assignment found.
      </p>
    );
  }

  const { hrs, mins, secs } = formatTime(timeLeft);

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const submitAssignment = async () => {
  if (assignment?.completed) return; // already submitted

  try {
    await api.put(`/api/course/${id}/assignment/`, {
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        question_id: parseInt(questionId, 10),
        answer:
          typeof answer === "object" && !Array.isArray(answer)
            ? {
                mcq_answers: Object.entries(answer).map(
                  ([mcqId, val]) => ({ mcq_id: mcqId, value: val })
                ),
              }
            : answer || "",
      })),
    });

    await api.post(`/api/course/${id}/assignment/submit/`);

    setAssignment((prev) => ({ ...prev, completed: true }));
    exitFullScreen();
    // alert("Assignment submitted successfully!");
  } catch (error) {
    console.error("Error submitting assignment:", error);
  }
};

 


  if ((timeLeft === 0 || assignment?.completed) && started) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold mb-6">Test is finished!</h2>
        <p className="text-gray-600">
          Your assignment has been submitted .
        </p>
      </div>
    );
  }

  const handleParaMCQSelect = (mainQId, mcqId, optionValue) => {
    setAnswers((prev) => {
      const prevForQuestion = prev[mainQId] || {};
      return {
        ...prev,
        [mainQId]: {
          ...prevForQuestion,
          [mcqId]: optionValue, // store per-subquestion
        },
      };
    });
  };

  return !started ? (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-semibold mb-6">Ready to start the quiz?</h2>
      <button
        onClick={handleStart}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Start Quiz
      </button>
    </div>
  ) : (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <StudentHeader />

      {/* Top Section */}
      <div className="flex justify-between items-center bg-white shadow-md rounded-lg p-6 mx-4 my-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {assignment.title}
          </h2>
          <div className="flex items-center text-gray-600 mt-2">
            <FaRegClock className="text-orange-500 mr-2" />
            <span>{assignment.time_limit} minutes</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => {
              if (window.confirm("Are you sure you want to submit the quiz?")) {
                submitAssignment();
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 px-6 pb-8 space-x-8">
        {/* Left Side - Questions */}
        <div className="flex-1">
          <div className="border rounded-lg p-5 bg-gray-50">
            <h3 className="text-md font-semibold mb-3">
              Question {currentQuestion + 1} of {questions.length}
            </h3>
            <p className="text-gray-800 mb-3">
              {questions[currentQuestion].question}
            </p>

            {/* Image */}
            {questions[currentQuestion].image && (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/api${
                  questions[currentQuestion].image
                }`}
                alt="Question Media"
                className="rounded-md mb-3 max-h-56 object-contain"
              />
            )}

            {/* Audio */}
            {questions[currentQuestion].audio && (
              <audio controls className="mb-3">
                <source
                  src={`${import.meta.env.VITE_BACKEND_URL}/api${
                    questions[currentQuestion].audio
                  }`}
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
            )}

            {/* Paragraph for para_multiplechoice */}
            {questions[currentQuestion].question_type ===
              "para_multiplechoice" &&
              questions[currentQuestion].paragraph && (
                <div className="bg-gray-100 p-3 rounded-md mb-3">
                  <p className="text-gray-700">
                    {questions[currentQuestion].paragraph}
                  </p>
                </div>
              )}

            {/* Multiple Choice */}
            {questions[currentQuestion].question_type === "multiplechoice" &&
              questions[currentQuestion].options.length > 0 && (
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`block border rounded-md px-4 py-2 cursor-pointer transition ${
                        answers[questions[currentQuestion].id] === option.text
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questions[currentQuestion].id}`}
                        value={option.text}
                        checked={
                          answers[questions[currentQuestion].id] === option.text
                        }
                        onChange={(e) =>
                          handleOptionSelect(
                            questions[currentQuestion].id,
                            e.target.value
                          )
                        }
                        className="hidden"
                      />
                      {option.text}
                    </label>
                  ))}
                </div>
              )}
            {/* Para Multiple Choice - MCQs */}
            {questions[currentQuestion].question_type ===
              "para_multiplechoice" &&
              questions[currentQuestion].question_type ===
                "para_multiplechoice" &&
              questions[currentQuestion].mcqs.map((mcq) => (
                <div
                  key={mcq.id}
                  className="mb-4 border p-3 rounded-md bg-white"
                >
                  <p className="font-medium mb-2">{mcq.question}</p>

                  {/* MCQ Options */}
                  <div className="space-y-2">
                    {mcq.options.map((option, idx) => (
                      <label
                        key={idx}
                        className={`block border rounded-md px-4 py-2 cursor-pointer transition ${
                          answers[mcq.id] === option.text
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`mcq-${mcq.id}`}
                          value={option.text}
                          checked={
                            answers[questions[currentQuestion].id]?.[mcq.id] ===
                            option.text
                          }
                          onChange={() =>
                            handleParaMCQSelect(
                              questions[currentQuestion].id,
                              mcq.id,
                              option.text
                            )
                          }
                        />
                        {option.text}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

            {/* Essay */}
            {questions[currentQuestion].question_type === "essay" && (
              <div>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 mt-3 focus:outline-none focus:ring focus:ring-blue-200"
                  rows={5}
                  placeholder={`Write your answer (Max ${questions[currentQuestion].word_limit} words)`}
                  value={answers[questions[currentQuestion].id] || ""}
                  onChange={(e) =>
                    handleEssayChange(
                      questions[currentQuestion].id,
                      e.target.value
                    )
                  }
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">
                  Remaining words:{" "}
                  {questions[currentQuestion].word_limit -
                    getWordCount(answers[questions[currentQuestion].id] || "")}
                  {" / "}
                  {questions[currentQuestion].word_limit}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 space-x-3">
              <button
                onClick={() =>
                  setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev))
                }
                className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    prev < questions.length - 1 ? prev + 1 : prev
                  )
                }
                className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </button>
              <button
                onClick={handleClearResponse}
                className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Clear Response
              </button>
              <button
                onClick={() => {
                  const qId = questions[currentQuestion].id;
                  setMarkedForReview((prev) => ({
                    ...prev,
                    [qId]: !prev[qId], // toggle mark as review
                  }));
                }}
                className={`px-5 py-2 rounded ${
                  markedForReview[questions[currentQuestion].id]
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {markedForReview[questions[currentQuestion].id]
                  ? "Marked for Review"
                  : "Mark as Review"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Timer & Palette */}
        <div className="w-64 bg-white rounded-lg shadow p-5">
          {/* Timer */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-lg font-bold">{hrs}</p>
              <p className="text-sm text-gray-600">Hours</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-lg font-bold">{mins}</p>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-lg font-bold">{secs}</p>
              <p className="text-sm text-gray-600">Seconds</p>
            </div>
          </div>

          {/* Question Palette */}
          <h3 className="mt-6 font-semibold">Questions</h3>
          <div className="grid grid-cols-5 mt-3 gap-4">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => handleQuestionChange(index)}
                className={`w-10 h-10 rounded-lg font-bold ${
                  currentQuestion === index
                    ? "border border-green-600 "
                    : markedForReview[q.id]
                    ? "bg-yellow-400 text-white"
                    : answers[q.id]
                    ? "bg-blue-400 text-white"
                    : "bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          {/* Color indications / Legend */}
          <div className="mt-4 border-t pt-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Unanswered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Attempted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span>Mark as Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <StudentFooter />
    </div>
  );
};

export default FinalQuiz;
