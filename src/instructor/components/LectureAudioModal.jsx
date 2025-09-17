import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

const LectureAudioModal = ({ isOpen, onClose, onUpload, sectionId, lectureId, existingAudio }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile, sectionId, lectureId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FiX size={20} />
        </button>

        <h2 className="text-lg font-semibold text-[#00113D] mb-4">
          {existingAudio ? "Replace Audio" : "Upload Audio"}
        </h2>

        <div className="border border-gray-300 rounded-md p-6 text-center mb-4">
          <label className="text-sm text-gray-600 cursor-pointer">
            Drag & drop or <span className="underline">browse</span> audio file
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {selectedFile && (
            <p className="mt-2 text-sm text-green-600">🎵 {selectedFile.name}</p>
          )}

          {existingAudio && !selectedFile && (
            <a
              href={`${import.meta.env.VITE_BACKEND_URL}/api/media/${existingAudio}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm text-blue-600 underline"
            >
              🎵 View Existing Audio
            </a>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-[#00113D] font-medium rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className={`px-6 py-2 rounded text-white font-medium ${
              selectedFile ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-100 cursor-not-allowed"
            }`}
            disabled={!selectedFile}
          >
            {existingAudio ? "Update Audio" : "Upload Audio"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LectureAudioModal;
