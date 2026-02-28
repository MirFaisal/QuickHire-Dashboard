import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Tag,
  Typography,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  fetchJobs,
  createJob,
  deleteJob,
  restoreJob,
} from "../store/actions/jobActions";
import { fetchCategories } from "../store/actions/categoryActions";

const { Title } = Typography;
const { TextArea } = Input;

const JobsPage = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);
  const { categories } = useSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deletedJobs, setDeletedJobs] = useState([]);
  const [deletedLoading, setDeletedLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchCategories());
  }, [dispatch]);

  const fetchDeletedJobs = async () => {
    setDeletedLoading(true);
    try {
      const { default: api } = await import("../utils/api");
      const { data } = await api.get("/jobs/deleted");
      setDeletedJobs(data.data);
    } catch {
      message.error("Failed to fetch deleted jobs");
    } finally {
      setDeletedLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "deleted") {
      fetchDeletedJobs();
    }
  };

  const handleCreateJob = async (values) => {
    setConfirmLoading(true);
    try {
      await dispatch(createJob(values));
      message.success("Job created successfully");
      form.resetFields();
      setIsModalOpen(false);
    } catch {
      message.error("Failed to create job");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await dispatch(deleteJob(id));
      message.success("Job deleted successfully");
      if (activeTab === "deleted") fetchDeletedJobs();
    } catch {
      message.error("Failed to delete job");
    }
  };

  const handleRestoreJob = async (id) => {
    try {
      await dispatch(restoreJob(id));
      setDeletedJobs((prev) => prev.filter((job) => job._id !== id));
      message.success("Job restored successfully");
    } catch {
      message.error("Failed to restore job");
    }
  };

  const activeColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag color="blue">{category?.name || "Uncategorized"}</Tag>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="Delete this job?"
          description="It can be restored later from the Deleted tab."
          onConfirm={() => handleDeleteJob(record._id)}
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
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
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
          title="Restore this job?"
          description="It will appear back in the active list."
          onConfirm={() => handleRestoreJob(record._id)}
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
          Job Listings
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Create Job
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={[
          {
            key: "active",
            label: `Active (${jobs.length})`,
            children: (
              <Table
                columns={activeColumns}
                dataSource={jobs}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            ),
          },
          {
            key: "deleted",
            label: `Deleted (${deletedJobs.length})`,
            children: (
              <Table
                columns={deletedColumns}
                dataSource={deletedJobs}
                rowKey="_id"
                loading={deletedLoading}
                pagination={{ pageSize: 10 }}
              />
            ),
          },
        ]}
      />

      <Modal
        title="Create New Job"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreateJob}>
          <Form.Item
            name="title"
            label="Job Title"
            rules={[{ required: true, message: "Please enter job title" }]}
          >
            <Input placeholder="e.g. Backend Developer" />
          </Form.Item>

          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: "Please enter company name" }]}
          >
            <Input placeholder="e.g. QuickHire Inc." />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="e.g. Remote" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select a category">
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Job description..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={confirmLoading}
              >
                Create
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobsPage;
