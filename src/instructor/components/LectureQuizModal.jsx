import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash } from 'react-icons/fi';

const LectureQuizModal = ({ isOpen, onClose, onSave, sectionId, lectureId }) => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ question_text: '', correct_answer: '', options: [], showOptions: true }]);
  const [focusedQuestionIndex, setFocusedQuestionIndex] = useState(0); // default to first question


  useEffect(() => {
    if (isOpen) {
      setQuizTitle('');
      setQuestions([{ question_text: '', correct_answer: '', options: [], showOptions: true }]);
    }
  }, [isOpen]);

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { question_text: '', correct_answer: '', options: [], showOptions: false }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleQuestionChange = (index, value) => {
  setFocusedQuestionIndex(index); // activate this question
  const updated = [...questions];
  updated[index].question_text = value;
  setQuestions(updated);
};


  const handleCorrectAnswerChange = (index, value) => {
    const updated = [...questions];
    updated[index].correct_answer = value;
    setQuestions(updated);
  };

  const handleAddOption = (index, value) => {
    if (value.trim()) {
      const updated = [...questions];
      updated[index].options.push(value.trim());
      setQuestions(updated);
    }
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const handleSave = () => {
    const payload = questions.map(({ showOptions, ...q }) => q); // strip UI-only field
    onSave({ quizTitle, questions: payload }, sectionId, lectureId);
    onClose();
  };

  if (!isOpen) return null;

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]">
    <div className="bg-white w-full max-w-2xl max-h-[90vh] shadow-lg relative flex flex-col rounded-lg overflow-hidden">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
      >
        <FiX size={20} />
      </button>

      {/* Scrollable content */}
      <div className="overflow-y-auto p-6 pr-3" style={{ maxHeight: '75vh' }}>
        <h2 className="text-lg font-semibold text-[#00113D] mb-4">Add Quiz</h2>

        {/* Quiz Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Quiz Title</label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter quiz title"
          />
        </div>

        {/* Questions */}
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-6 border border-gray-200 p-4 rounded relative">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-semibold">Question {qIndex + 1}</h3>
              {questions.length > 1 && (
                <button onClick={() => handleRemoveQuestion(qIndex)} className="text-red-500 hover:text-red-700">
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
              onFocus={() => setFocusedQuestionIndex(qIndex)}

            />

            {focusedQuestionIndex === qIndex && (
              <>
                <input
                  type="text"
                  placeholder="Correct Answer"
                  value={q.correct_answer}
                  onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                  className="w-full mb-2 border px-3 py-2 rounded"
                />

                <label className="text-xs text-gray-600">Options</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center bg-gray-100 text-sm px-2 py-1 rounded-full">
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
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddOption(qIndex, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-r"
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      handleAddOption(qIndex, input.value);
                      input.value = '';
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

      {/* Footer */}
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
          Save Quiz
        </button>
      </div>
    </div>
  </div>
);

};

export default LectureQuizModal;
