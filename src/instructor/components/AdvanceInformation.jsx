import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import image from "../../icons/image.svg";
import bpc from "../../icons/bpc.svg";
import JoditEditor from "jodit-react";
import api from "../../api"; // adjust this import if needed

const AdvanceInformation = ({ goToTab, courseId }) => {
  const [whatYouWillLearn, setWhatYouWillLearn] = useState(["", "", "", ""]);
  const [targetAudience, setTargetAudience] = useState(["", "", "", ""]);
  const [requirements, setRequirements] = useState(["", "", "", ""]);
  const [thumbnail, setThumbnail] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const editor = useRef(null);
  const [description, setDescription] = useState("");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role; // "instructor" or "admin"
  const [suggestion, setSuggestion] = useState(null); // ✅ new
  const [approvalStatus, setApprovalStatus] = useState(null); // ✅ new
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
    }),
    []
  );

  const handleChange = (listSetter, index, value) => {
    listSetter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAdd = (listSetter) => {
    listSetter((prev) => [...prev, ""]);
  };

  useEffect(() => {
    const fetchAdvancedInfo = async () => {
      if (!courseId) return;

      try {
        const res = await api.get(
          `/api/instructor/update-course/${courseId}/advanced/`
        );

        const data = res.data;

        setDescription(data.description || "");
        setWhatYouWillLearn(data.learning_objectives || [""]);
        setTargetAudience(data.target_audiences || [""]);
        setRequirements(data.requirements || [""]);
        setApprovalStatus(data.is_advanced_approved);
        setSuggestion(data.advanced_suggestions);

        // Optional: preload preview URLs for course_image and demo_video
        if (data.course_image) {
          setThumbnail(
            `${import.meta.env.VITE_BACKEND_URL}/api${data.course_image}`
          );
        }
        if (data.demo_video) {
          setTrailer(
            `${import.meta.env.VITE_BACKEND_URL}/api${data.demo_video}`
          );
        }
      } catch (error) {
        console.error("Failed to load advanced info", error);
      }
    };

    fetchAdvancedInfo();
  }, [courseId]);

  const handleSubmit = async (moveNext = false) => {
    if (!courseId) {
      alert("No draft course ID found.");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    whatYouWillLearn.forEach((item) => formData.append("objectives[]", item));
    targetAudience.forEach((item) =>
      formData.append("target_audiences[]", item)
    );
    requirements.forEach((item) => formData.append("requirements[]", item));
    if (thumbnail) formData.append("course_image", thumbnail);
    if (trailer) formData.append("demo_video", trailer);

    try {
      const res = await api.put(
        `/api/instructor/update-course/${courseId}/advanced/`,
        formData
      );

      if (res.status === 200) {
        alert("Advanced info saved successfully ✅");

        // ✅ Move to curriculum tab only if Save & Next is clicked
        if (moveNext) {
          goToTab("curriculum");
        }
      } else {
        alert("Failed to save. Check your inputs.");
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

  const trailerPreview = useMemo(() => {
    if (!trailer) return null;
    return trailer instanceof File ? URL.createObjectURL(trailer) : trailer; // backend URL
  }, [trailer]);

  const handleSuggestionSubmit = async () => {
    try {
      const response = await api.put(
        `/api/admin/course-advanced-approval/${courseId}/`,
        {
          is_advanced_approved: false,
          advanced_suggestions: suggestionText,
        }
      );

      if (response.status === 200) {
        alert("Suggestion saved ✅");
        setSuggestion(response.data.advanced_suggestions);
        setApprovalStatus(response.data.is_advanced_approved);
        setShowSuggestionModal(false);
        setSuggestionText("");
      }
    } catch (err) {
      console.error("Error saving suggestion:", err);
      alert("Failed to save suggestion");
    }
  };

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-semibold text-[#00113D]">
        Advance Informations
      </h2>

      {suggestion && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-[#00113D] mb-2">
            Suggestion
          </h3>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Message</p>
            <div className="bg-gray-100 border border-gray-300 rounded-md p-4 text-gray-800 text-sm">
              {suggestion}
            </div>
          </div>
        </div>
      )}

      {/* Upload section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Course Thumbnail */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#00113D]">
            Course Thumbnail
          </h3>
          <div className="flex gap-6 items-start">
            <div className="w-64 h-36 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
              <img
                src={
                  thumbnail instanceof File
                    ? URL.createObjectURL(thumbnail)
                    : thumbnail || image
                }
                alt="thumbnail"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs text-gray-600 mb-1">
                Upload your course Thumbnail here.{" "}
                <span className="font-semibold text-[#00113D]">1200x800</span>.
              </p>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Course Trailer */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#00113D]">
            Course Trailer
          </h3>
          <div className="flex gap-6 items-start">
            <div className="w-64 h-36 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
              {trailerPreview ? (
                <video controls className="object-contain w-full h-full">
                  <source src={trailerPreview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={bpc}
                  alt="trailer"
                  className="object-contain w-20 h-20"
                />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs text-gray-600 mb-4 max-w-md">
                Students watching a promo video are <strong>5–10x</strong> more
                likely to enroll.
              </p>
              <input
                type="file"
                accept="video/mp4"
                onChange={(e) => setTrailer(e.target.files[0])}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Course Description
        </label>
        <JoditEditor
          ref={editor}
          value={description}
          onChange={setDescription}
          config={config}
        />
      </div>

      {/* Reusable Sections */}
      {[
        {
          title: "What you will teach in this course",
          data: whatYouWillLearn,
          setter: setWhatYouWillLearn,
        },
        {
          title: "Target Audience",
          data: targetAudience,
          setter: setTargetAudience,
        },
        {
          title: "Course requirements",
          data: requirements,
          setter: setRequirements,
        },
      ].map((section, idx) => (
        <div key={idx}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700">
              {section.title} ({section.data.length}/8)
            </h3>
            {section.data.length < 8 && (
              <button
                className="text-blue-600 text-sm font-medium"
                onClick={() => handleAdd(section.setter)}
              >
                + Add new
              </button>
            )}
          </div>
          {section.data.map((item, index) => (
            <div key={index} className="mb-3 relative">
              <label className="text-xs text-gray-400 ml-1">
                {String(index + 1).padStart(2, "0")}
              </label>

              <div className="relative">
                <input
                  type="text"
                  maxLength={120}
                  placeholder={`${section.title}...`}
                  value={item}
                  onChange={(e) =>
                    handleChange(section.setter, index, e.target.value)
                  }
                  className="w-full border border-gray-300 px-4 py-2 pr-12 rounded-md mt-1"
                />

                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {item.length}/120
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        {/* Go Back */}
        <button
          className="px-6 py-2 border text-gray-600 rounded hover:bg-gray-100"
          onClick={() => goToTab("basic")}
        >
          Previous
        </button>

        {userRole === "instructor" ? (
          //  Instructor buttons
          <div className="flex gap-4">
            <button
              className="px-6 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              onClick={() => handleSubmit(false)}
            >
              Save
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => handleSubmit(true)}
            >
              Save & Next
            </button>
          </div>
        ) : (
          //  Admin buttons
          <div className="flex gap-4">
            <button
              className="px-6 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              onClick={() => setShowSuggestionModal(true)}
            >
              Add Suggestion
            </button>
            <button
              className="px-6 py-2 border text-gray-600 rounded-md hover:bg-gray-50"
              onClick={() => goToTab("curriculum")}
            >
              Next
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={async () => {
                try {
                  const response = await api.put(
                    `/api/admin/course-advanced-approval/${courseId}/`,
                    { is_advanced_approved: true, advanced_suggestions: "" }
                  );
                  if (response.status === 200) {
                    alert("Course approved ✅");
                    setApprovalStatus(true);
                    setSuggestion(null);
                    goToTab("curriculum");
                  }
                } catch (err) {
                  alert("Approval failed ");
                }
              }}
              disabled={approvalStatus}
            >
              {approvalStatus ? "Approved" : "Approve & Next"}
            </button>
          </div>
        )}
      </div>

      {showSuggestionModal && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Suggestion</h3>
            <textarea
              rows="4"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Enter suggestion..."
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 border rounded-md"
                onClick={() => setShowSuggestionModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleSuggestionSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvanceInformation;
