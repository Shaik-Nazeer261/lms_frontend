import React, { useEffect, useState, useRef } from "react";
import { FiX } from "react-icons/fi";
import JoditEditor from "jodit-react";
import html2canvas from "html2canvas";
import api from "../../api";
import { v4 as uuidv4 } from "uuid"; // Add this if not imported

const placeholders = [
  { label: "Student Name", tag: "{student_name}" },
  { label: "Course Title", tag: "{course_title}" },
  { label: "Instructor Name", tag: "{instructor_name}" },
  { label: "Date", tag: "{date}" },
];

const predefinedTemplates = [
  {
    id: uuidv4(),
    name: "Elegant Gold",
    html_template: `<html><body style="text-align:center; font-family:Georgia; background-color:#fff8dc; padding:50px">
        <h1 style="color:#d4af37; font-size:40px;">Certificate</h1>
        <p>This certifies <strong>{student_name}</strong></p>
        <p>has completed <strong>{course_title}</strong></p>
        <p><em>Instructor:</em> {instructor_name}</p>
        <p><em>Date:</em> {date}</p></body></html>`,
    file_type: "html",
    is_predefined: true
  },
  {
    id: uuidv4(),
    name: "Blue Classic",
    html_template: `<html><body style="text-align:center; font-family:Arial; background-color:#eef6fb; padding:50px">
        <h1 style="color:#003366; font-size:36px;">Certificate of Completion</h1>
        <p>This is to certify that <strong>{student_name}</strong></p>
        <p>has completed the course <strong>{course_title}</strong></p>
        <p>Instructor: <strong>{instructor_name}</strong></p>
        <p>Date: {date}</p></body></html>`,
    file_type: "html",
    is_predefined: true
  }
];


const CertificateSelectionModal = ({ isOpen, onClose, courseId, onAssign }) => {
  const [templates, setTemplates] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newHtml, setNewHtml] = useState("<html><body>\n\n</body></html>");
  const previewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  

  useEffect(() => {
    if (isOpen) fetchTemplates();
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      const res = await api.get("/api/certificate-templates/");
      setTemplates(res.data);
      setTemplates([...predefinedTemplates, ...res.data]);

    } catch (err) {
      console.error("Failed to load templates", err);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newHtml.trim()) {
      setMessage("Template name and content are required.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("file_type", "html");

    // Capture preview image from editor
    const previewEl = previewRef.current;
    await new Promise((resolve) => setTimeout(resolve, 100));
    const canvas = await html2canvas(previewEl, { scale: 2, useCORS: true });
    const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
    const previewImageFile = new File([blob], "preview.png", { type: "image/png" });

    formData.append("preview_image", previewImageFile);
    formData.append("html_template", newHtml);
    formData.append("type", "default");

    try {
      await api.post("/api/certificate-templates/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewHtml("<html><body>\n\n</body></html>");
      setNewName("");
      setIsCreating(false);
      setMessage("✅ Template created!");
      fetchTemplates(); // Refresh list
    } catch (err) {
      console.error("Failed to create template", err);
      setMessage("❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };


  const handleAssign = async (tpl) => {
  if (!courseId) return alert("Course ID missing");

  if (tpl.is_predefined) {
    const formData = new FormData();
    formData.append("name", tpl.name);
    formData.append("file_type", "html");
    formData.append("html_template", tpl.html_template);
    formData.append("type", "default");

    try {
      const res = await api.post("/api/certificate-templates/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await api.post(`/api/courses/${courseId}/set-certificate/`, {
        template_id: res.data.id,
      });

      alert("✅ Predefined template assigned!");
      onClose();
    } catch (err) {
      console.error("Failed to assign predefined", err);
      alert("❌ Assignment failed");
    }
  } else {
    try {
      await api.post(`/api/courses/${courseId}/set-certificate/`, {
        template_id: tpl.id,
      });
      alert("✅ Template assigned!");
      onClose();
    } catch (err) {
      console.error("Assignment error:", err);
      alert("❌ Failed to assign template");
    }
  }
};

const getPreviewImageUrl = (url) => {
  if (url?.includes("/media/")) {
    return url.replace("/media/", "/api/media/");
  }
  return url;
};



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {isCreating ? "Create New Certificate Template" : "Select Certificate Template"}
        </h2>

        {message && <p className="text-blue-600 mb-4">{message}</p>}

        {!isCreating && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="border rounded p-4 bg-white shadow-sm flex flex-col items-center"
                >
                  <p className="font-medium">{tpl.name}</p>
                 {tpl.file_type === "html" ? (
  tpl.preview_image ? (
    <img
  src={getPreviewImageUrl(tpl.preview_image)}
  alt={tpl.name}
  className="w-full h-40 object-contain mt-2 mb-3 border"
/>

  ) : (
    <div
      className="w-full h-40 overflow-auto text-sm border bg-white p-2 mb-3"
      dangerouslySetInnerHTML={{
        __html: tpl.html_template
          .replace(/{student_name}/g, "John Doe")
          .replace(/{course_title}/g, "React Basics")
          .replace(/{instructor_name}/g, "Dr. Smith")
          .replace(/{date}/g, new Date().toLocaleDateString()),
      }}
    />
  )
) : (
  <div className="h-40 flex items-center justify-center text-gray-400 border mb-3 w-full">
    📄 {tpl.file_type.toUpperCase()} File
  </div>
)}

                  <button
  onClick={() => handleAssign(tpl)}
  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  Assign to Course
</button>

                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsCreating(true)}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                + Create New Template
              </button>
            </div>
          </>
        )}

        {isCreating && (
          <div className="space-y-4">
            <div>
              <label className="font-semibold block mb-1">Template Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

<div className="mb-3">
  <label className="block font-semibold mb-1">Insert Placeholders</label>
  <div className="flex flex-wrap gap-2">
    {[
      { label: "Student Name", tag: "{student_name}" },
      { label: "Course Title", tag: "{course_title}" },
      { label: "Instructor Name", tag: "{instructor_name}" },
      { label: "Date", tag: "{date}" }
    ].map(ph => (
      <button
        key={ph.tag}
        type="button"
        onClick={() => setNewHtml(prev => prev + ph.tag)}
        className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
      >
        {ph.label}
      </button>
    ))}
  </div>
</div>


            <div>
              <label className="font-semibold block mb-1">Editor (HTML/WYSIWYG)</label>
              <JoditEditor value={newHtml} onChange={(content) => setNewHtml(content)} />
            </div>

            <div className="border p-3 mt-4 bg-gray-50 rounded">
              <h3 className="text-sm font-semibold mb-2">Live Preview</h3>
              <div
                ref={previewRef}
                className="border p-3 bg-white"
                dangerouslySetInnerHTML={{
                  __html: newHtml
                    .replace(/{student_name}/g, "John Doe")
                    .replace(/{course_title}/g, "React Basics")
                    .replace(/{instructor_name}/g, "Dr. Smith")
                    .replace(/{date}/g, new Date().toLocaleDateString()),
                }}
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleCreate}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Template"}
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateSelectionModal;
