import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Table, Tag, Spin } from "antd";
import {
  FileTextOutlined,
  TeamOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { fetchJobs } from "../store/actions/jobActions";
import { fetchCategories } from "../store/actions/categoryActions";
import { fetchApplications } from "../store/actions/applicationActions";

const { Title, Text } = Typography;

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const { categories, loading: catsLoading } = useSelector(
    (state) => state.categories,
  );
  const { applications, loading: appsLoading } = useSelector(
    (state) => state.applications,
  );

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchCategories());
    dispatch(fetchApplications());
  }, [dispatch]);

  const isLoading = jobsLoading || catsLoading || appsLoading;

  const stats = [
    {
      title: "Total Jobs",
      count: jobs.length,
      icon: <FileTextOutlined className="text-3xl text-blue-500" />,
      color: "bg-blue-50 border-blue-200",
      link: "/jobs",
    },
    {
      title: "Applications",
      count: applications.length,
      icon: <TeamOutlined className="text-3xl text-green-500" />,
      color: "bg-green-50 border-green-200",
      link: "/applications",
    },
    {
      title: "Categories",
      count: categories.length,
      icon: <AppstoreOutlined className="text-3xl text-purple-500" />,
      color: "bg-purple-50 border-purple-200",
      link: "/categories",
    },
  ];

  const recentJobColumns = [
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
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const recentAppColumns = [
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
      render: (job) => job?.title || "—",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={4} className="!mb-6">
        Dashboard Overview
      </Title>

      <Row gutter={[16, 16]} className="mb-8">
        {stats.map((stat) => (
          <Col xs={24} sm={8} key={stat.title}>
            <Card
              hoverable
              className={`border ${stat.color} cursor-pointer`}
              onClick={() => navigate(stat.link)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary" className="text-sm">
                    {stat.title}
                  </Text>
                  <Title level={2} className="!mb-0 !mt-1">
                    {stat.count}
                  </Title>
                </div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-sm">
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Jobs" className="shadow-sm">
            <Table
              columns={recentJobColumns}
              dataSource={jobs.slice(0, 5)}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Applications" className="shadow-sm">
            <Table
              columns={recentAppColumns}
              dataSource={applications.slice(0, 5)}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
