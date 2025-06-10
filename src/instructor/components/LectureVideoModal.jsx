import React, { useEffect, useRef, useState } from 'react';

const LectureVideoModal = ({ isOpen, onClose, onUpload, sectionId, lectureId }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setVideoFile(null);
      setPreviewURL(null);
      setVideoDuration(null);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const videoURL = URL.createObjectURL(file);
      setPreviewURL(videoURL);

      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = videoURL;
      video.onloadedmetadata = () => {
        const seconds = Math.floor(video.duration);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        setVideoDuration(`${minutes}:${remainingSeconds.toString().padStart(2, '0')}`);
      };
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleUpload = () => {
    if (videoFile) {
      onUpload(videoFile, sectionId, lectureId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#00113D]">Upload Lecture Video</h2>
          <button onClick={onClose} className="text-gray-500 text-xl hover:text-gray-700">&times;</button>
        </div>

        {/* Drop Zone */}
        <div
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border border-gray-300 border-dashed rounded-md h-40 flex flex-col justify-center items-center cursor-pointer text-center mb-6"
        >
          {previewURL ? (
            <>
              <video
                src={previewURL}
                className="w-40 h-28 object-cover rounded-md mb-2"
                controls={false}
                muted
              />
              <p className="font-medium text-blue-700">{videoFile?.name}</p>
              {videoDuration && (
                <p className="text-xs text-gray-500 mt-1">Duration: {videoDuration}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Click to change or drop another video</p>
            </>
          ) : (
            <>
              <p className="text-md font-semibold text-[#00113D] mb-1">Upload Video</p>
              <p className="text-sm text-gray-500">
                Drag and drop a file or <span className="font-medium text-gray-600 underline">browse</span>
              </p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-[#00113D] font-semibold rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!videoFile}
            className={`px-6 py-2 font-semibold text-white rounded ${
              videoFile ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-100 cursor-not-allowed'
            }`}
          >
            Upload Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default LectureVideoModal;
