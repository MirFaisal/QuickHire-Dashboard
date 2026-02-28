import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Typography, Tag } from "antd";
import { fetchApplications } from "../store/actions/applicationActions";

const { Title } = Typography;

const ApplicationsPage = () => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const columns = [
    {
      title: "Applicant",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Job",
      dataIndex: "job_id",
      key: "job_id",
      render: (job) =>
        job ? (
          <Tag color="blue">{job.title}</Tag>
        ) : (
          <Tag color="default">—</Tag>
        ),
    },
    {
      title: "Resume",
      dataIndex: "resume_link",
      key: "resume_link",
      render: (link) => (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          View Resume
        </a>
      ),
    },
    {
      title: "Cover Note",
      dataIndex: "cover_note",
      key: "cover_note",
      ellipsis: true,
      render: (note) => note || "—",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="!mb-0">
          Applications
        </Title>
      </div>

      <Table
        columns={columns}
        dataSource={applications}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ApplicationsPage;
