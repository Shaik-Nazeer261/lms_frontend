import React, { useEffect, useState } from "react";
import api from "../../api";
import { useLocation } from "react-router-dom";

const BasicInformation = ({ goToTab, courseId, setCourseId }) => {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    category: "",
    subcategory: "",
    topic: "",
    language: "",
    subtitleLang: "",
    level: "",
    duration: "",
    durationType: "Day",
    cost: "",
    discount: "",
    coupon: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role; // "instructor" or "admin"
  const [suggestion, setSuggestion] = useState(null); // ✅ new
  const [approvalStatus, setApprovalStatus] = useState(null); // ✅ new
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");

  useEffect(() => {
    api
      .get("/api/category-subcategory/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // When a category is selected, filter its subcategories
  useEffect(() => {
    const selected = categories.find(
      (cat) => cat.id.toString() === form.category
    );
    setSubcategories(selected ? selected.subcategories : []);
  }, [form.category, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (name === "category") {
        updatedForm.subcategory = ""; // Reset only when user changes category
      }
      return updatedForm;
    });
  };

  useEffect(() => {
    if (!courseId) return;

    const fetchDraftCourse = async () => {
      try {
        const res = await api.get(`/api/instructor/create-course/${courseId}/`);
        const course = res.data;
        setForm({
          title: course.title || "",
          subtitle: course.subtitle || "",
          topic: course.topic || "",
          category: course.category_id?.toString() || "",
          subcategory: course.subcategory_id?.toString() || "",
          language: course.language || "",
          subtitleLang: course.subtitle_language || "",
          level: course.course_level || "",
          duration: course.time_duration?.split(" ")[0] || "",
          durationType: course.time_duration?.split(" ")[1] || "Day",
          cost: course.price || "",
          discount: course.discount || "",
          coupon: course.coupon_code || "",
          
        });
        setApprovalStatus(course.is_basic_approved);
        setSuggestion(course.basic_suggestions);

      } catch (err) {
        console.error("Failed to load course:", err);
      }
    };

    fetchDraftCourse(); // ✅ Always called inside useEffect
  }, [courseId]); // ✅ Dependency set

  const handleSubmit = async (moveNext = false) => {
    if (!form.title) {
      alert("Please fill out all required fields before proceeding.");
      return;
    }

    if (!form.category || !form.subcategory) {
      alert("Please select both Category and Sub-category before proceeding.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subtitle", form.subtitle);
    formData.append("topic", form.topic);
    formData.append("category_id", form.category);
    formData.append("subcategory_id", form.subcategory);
    formData.append("language", form.language);
    formData.append("subtitle_language", form.subtitleLang);
    formData.append("course_level", form.level);
    formData.append("time_duration", `${form.duration} ${form.durationType}`);

    if (form.cost) formData.append("price", form.cost);
    if (form.discount) formData.append("discount", form.discount);
    formData.append("coupon_code", form.coupon);

    try {
      let response;
      if (courseId) {
        // 🔁 Update existing course
        response = await api.put(
          `/api/instructor/create-course/${courseId}/`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // 🆕 Create new course
        response = await api.post("/api/instructor/create-course/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        if (data?.course_id) {
          setCourseId(data.course_id);
        }

        alert("Course saved successfully ✅");

        //  Move to next tab only if triggered from "Save & Next"
        if (moveNext) {
          goToTab("advance");
        }
      } else {
        alert("Unexpected response status: " + response.status);
      }
    } catch (err) {
      console.error("Error saving course:", err);
      if (err.response) {
        alert(err.response.data?.error || "Server responded with error");
      } else if (err.request) {
        alert("No response from server.");
      } else {
        alert("Request failed before reaching the server.");
      }
    }
  };

  const handleSuggestionSubmit = async () => {
    try {
      const response = await api.put(
        `/api/admin/course-basic-approval/${courseId}/`,
        {
          is_basic_approved: false,
          basic_suggestions: suggestionText,
        }
      );

      if (response.status === 200) {
        alert("Suggestion saved ✅");
        setSuggestion(response.data.basic_suggestions);
        setApprovalStatus(response.data.is_basic_approved);
        setShowSuggestionModal(false);
        setSuggestionText("");
      }
    } catch (err) {
      console.error("Error saving suggestion:", err);
      alert("Failed to save suggestion");
    }
  };


  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#00113D]">Basic Information</h2>

     {suggestion && (
  <div className="mb-6">
    <h3 className="text-base font-semibold text-[#00113D] mb-2">Suggestion</h3>
    <div>
      <p className="text-sm font-medium text-gray-700 mb-1">Message</p>
      <div className="bg-gray-100 border border-gray-300 rounded-md p-4 text-gray-800 text-sm">
        {suggestion}
      </div>
    </div>
  </div>
)}



      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          name="title"
          type="text"
          maxLength={80}
          placeholder="Your course title"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        <div className="text-right text-xs text-gray-500">
          {form.title.length}/80
        </div>
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subtitle
        </label>
        <input
          name="subtitle"
          type="text"
          maxLength={120}
          placeholder="Your course subtitle"
          value={form.subtitle}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        <div className="text-right text-xs text-gray-500">
          {form.subtitle.length}/120
        </div>
      </div>

      {/* Category + Sub-category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          >
            <option value="">Select...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Sub-category
          </label>
          <select
            name="subcategory"
            value={form.subcategory}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
            disabled={!form.category}
          >
            <option value="">Select...</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Topic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course Topic
        </label>
        <input
          name="topic"
          type="text"
          placeholder="What is primarily taught in your course?"
          value={form.topic}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
      </div>

      {/* Language, Subtitle Lang, Level, Duration */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Language
          </label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          >
            <option value="">Select...</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle Language (Optional)
          </label>
          <select
            name="subtitleLang"
            value={form.subtitleLang}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          >
            <option value="">Select...</option>
            <option value="english">English</option>
            <option value="telugu">Telugu</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Level
          </label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          >
            <option value="">Select...</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durations
          </label>
          <div className="flex">
            <input
              name="duration"
              type="text"
              placeholder="Course durations"
              value={form.duration}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-l-md"
            />
            <select
              name="durationType"
              value={form.durationType}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-r-md bg-white"
            >
              <option>Day</option>
              <option>Week</option>
              <option>Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Cost, Discount, Coupon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Cost
          </label>
          <input
            name="cost"
            type="number"
            placeholder="Enter cost"
            value={form.cost}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount
          </label>
          <input
            name="discount"
            type="text"
            placeholder="e.g. 20%"
            value={form.discount}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coupon code
          </label>
          <input
            name="coupon"
            type="text"
            placeholder="e.g. Coupon20"
            value={form.coupon}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button className="px-6 py-2 border text-gray-600 rounded-md hover:bg-gray-50">
          Cancel
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
            <button className="px-6 py-2 border text-gray-600 rounded-md hover:bg-gray-50"
            onClick={() => goToTab("advance")}
            >
              Next
            </button>
            <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={async () => {
              try {
                const res = await api.put(
                  `/api/admin/course-basic-approval/${courseId}/`,
                  {
                    is_basic_approved:true,
                    basic_suggestions:"",
                  }
                );
                alert("Course approved ");
                setApprovalStatus(res.data.is_basic_approved);
                setSuggestion(null);
                goToTab("advance");
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
        {/*  Suggestion Modal */}
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

export default BasicInformation;
