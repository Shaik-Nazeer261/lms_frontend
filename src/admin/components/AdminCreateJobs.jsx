import  { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import api from "../../api.jsx";

const AdminCreateJobs = () => {
  const editor = useRef(null);

  const availableJobTypes = [
    { label: "Full Time", value: "Full Time" },
    { label: "Part Time", value: "Part Time" },
    { label: "Internship", value: "Internship" },
    { label: "Remote", value: "Remote" },
  ];

  const [form, setForm] = useState({
    job_title: "",
    ctc: "",
    years_of_experience: "",
    location: "",
    job_description: "",
    vacancies: 1,
    last_date_to_apply: "",
    address: "",
    phone: "",
    email: "",
    job_type: "", // initially empty for placeholder
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setForm({ ...form, job_description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.job_type) {
      alert("Please select a job type.");
      return;
    }
    try {
      const res = await api.post("/api/jobs/", form);
      console.log("Job created successfully", res.data);
      alert("Job posted successfully!");
      setForm({
        job_title: "",
        ctc: "",
        years_of_experience: "",
        location: "",
        job_description: "",
        vacancies: 1,
        last_date_to_apply: "",
        address: "",
        phone: "",
        email: "",
        job_type: "",
      });
    } catch (error) {
      console.error("Failed to create job", error);
      alert("Error posting job.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-semibold text-center mb-8">Post a New Job</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          name="job_title"
          placeholder="Job Title"
          value={form.job_title}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
        />

        <input
          name="ctc"
          placeholder="CTC"
          value={form.ctc}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
        />

        <input
          name="years_of_experience"
          placeholder="Years of Experience"
          value={form.years_of_experience}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
        />

        <select
          name="job_type"
          value={form.job_type}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
        >
          <option value="" disabled>
            Select Job Type
          </option>
          {availableJobTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="vacancies"
          placeholder="Number of Vacancies"
          value={form.vacancies}
          onChange={handleChange}
          min="1"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
        />

        <input
          type="date"
          name="last_date_to_apply"
          value={form.last_date_to_apply}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
        />

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Job Description
          </label>
          <JoditEditor
            ref={editor}
            value={form.job_description}
            tabIndex={1}
            onBlur={handleDescriptionChange}
            onChange={() => {}}
            className="bg-white rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default AdminCreateJobs;
