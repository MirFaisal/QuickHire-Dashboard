import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Typography,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
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
  fetchCategories,
  createCategory,
  deleteCategory,
  restoreCategory,
} from "../store/actions/categoryActions";

const { Title } = Typography;

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [deletedLoading, setDeletedLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const fetchDeletedCategories = async () => {
    setDeletedLoading(true);
    try {
      const { default: api } = await import("../utils/api");
      const { data } = await api.get("/categories/deleted");
      setDeletedCategories(data.data);
    } catch {
      message.error("Failed to fetch deleted categories");
    } finally {
      setDeletedLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "deleted") {
      fetchDeletedCategories();
    }
  };

  const handleCreateCategory = async (values) => {
    setConfirmLoading(true);
    try {
      await dispatch(createCategory(values));
      message.success("Category created successfully");
      form.resetFields();
      setIsModalOpen(false);
    } catch {
      message.error("Failed to create category");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await dispatch(deleteCategory(id));
      message.success("Category deleted successfully");
      if (activeTab === "deleted") fetchDeletedCategories();
    } catch {
      message.error("Failed to delete category");
    }
  };

  const handleRestoreCategory = async (id) => {
    try {
      await dispatch(restoreCategory(id));
      setDeletedCategories((prev) => prev.filter((cat) => cat._id !== id));
      message.success("Category restored successfully");
    } catch {
      message.error("Failed to restore category");
    }
  };

  const activeColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created At",
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
          title="Delete this category?"
          description="It can be restored later from the Deleted tab."
          onConfirm={() => handleDeleteCategory(record._id)}
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
      title: "Name",
      dataIndex: "name",
      key: "name",
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
          title="Restore this category?"
          description="It will appear back in the active list."
          onConfirm={() => handleRestoreCategory(record._id)}
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
          Categories
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Category
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={[
          {
            key: "active",
            label: `Active (${categories.length})`,
            children: (
              <Table
                columns={activeColumns}
                dataSource={categories}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            ),
          },
          {
            key: "deleted",
            label: `Deleted (${deletedCategories.length})`,
            children: (
              <Table
                columns={deletedColumns}
                dataSource={deletedCategories}
                rowKey="_id"
                loading={deletedLoading}
                pagination={{ pageSize: 10 }}
              />
            ),
          },
        ]}
      />

      <Modal
        title="Add New Category"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreateCategory}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="e.g. Engineering" />
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

export default CategoryPage;
