import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Typography,
  Tag,
  Button,
  Popconfirm,
  Tabs,
  message,
} from "antd";
import { DeleteOutlined, UndoOutlined } from "@ant-design/icons";
import {
  fetchApplications,
  deleteApplication,
  restoreApplication,
} from "../store/actions/applicationActions";

const { Title } = Typography;

const ApplicationsPage = () => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.applications);
  const [deletedApps, setDeletedApps] = useState([]);
  const [deletedLoading, setDeletedLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const fetchDeletedApps = async () => {
    setDeletedLoading(true);
    try {
      const { default: api } = await import("../utils/api");
      const { data } = await api.get("/applications/deleted");
      setDeletedApps(data.data);
    } catch {
      message.error("Failed to fetch deleted applications");
    } finally {
      setDeletedLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "deleted") {
      fetchDeletedApps();
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await dispatch(deleteApplication(id));
      message.success("Application deleted successfully");
      if (activeTab === "deleted") fetchDeletedApps();
    } catch {
      message.error("Failed to delete application");
    }
  };

  const handleRestoreApplication = async (id) => {
    try {
      await dispatch(restoreApplication(id));
      setDeletedApps((prev) => prev.filter((app) => app._id !== id));
      message.success("Application restored successfully");
    } catch {
      message.error("Failed to restore application");
    }
  };

  const baseColumns = [
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
  ];

  const activeColumns = [
    ...baseColumns,
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="Delete this application?"
          description="It can be restored later from the Deleted tab."
          onConfirm={() => handleDeleteApplication(record._id)}
          okText="Delete"
          okType="danger"
          cancelText="Cancel"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const deletedColumns = [
    ...baseColumns,
    {
      title: "Deleted At",
      dataIndex: "deletedAt",
      key: "deletedAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="Restore this application?"
          description="It will appear back in the active list."
          onConfirm={() => handleRestoreApplication(record._id)}
          okText="Restore"
          cancelText="Cancel"
        >
          <Button type="text" icon={<UndoOutlined />} className="!text-green-600">
            Restore
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="!mb-0">
          Applications
        </Title>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={[
          {
            key: "active",
            label: `Active (${applications.length})`,
            children: (
              <Table
                columns={activeColumns}
                dataSource={applications}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            ),
          },
          {
            key: "deleted",
            label: `Deleted (${deletedApps.length})`,
            children: (
              <Table
                columns={deletedColumns}
                dataSource={deletedApps}
                rowKey="_id"
                loading={deletedLoading}
                pagination={{ pageSize: 10 }}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default ApplicationsPage;
