import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Typography } from "antd";
import { fetchJobs } from "../store/actions/jobActions";

const { Title } = Typography;

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const columns = [
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
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Title level={4} className="!mb-0">
          Job Listings
        </Title>
      </div>

      <Table
        columns={columns}
        dataSource={jobs}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default DashboardPage;
