import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import api from '../../api';
import locicon from '../../common/images/locationicon.svg'
import jobtypeicon from '../../common/images/jobtypeicon.svg'
import vacancyicon from '../../common/images/vacancyicon.svg'
import DOMPurify from "dompurify";
import { useNavigate } from 'react-router-dom';


const AdminJobs = () => {
  console.log("admin job container is loaded");

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate=useNavigate()

  useEffect(() => {
    fetchData();
  }, []);


  // Fetch all jobs
  const fetchData = async () => {
    try {
      console.log("running fetch function");
      const res = await api.get("/api/jobs/");
      console.log("Fetched jobs:", res.data);
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };

  // Open modal on "View Job" button click
  const handleViewJob = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Show message on "All Applied Applications" button click
  const handleViewApplications = (job) => {
    // message.info(`Applied applications for "${job.job_title}" - page design coming soon.`);
    console.log("job.id",job.id)
    navigate(`${job.id}/applications`)
  };

  // Close the modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  // Table columns definition
  const columns = [
    {
      title: "Job ID",
      dataIndex: "id",
      key: "id",
      width: '15%',
    },
    {
      title: "Job Title",
      dataIndex: "job_title",
      key: "job_title",
      width: '45%',
    },
    {
      title: "Actions",
      key: "actions",
      width: '40%',
      render: (_, job) => (
        <>
          <Button
            type="primary"
            onClick={() => handleViewJob(job)}
            style={{ marginRight: 8 }}
          >
            View Job
          </Button>
          <Button onClick={() => handleViewApplications(job)}>All Applied Applications</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "100%", padding: 20 }}>
      <Table
        dataSource={jobs}
        columns={columns}
        rowKey="id"
        loading={jobs.length === 0} // show loading if jobs empty
      />
      <Modal
        title={selectedJob?.job_title}
        open={isModalOpen}
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>
        ]}
      >
         <div className="bg-[#F5F7FA] rounded-lg px-[106px] py-[30px] w-full mx-auto ">
        {/* Header with location indicators */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <img src={locicon} alt="" />
            <span className="text-gray-600">{selectedJob?.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={jobtypeicon} alt="" />
            <span className="text-gray-600">{selectedJob?.job_type}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* <div className="w-2 h-2 bg-orange-500 rounded-full"></div> */}
            <img src={vacancyicon} alt="" />
            <span className="text-gray-600">
              {selectedJob?.vacancies} vacancies
            </span>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Job title */}
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              {selectedJob?.job_title}
            </h2>

            {/* Address and Contact sections */}
            <div className="flex gap-12">
              {/* Address section */}
              <div className="gap-12">
                <h3 className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-wide">
                  ADDRESS
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedJob?.address}
                </p>
              </div>

              {/* Contact section */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-wide">
                  CONTACT
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">{selectedJob?.email}</p>
                  <p className="text-sm text-gray-700">{selectedJob?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Now button */}
          {/* <div className="ml-8">
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
          </div> */}
        </div>
      </div>
      <div
        className="job-description w-[80%] mx-auto mt-10 mb-10"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(selectedJob?.job_description),
        }}
      />
      </Modal>
    </div>
  );
};

export default AdminJobs;
