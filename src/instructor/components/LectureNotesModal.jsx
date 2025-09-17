import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Meta } from 'react-router-dom';

const LectureNotesModal = ({ isOpen, onClose, onSave, sectionId, lectureId, existingNotes }) => {
  const [noteText, setNoteText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);

  // Prefill notes and file if available
  useEffect(() => {
  if (isOpen) {
    setNoteText(existingNotes?.noteText || '');
    setAttachedFile(existingNotes?.attachedFile || null);
  }
  // ✅ Run only when modal opens, not when selecting a file
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleSave = () => {
    if (noteText.trim() || attachedFile) {
      onSave({ noteText, attachedFile }, sectionId, lectureId);  // ✅ Pass updated data
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]">
      <div className="bg-white w-full max-w-xl shadow-lg p-6 relative">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={20} />
        </button>

        <h2 className="font-semibold text-[#00113D] mb-4">
          {existingNotes?.noteText || existingNotes?.attachedFile ? 'Edit Lecture Notes' : 'Add Lecture Notes'}
        </h2>

        {/* Notes Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            rows={5}
            className="w-full border border-gray-300 rounded-md p-3 resize-none"
            placeholder="Write your lecture notes here..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </div>

        {/* Upload Box */}
        <div className="mb-6 border border-gray-300 rounded-md p-6 text-center">
          <p className="text-md font-semibold text-[#00113D] mb-1">Upload Notes</p>
          <label className="text-sm text-gray-500 cursor-pointer">
            Drag and drop a file or <span className="underline">browse file</span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Show existing uploaded file */}
          {attachedFile && typeof attachedFile === 'object' && (
            <p className="mt-2 text-sm text-green-600">📄 {attachedFile.name}</p>
          )}
          {attachedFile && typeof attachedFile === 'string' && (
            <p className="mt-2 text-sm text-blue-600 underline cursor-pointer">
              <a href={`${import.meta.env.VITE_BACKEND_URL}/api/media/${attachedFile}`} target="_blank" rel="noopener noreferrer">
                📄 View Existing Notes
              </a>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-[#00113D] font-medium rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-2 rounded text-white font-medium ${
              noteText.trim() || attachedFile
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-100 cursor-not-allowed'
            }`}
            disabled={!noteText.trim() && !attachedFile}
          >
            {existingNotes?.noteText || existingNotes?.attachedFile ? 'Update Notes' : 'Add Notes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LectureNotesModal;
