import React, { useEffect, useState } from 'react';

const EditSectionModal = ({ isOpen, onClose, sectionName, onSave }) => {
  const [name, setName] = useState(sectionName);

  // Ensure input resets if sectionName changes when modal opens
  useEffect(() => {
    if (isOpen) setName(sectionName);
  }, [isOpen, sectionName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#00000080] flex justify-center items-center">
      <div className="bg-white w-full max-w-md rounded shadow-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#00113D]">Edit Section Name</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 mb-4"
          placeholder="Write your section name here..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-[#00113D] font-medium rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(name);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSectionModal;
