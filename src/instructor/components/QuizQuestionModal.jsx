import React, { useState } from "react";
import { useEffect } from "react";
import music1 from "../../icons/music1.svg";
import dimage from "../../icons/dimage.svg";

const QuizQuestionModal = ({ onClose, onSave, existingQuestion }) => {
  const [questionType, setQuestionType] = useState("");
  const [question, setQuestion] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [mcqs, setMcqs] = useState([
    {
      question: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      image: null,
      audio: null,
    },
  ]);
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [wordLimit, setWordLimit] = useState(200); // default 200 words

  // Initialize state when editing existing question
  useEffect(() => {
    if (existingQuestion) {
      setQuestionType(existingQuestion.questionType || "");
      setQuestion(existingQuestion.question || "");
      setParagraph(existingQuestion.paragraph || "");
      setMcqs(existingQuestion.mcqs?.length ? existingQuestion.mcqs : mcqs);
      setOptions(
        existingQuestion.options?.length ? existingQuestion.options : options
      );
      setImage(existingQuestion.image || null);
      setAudio(existingQuestion.audio || null);
      setWordLimit(existingQuestion?.wordLimit || 200);
    } else {
      // Reset for new question
      setQuestionType("");
      setQuestion("");
      setParagraph("");
      setMcqs([
        {
          question: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
          image: null,
          audio: null,
        },
      ]);
      setOptions([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      setImage(null);
      setAudio(null);
    }
  }, [existingQuestion]);

  // Same handlers as before for MCQs, options, files...
  const handleOptionSelect = (index) => {
    setOptions((prevOptions) =>
      prevOptions.map((option, i) => ({
        ...option,
        isCorrect: i === index ? !option.isCorrect : false, // toggle clicked one
      }))
    );
  };

  const handleMcqOptionSelect = (mcqIndex, optionIndex) => {
    setMcqs((prevMcqs) =>
      prevMcqs.map((mcq, i) =>
        i === mcqIndex
          ? {
              ...mcq,
              options: mcq.options.map((option, j) => ({
                ...option,
                isCorrect: j === optionIndex ? !option.isCorrect : false, // toggle clicked one
              })),
            }
          : mcq
      )
    );
  };

  const handleOptionChange = (index, field, value) => {
    setOptions((prevOptions) =>
      prevOptions.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      )
    );
  };

  const handleMcqOptionChange = (mcqIndex, optionIndex, field, value) => {
    setMcqs((prevMcqs) =>
      prevMcqs.map((mcq, i) =>
        i === mcqIndex
          ? {
              ...mcq,
              options: mcq.options.map((option, j) =>
                j === optionIndex ? { ...option, [field]: value } : option
              ),
            }
          : mcq
      )
    );
  };

  const handleMcqQuestionChange = (mcqIndex, value) => {
    const updatedMcqs = [...mcqs];
    updatedMcqs[mcqIndex].question = value;
    setMcqs(updatedMcqs);
  };

  const handleMcqFileChange = (mcqIndex, type, file) => {
    const updatedMcqs = [...mcqs];
    updatedMcqs[mcqIndex][type] = file;
    setMcqs(updatedMcqs);
  };

  const addMcq = () => {
    setMcqs([
      ...mcqs,
      {
        question: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        image: null,
        audio: null,
      },
    ]);
  };

  const removeMcq = (mcqIndex) => {
    setMcqs(mcqs.filter((_, i) => i !== mcqIndex));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "image") setImage(file);
    else if (type === "audio") setAudio(file);
  };

  const handleSave = () => {
    const newQuestion = {
      questionType,
      question:
        questionType === "multiplechoice" || questionType === "essay"
          ? question
          : null,
      paragraph: questionType === "para_multiplechoice" ? paragraph : null,
      mcqs: questionType === "para_multiplechoice" ? mcqs : [],
      options: questionType === "multiplechoice" ? options : [],
      image,
      audio,
      wordLimit: questionType === "essay" ? wordLimit : null, // ✅ Save word limit
    };
    onSave(newQuestion);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#00000080] z-[9999]">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative z-[10000] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-2 right-4 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4">Add your Questions here</h2>

        {/* Select Question Type */}
        <label className="block mb-2 font-medium">
          Select the type of Question
        </label>
        <select
          className="w-full border border-[#E9EAF0] rounded px-3 py-2 mb-4"
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
        >
          <option value="" disabled>
            Select...
          </option>
          <option value="multiplechoice">Multiple Choice</option>
          <option value="para_multiplechoice">
            Paragraph with Multiple Choice
          </option>
          <option value="essay">Essay Writing</option>
        </select>

        {/* Paragraph + Multiple MCQs */}
        {questionType === "para_multiplechoice" && (
          <>
            {/* Paragraph */}
            <textarea
              placeholder="Enter the Paragraph"
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              className="w-full border border-[#E9EAF0] rounded px-3 py-2 mb-6"
              rows={5}
            />

            {/* Upload Options for Paragraph */}
            <div className="flex gap-4 mb-4">
              <label className="bg-gray-200 px-4 py-2 rounded cursor-pointer flex items-center gap-2">
                <img src={dimage} alt="Upload" className="w-5 h-5" />
                Upload Paragraph Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>

              {/* Upload Paragraph Audio */}
              <label className="bg-gray-200 px-4 py-2 rounded cursor-pointer flex items-center gap-2">
                <img src={music1} alt="Audio" className="w-5 h-5" />
                Upload Paragraph Audio
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => setAudio(e.target.files[0])}
                />
              </label>
            </div>

            {/* Preview for Paragraph Image */}
            {image && (
              <img
                src={
                  image instanceof File
                    ? URL.createObjectURL(image)
                    : `${import.meta.env.VITE_BACKEND_URL}/api${image}`
                }
                alt="Paragraph Preview"
                className="w-32 h-32 object-cover rounded mb-3"
              />
            )}

            {/* Preview for Paragraph Audio */}
            {audio && (
              <audio
                controls
                className="mb-3 w-full"
                src={
                  audio instanceof File
                    ? URL.createObjectURL(audio)
                    : `${import.meta.env.VITE_BACKEND_URL}/api${audio}`
                }
              />
            )}

            {/* Multiple MCQs */}
            <h3 className="font-semibold mb-3">Add MCQs for the Paragraph</h3>
            {mcqs.map((mcq, mcqIndex) => (
              <div
                key={mcqIndex}
                className="border border-[#E9EAF0] p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
              >
                {/* MCQ Question */}
                <textarea
                  placeholder={`Question ${mcqIndex + 1}`}
                  value={mcq.question}
                  onChange={(e) =>
                    handleMcqQuestionChange(mcqIndex, e.target.value)
                  }
                  className="w-full border border-[#E9EAF0] rounded px-3 py-2 mb-3"
                />

                {/* Upload Options Under Question */}
                <div className="flex gap-4 mb-4">
                  <label className="bg-gray-200 px-4  rounded cursor-pointer  flex items-center gap-2">
                    <img src={dimage} alt="Upload" className="w-5 h-5" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleMcqFileChange(
                          mcqIndex,
                          "image",
                          e.target.files[0]
                        )
                      }
                    />
                  </label>
                  <label className="bg-gray-200 px-4 py-2 rounded cursor-pointer flex items-center gap-2">
                    <img src={music1} alt="Audio" className="w-5 h-5" />
                    Upload Audio
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) =>
                        handleMcqFileChange(
                          mcqIndex,
                          "audio",
                          e.target.files[0]
                        )
                      }
                    />
                  </label>
                </div>

                {/* Preview for MCQ Image */}
                {mcq.image && (
                  <img
                    src={
                      mcq.image instanceof File
                        ? URL.createObjectURL(mcq.image)
                        : `${import.meta.env.VITE_BACKEND_URL}/api/media/${mcq.image}`
                    }
                    alt="MCQ Preview"
                    className="w-32 h-32 object-cover rounded mb-3"
                  />
                )}

                {/* Preview for MCQ Audio */}
                {mcq.audio && (
                  <audio
                    controls
                    className="mb-3 w-full"
                    src={
                      mcq.audio instanceof File
                        ? URL.createObjectURL(mcq.audio)
                        : `${import.meta.env.VITE_BACKEND_URL}/api/media/${mcq.audio}`
                    }
                  />
                )}

                {/* MCQ Options */}
                <h4 className="font-medium mb-2">Options</h4>
                {mcq.options.map((option, optionIndex) => (
                  <div key={optionIndex} className=" items-center gap-4 mb-3">
                    <input
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option.text}
                      onChange={(e) =>
                        handleMcqOptionChange(
                          mcqIndex,
                          optionIndex,
                          "text",
                          e.target.value
                        )
                      }
                      className="flex-1 border border-[#E9EAF0] rounded px-3 py-2 mb-2 w-full"
                    />
                    <label className="flex items-center gap-2 ">
                      <input
                        type="radio"
                        checked={option.isCorrect}
                        onClick={() =>
                          handleMcqOptionSelect(mcqIndex, optionIndex)
                        }
                        className="border border-[#E9EAF0] rounded"
                      />

                      {option.isCorrect
                        ? "Mark as Incorrect"
                        : "Mark as Correct"}
                    </label>
                  </div>
                ))}

                {/* Remove MCQ Button */}
                {mcqs.length > 1 && (
                  <button
                    onClick={() => removeMcq(mcqIndex)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove Question
                  </button>
                )}
              </div>
            ))}

            {/* Add New MCQ */}
            <button
              onClick={addMcq}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              + Add Another MCQ
            </button>
          </>
        )}

        {/* Single Question (MCQ & Essay) */}
        {(questionType === "multiplechoice" || questionType === "essay") && (
          <>
            {/* Question Input */}
            <textarea
              placeholder="Enter the Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-[#E9EAF0] rounded px-3 py-2 mb-4"
            />

            {/* Upload Options Under Question */}
            <div className="flex gap-4 mb-4">
              <label className="bg-gray-200 px-4 py-2 rounded cursor-pointer flex items-center gap-2">
                <img src={dimage} alt="Upload" className="w-5 h-5" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "image")}
                />
              </label>
              <label className="bg-gray-200 px-4 py-2 rounded cursor-pointer flex items-center gap-2">
                <img src={music1} alt="Audio" className="w-5 h-5" />
                Upload Audio
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "audio")}
                />
              </label>
            </div>

            {questionType === "essay" && (
              <div className="mb-4">
                <label className="block font-medium">
                  Maximum Words for Answer
                </label>
                <input
                  type="number"
                  min="10"
                  value={wordLimit}
                  onChange={(e) => setWordLimit(Number(e.target.value))}
                  className="w-full border border-[#E9EAF0] rounded px-3 py-2 mt-1"
                />
              </div>
            )}

            {/* Preview for Main Image */}
            {image && (
              <img
                src={
                  image instanceof File
                    ? URL.createObjectURL(image)
                    : `${import.meta.env.VITE_BACKEND_URL}/api${image}`
                }
                alt="Preview"
                className="w-32 h-32 object-cover rounded mb-3"
              />
            )}

            {/* Preview for Main Audio */}
            {audio && (
              <audio
                controls
                className="mb-3 w-full"
                src={
                  audio instanceof File
                    ? URL.createObjectURL(audio)
                    : `${import.meta.env.VITE_BACKEND_URL}/api${audio}`
                }
              />
            )}
          </>
        )}

        {/* Options Section for single MCQ */}
        {questionType === "multiplechoice" && (
          <>
            <h3 className="font-semibold mb-2">Enter the options</h3>
            {options.map((option, index) => (
              <div key={index} className=" items-center gap-4 mb-3">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(index, "text", e.target.value)
                  }
                  className="flex-1 border border-[#E9EAF0] rounded px-3 py-2 w-full"
                />
                <label className="flex items-center gap-2 mt-2 text-[#121417]">
                  <input
                    type="radio"
                    checked={option.isCorrect}
                    onClick={() => handleOptionSelect(index)}
                    className="border border-[#E9EAF0] rounded"
                  />

                  {option.isCorrect ? "Mark as InCorrect" : "Mark as correct"}
                </label>
              </div>
            ))}
          </>
        )}

        {/* Buttons */}
        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className=" text-red-500 px-4 py-2 rounded hover:bg-red-100 transition border border-red-500"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className=" text-[#58A6FD] px-4 py-2 rounded hover:bg-blue-100 border border-[#58A6FD] transition"
          >
            Save & Next
          </button>

          <button
            onClick={handleSave}
            className="text-[#58A6FD] px-4 py-2 rounded hover:bg-blue-100 transition border border-[#58A6FD]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestionModal;
