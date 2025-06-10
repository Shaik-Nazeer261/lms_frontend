import  { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const LectureCaptionModal = ({ isOpen, onClose, onSave, sectionId, lectureId }) => {
  const [caption, setCaption] = useState('');

  useEffect(() => {
    if (isOpen) setCaption(''); // Clear previous input when modal is reopened
  }, [isOpen]);

  const handleSave = () => {
    if (caption.trim()) {
      onSave(caption, sectionId, lectureId); // ✅ Pass IDs to parent
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]">
      <div className="bg-white w-full max-w-xl shadow-lg p-6 relative">
        {/* Close Icon */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FiX size={20} />
        </button>

        <h2 className="font-semibold text-[#00113D] mb-4">Add Lecture Caption</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3 resize-none"
            placeholder="Write your lecture caption here..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-[#00113D] font-medium rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!caption.trim()}
            className={`px-6 py-2 rounded text-white font-medium ${
              caption.trim()
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-100 cursor-not-allowed'
            }`}
          >
            Add Caption
          </button>
        </div>
      </div>
    </div>
  );
};

export default LectureCaptionModal;
