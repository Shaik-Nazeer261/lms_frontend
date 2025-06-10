import React, { useRef, useState, useEffect } from 'react';

const AttachFileModal = ({ isOpen, onClose, onAttach, sectionId, lectureId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null); // Clear previous file when modal opens
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAttach = () => {
    if (selectedFile) {
      onAttach(selectedFile, sectionId, lectureId); // ✅ Pass IDs to parent
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-[#00113D]">Attach File</h2>
          <button onClick={onClose} className="text-gray-500 text-xl hover:text-gray-700">&times;</button>
        </div>

        {/* Drop Zone */}
        <div
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border border-gray-300 border-dashed rounded-md h-40 flex flex-col justify-center items-center cursor-pointer text-center mb-6"
        >
          {selectedFile ? (
            <>
              <p className="font-medium text-blue-700">{selectedFile.name}</p>
              <p className="text-xs text-gray-500 mt-1">Click to change or drop another file</p>
            </>
          ) : (
            <>
              <p className="text-md font-semibold text-[#00113D] mb-1">Attach File</p>
              <p className="text-sm text-gray-500">
                Drag and drop a file or <span className="font-medium text-gray-600 underline">browse file</span>
              </p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between">
          <button onClick={onClose} className="px-6 py-2 bg-gray-100 text-[#00113D] font-semibold rounded">
            Cancel
          </button>
          <button
            onClick={handleAttach}
            disabled={!selectedFile}
            className={`px-6 py-2 font-semibold text-white rounded ${
              selectedFile ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-100 cursor-not-allowed'
            }`}
          >
            Attach File
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachFileModal;
