import React, { useEffect, useState } from "react";

const EditLectureModal = ({ isOpen, onClose, lectureName, onSave }) => {
  const [name, setName] = useState(lectureName);

  // Reset input when modal opens or lectureName changes
  useEffect(() => {
    if (isOpen) setName(lectureName);
  }, [isOpen, lectureName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#00000080] flex justify-center items-center">
      <div className="bg-white w-full max-w-md rounded shadow-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#00113D]">Edit Lecture Name</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
        </div>

        {/* Input */}
        <label className="block text-sm font-medium text-gray-700 mb-1">Lecture</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 mb-4"
          placeholder="Write your lecture name here..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-[#00113D] font-medium rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim() === "") {
                alert("Lecture name cannot be empty!");
                return;
              }
              onSave(name);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLectureModal;
