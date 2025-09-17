import React, { useEffect, useState } from "react";
import api from "../../api"; // ✅ axios instance

const QuizReport = ({ courseId , onBack }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(
          `/api/student/course/${courseId}/assignment-report/`
        );
        setReport(res.data);
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchReport();
    }
  }, [courseId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!report) return <div className="p-6">No report found.</div>;

  const { assignment_title, student_submission } = report;

  return (
    <div className="p-6 bg-white rounded shadow">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
      >
        ← Back
      </button>
      {/* <h2 className="text-2xl font-bold mb-4">{assignment_title} - Report</h2> */}

      {/* Student Info */}
      {/* <div className="mb-6 p-4 border rounded bg-gray-50 flex gap-4 items-center">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/api${
            student_submission.profile_picture
          }`}
          alt="Student"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">
            {student_submission.student_name}
          </h3>
          <p className="text-sm text-gray-600">{student_submission.email}</p>
          <p className="text-sm text-gray-500">
            Submitted At:{" "}
            {new Date(student_submission.submitted_at).toLocaleString()}
          </p>
        </div>
      </div> */}

      {/* Answers */}
      <div>
        {student_submission.answers.map((ans, idx) => (
          <div key={ans.answer_id} className="mb-6 p-4 border border-gray-200 rounded text-sm">
           <div className="mb-3">
  <h3 className="text-lg font-bold text-gray-900">
    Question {idx + 1}
  </h3>
  <p className="text-base text-gray-800 mt-1">
    {ans.question_text}
  </p>
</div>


            {/* Paragraph */}
            {ans.paragraph && (
              <p className="italic text-gray-600 mb-2">{ans.paragraph}</p>
            )}

            {/* Question Image */}
            {ans.question_image && (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/api${
                  ans.question_image
                }`}
                alt="Question"
                className="my-2 max-h-48 rounded"
              />
            )}

            {/* Question Audio */}
            {ans.question_audio && (
              <audio
                controls
                src={`${import.meta.env.VITE_BACKEND_URL}/api${
                  ans.question_audio
                }`}
                className="my-2 w-xl"
              />
            )}

            {/* Options (MCQ) */}
            {ans.options && (
              <div className="space-y-2 mt-3">
                {ans.options.map((opt, i) => {
                  const isStudentAnswer = ans.answer === opt.text;
                  const isCorrect = opt.isCorrect;

                  return (
                    <div
                      key={i}
                      className={`px-4 py-2 rounded-lg border font-medium
            ${isCorrect ? "bg-green-200 border-gray-200 " : ""}
            ${
              isStudentAnswer && !isCorrect
                ? "bg-red-500 text-white border-red-600"
                : ""
            }
            ${
              !isCorrect && !isStudentAnswer
                ? "bg-gray-100 text-gray-700 border-gray-300"
                : ""
            }
          `}
                    >
                      {opt.text}
                      {isStudentAnswer && !isCorrect && " (Your Answer)"}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Para-MCQs */}
            {ans.mcqs && (
              <div className="mb-2 space-y-4">
                {ans.mcqs.map((q, i) => (
                  <div key={i} className="mb-4">
                    <p className="text-sm font-medium">{q.question}</p>

                    {/* Image inside MCQ */}
                    {q.image && (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/api/media/${
                          q.image
                        }`}
                        alt="MCQ"
                        className="my-2 max-h-40 rounded"
                      />
                    )}

                    {/* Audio inside MCQ */}
                    {q.audio && (
                      <audio
                        controls
                        src={`${import.meta.env.VITE_BACKEND_URL}/api/media/${
                          q.audio
                        }`}
                        className="my-2 w-xl"
                      />
                    )}

                    <div className="space-y-2 mt-2">
                      {q.options.map((opt, j) => {
                        const isStudentAnswer = q.answer === opt.text;
                        const isCorrect = opt.isCorrect;

                        return (
                          <div
                            key={j}
                            className={`px-4 py-2 rounded-lg border font-medium
                  ${isCorrect ? "bg-green-200 border-gray-200 " : ""}
                  ${
                    isStudentAnswer && !isCorrect
                      ? "bg-red-500 text-white border-red-600"
                      : ""
                  }
                  ${
                    !isCorrect && !isStudentAnswer
                      ? "bg-gray-100 text-gray-700 border-gray-300"
                      : ""
                  }
                `}
                          >
                            {opt.text}
                            {isStudentAnswer && !isCorrect && " (Your Answer)"}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Essay / Normal Answer */}
            {ans.answer && (
              <p className="mb-2">
                <strong>Your Answer:</strong> {ans.answer}
              </p>
            )}

            {/* Correct Answer */}
            {/* {ans.correct_option && (
              <p className="text-green-700 mb-2">
                <strong>Correct Answer:</strong> {ans.correct_option}
              </p>
            )} */}

            {/* Suggestions */}
            {ans.suggestions && ans.suggestions.length > 0 && (
              <div className="mt-3 p-3 border-t bg-gray-50">
                <h4 className="text-sm font-semibold mb-2">Suggestions:</h4>
                <ul className="list-disc ml-6 text-sm text-gray-700">
                  {ans.suggestions.map((s) => (
                    <li key={s.id}>
                      Replace{" "}
                      <span className="text-red-600">"{s.selected_text}"</span>{" "}
                      with{" "}
                      <span className="text-green-600">
                        {s.suggestion_text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizReport;
