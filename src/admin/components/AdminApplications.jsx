import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { Table, Typography, Modal, Button } from "antd"; // Add Modal and Button

const { Link } = Typography;

const AdminApplications = () => {
  const { id } = useParams();

  const [applications, setApplications] = useState([]);
  const [selectedJob, SetSelectedJob] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLetter, setCurrentLetter] = useState("");

  const showLetterModal = (letter) => {
    setCurrentLetter(letter);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentLetter("");
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get(`/api/apply/?job_id=${id}`);
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchJobById = async (id) => {
    try {
      const res = await api.get(`/api/jobs/?id=${id}`);
      SetSelectedJob(res.data);
    } catch (error) {
      console.error(`Failed to fetch job with id=${id}`, error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchApplications();
      fetchJobById(id);
    }
  }, [id]);

  const columns = [
    {
      title: "Application ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Education",
      dataIndex: "education",
      key: "education",
    },
    {
      title: "Experience (yrs)",
      dataIndex: "experience",
      key: "experience",
    },
    {
      title: "Job ID",
      dataIndex: "job",
      key: "job",
    },
    {
      title: "Submitted At",
      dataIndex: "submitted_at",
      key: "submitted_at",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Resume",
      dataIndex: "resume",
      key: "resume",
      render: (text) => (
        <Link
          href={`${import.meta.env.VITE_BACKEND_URL}${text}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </Link>
      ),
    },
    {
      title: "Cover Letter",
      dataIndex: "cover_letter",
      key: "cover_letter",
      render: (text) => (
        <Button type="link" onClick={() => showLetterModal(text)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: "24px" }}>
        Applications for Job:{" "}
        <span style={{ fontWeight: 600, color: "#1890ff" }}>
          {selectedJob?.job_title}
        </span>
      </h2>

      <Table columns={columns} dataSource={applications} rowKey="id" />

      {/* Modal for Cover Letter */}
      <Modal
        title="Cover Letter"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        <p>{currentLetter}</p>
      </Modal>
    </div>
  );
};

export default AdminApplications;
