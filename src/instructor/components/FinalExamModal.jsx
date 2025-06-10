import React, { useEffect, useState } from "react";
import { FiX, FiTrash, FiPlus } from "react-icons/fi";
import mammoth from "mammoth";

import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const FinalExamModal = ({ isOpen, onClose, onSave }) => {
  const [questions, setQuestions] = useState([
    { question_text: "", correct_answer: "", options: [] },
  ]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuestions([{ question_text: "", correct_answer: "", options: [] }]);
      setFocusedIndex(0);
    }
  }, [isOpen]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question_text: "", correct_answer: "", options: [] },
    ]);
    setFocusedIndex(questions.length); // focus new one
  };

  const handleRemoveQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
    if (focusedIndex >= updated.length) setFocusedIndex(updated.length - 1);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question_text = value;
    setQuestions(updated);
    setFocusedIndex(index);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const updated = [...questions];
    updated[index].correct_answer = value;
    setQuestions(updated);
  };

  const handleAddOption = (index, value) => {
    const trimmed = value.trim();
    if (trimmed) {
      const updated = [...questions];
      updated[index].options.push(trimmed);
      setQuestions(updated);
    }
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const handleSave = () => {
    onSave(questions); // Send entire final exam data
    onClose();
  };

  const handleFileRead = async (file) => {
    let text = "";

    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join("\n");
        text += pageText + "\n";
      }
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else {
      alert("Only PDF or DOCX files supported.");
      return;
    }

    parseTextToQuestions(text);
  };

  const parseTextToQuestions = (text) => {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const parsedQuestions = [];
    let currentQuestion = null;

    lines.forEach((line) => {
      if (/^Q\d+[:.]/i.test(line)) {
        if (currentQuestion) parsedQuestions.push(currentQuestion);
        currentQuestion = {
          question_text: line.replace(/^Q\d+[:.]\s*/, ""),
          options: [],
          correct_answer: "",
        };
      } else if (/^[A-Da-d][).]/.test(line)) {
        const option = line.replace(/^[A-Da-d][).]\s*/, "");
        currentQuestion?.options.push(option);
      } else if (/^Answer[:]?/i.test(line)) {
        const answer = line.replace(/^Answer[:]?/i, "").trim();
        currentQuestion.correct_answer = answer;
      }
    });

    if (currentQuestion) parsedQuestions.push(currentQuestion);

    console.log("✅ Parsed Questions:", parsedQuestions);
    setQuestions(parsedQuestions);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] shadow-lg relative flex flex-col rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <FiX size={20} />
        </button>

        <div className="overflow-y-auto p-6 pr-3" style={{ maxHeight: "75vh" }}>
          <h2 className="text-lg font-semibold text-[#00113D] mb-4">
            Final Exam - Add Questions
          </h2>

          {/*<div className="mb-4">
            <label className="block font-semibold mb-1">
              Upload Exam File (PDF/DOCX)
            </label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => handleFileRead(e.target.files[0])}
              className="w-full"
            />
          </div>*/}

          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="mb-6 border border-gray-200 p-4 rounded"
            >
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-semibold">Question {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <button
                    onClick={() => handleRemoveQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash />
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Question text"
                value={q.question_text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className="w-full mb-2 border px-3 py-2 rounded"
                onFocus={() => setFocusedIndex(qIndex)}
              />

              {focusedIndex === qIndex && (
                <>
                  <input
                    type="text"
                    placeholder="Correct Answer"
                    value={q.correct_answer}
                    onChange={(e) =>
                      handleCorrectAnswerChange(qIndex, e.target.value)
                    }
                    className="w-full mb-2 border px-3 py-2 rounded"
                  />

                  <label className="text-xs text-gray-600">Options</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {q.options.map((opt, oIndex) => (
                      <div
                        key={oIndex}
                        className="flex items-center bg-gray-100 text-sm px-2 py-1 rounded-full"
                      >
                        {opt}
                        <FiX
                          className="ml-2 cursor-pointer text-red-500"
                          onClick={() => handleRemoveOption(qIndex, oIndex)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex">
                    <input
                      type="text"
                      className="w-full border px-3 py-2 rounded-l"
                      placeholder="Type option and press Add"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddOption(qIndex, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-r"
                      onClick={(e) => {
                        const input = e.target.previousSibling;
                        handleAddOption(qIndex, input.value);
                        input.value = "";
                      }}
                    >
                      Add
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          <button
            className="text-sm text-blue-600 flex items-center mb-4"
            onClick={handleAddQuestion}
          >
            <FiPlus className="mr-1" /> Add Question
          </button>
        </div>

        <div className="border-t px-6 py-4 flex justify-between bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-[#00113D] rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalExamModal;
