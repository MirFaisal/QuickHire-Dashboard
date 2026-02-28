import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Typography,
  Tag,
  Button,
  Popconfirm,
  Tabs,
  Modal,
  Descriptions,
  message,
} from "antd";
import { DeleteOutlined, UndoOutlined, EyeOutlined } from "@ant-design/icons";
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
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const showDetail = (record) => {
    setSelectedApp(record);
    setModalOpen(true);
  };

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
    {
      title: "View",
      key: "view",
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => showDetail(record)}
        />
      ),
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

      <Modal
        title="Application Details"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedApp && (
          <Descriptions column={1} bordered size="small" className="mt-4">
            <Descriptions.Item label="Applicant">
              {selectedApp.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <a href={`mailto:${selectedApp.email}`}>{selectedApp.email}</a>
            </Descriptions.Item>
            <Descriptions.Item label="Job">
              {selectedApp.job_id?.title ? (
                <Tag color="blue">{selectedApp.job_id.title}</Tag>
              ) : (
                "—"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Resume">
              <a
                href={selectedApp.resume_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {selectedApp.resume_link}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Cover Note">
              <div className="whitespace-pre-wrap">
                {selectedApp.cover_note || "—"}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Applied On">
              {new Date(selectedApp.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

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
