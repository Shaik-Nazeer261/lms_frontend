import  { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const LectureNotesModal = ({ isOpen, onClose, onSave, sectionId, lectureId }) => {
  const [noteText, setNoteText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setNoteText('');
      setAttachedFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleSave = () => {
    if (noteText.trim() || attachedFile) {
      onSave({ noteText, attachedFile }, sectionId, lectureId);  // ✅ pass context
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]">
      <div className="bg-white w-full max-w-xl shadow-lg p-6 relative">
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={20} />
        </button>

        <h2 className="font-semibold text-[#00113D] mb-4">Add Lecture Notes</h2>

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
          {attachedFile && (
            <p className="mt-2 text-sm text-green-600">📄 {attachedFile.name}</p>
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
            Add Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default LectureNotesModal;
