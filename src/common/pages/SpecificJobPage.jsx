import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import DOMPurify from "dompurify";
import locicon from "../images/locationicon.svg";
import jobtypeicon from "../images/jobtypeicon.svg";
import vacancyicon from "../images/vacancyicon.svg";
import { Button, Form, message, Modal, Upload } from "antd";

const SpecificJobPage = () => {
  const { id } = useParams();
  const [SelectedJob, setSelectedJob] = useState(null);
  
  console.log("running this component ");

  const fetchJobById = async (id) => {
    try {
      console.log(`Running fetchJobById for id=${id}...`);

      const res = await api.get(`/api/jobs/?id=${id}`);

      console.log("Fetched job by ID:", res.data);
      setSelectedJob(res.data);
    } catch (error) {
      console.error(`Failed to fetch job with id=${id}`, error);
    }
  };
  
  useEffect(() => {
    fetchJobById(id);
  }, [id]);

  console.log("SelectedJob", SelectedJob);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const applyForm = () => {
    // message.success("code the pop up for the form to apply  ")
    console.log("apply broo");
    setIsModalVisible(true);
  };

  const [resumeFile, setResumeFile] = useState(null);
  const submitApplication = async (formData) => {
    // Print form data entries
    console.log("Form Data Submitted:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await api.post(
        `/api/apply/?job_id=${SelectedJob?.id}`,
        formData
      );

      if (response.status === 200) {
        message.success("Application submitted!");
        setIsModalVisible(false);
      } else {
        message.error("Failed to submit application.");
        console.error("Response error:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data?.message || error.message
      );
      message.error("Something went wrong.");
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  if (resumeFile) {
    console.log("Appending file", resumeFile);
    formData.append("resume", resumeFile);
  }

  formData.append("job", SelectedJob?.id);

  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  await submitApplication(formData);
};


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      console.log("UPLOAD FILE DEBUG", file);
      setResumeFile(file);
    } else {
      alert("Please select a PDF file.");
      e.target.value = null; // reset input
      setResumeFile(null);
    }
  };

  return (
    <>
      <div className="bg-[#F5F7FA] rounded-lg px-[106px] py-[30px] w-full mx-auto ">
        {/* Header with location indicators */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <img src={locicon} alt="" />
            <span className="text-gray-600">{SelectedJob?.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={jobtypeicon} alt="" />
            <span className="text-gray-600">{SelectedJob?.job_type}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* <div className="w-2 h-2 bg-orange-500 rounded-full"></div> */}
            <img src={vacancyicon} alt="" />
            <span className="text-gray-600">
              {SelectedJob?.vacancies} vacancies
            </span>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Job title */}
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              {SelectedJob?.job_title}
            </h2>

            {/* Address and Contact sections */}
            <div className="flex gap-12">
              {/* Address section */}
              <div className="gap-12">
                <h3 className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-wide">
                  ADDRESS
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {SelectedJob?.address}
                </p>
              </div>

              {/* Contact section */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-wide">
                  CONTACT
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">{SelectedJob?.email}</p>
                  <p className="text-sm text-gray-700">{SelectedJob?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Now button */}
          <div className="ml-8">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              onClick={() => applyForm()}
            >
              Apply Now
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        className="job-description w-[80%] mx-auto mt-10 mb-10"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(SelectedJob?.job_description),
        }}
      />

      <Modal
        title={
          <div className="text-base">
            <span className="text-gray-600 font-medium">Apply for: </span>
            <span className="text-xl font-semibold text-blue-600">
              {SelectedJob?.job_title}
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              required
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Education
            </label>
            <input
              name="education"
              type="text"
              required
              placeholder="e.g. B.Tech in Computer Science"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Experience
            </label>
            <input
              name="experience"
              type="text"
              required
              placeholder="e.g. 2 years as Frontend Developer"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="pdf-upload"
              className="w-full text-left bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-500 cursor-pointer inline-block px-4 py-2"
            >
              Click to Upload PDF
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {resumeFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {resumeFile.name}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Letter
            </label>
            <textarea
              name="message"
              rows="4"
              placeholder="Tell us why you are a good fit for this role..."
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsModalVisible(false)}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SpecificJobPage;
