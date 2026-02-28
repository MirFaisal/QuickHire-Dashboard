import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "../store/actions/authActions";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setError(null);
  }, []);

  const onValuesChange = () => {
    setError(null);
    form.setFields([
      { name: "email", errors: [] },
      { name: "password", errors: [] },
    ]);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setError(null);
      try {
        await dispatch(login(values));
        navigate("/", { replace: true });
      } catch (err) {
        const msg =
          err.response?.data?.message || "Invalid email or password. Please try again.";
        setError(msg);
        form.setFields([
          { name: "email", errors: [""] },
          { name: "password", errors: [""] },
        ]);
      }
    } catch {
      // Ant Design validation errors — already shown inline by the form
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          QuickHire Admin
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign in to manage your dashboard
        </p>

        {error && (
          <Alert
            message="Login Failed"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => {
              setError(null);
              form.setFields([
                { name: "email", errors: [] },
                { name: "password", errors: [] },
              ]);
            }}
            className="mb-4"
          />
        )}

        <Form
          form={form}
          name="login"
          onValuesChange={onValuesChange}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="admin@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="button"
              onClick={handleSubmit}
              loading={loading}
              block
              size="large"
              className="mt-2"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-gray-400 text-sm mt-2">
          Need credentials?{" "}
          <a
            href="https://github.com/MirFaisal/QuickHire-Dashboard/blob/master/README.md#default-admin-credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View documentation
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


