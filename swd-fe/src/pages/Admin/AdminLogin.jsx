import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Logo from "../../components/Logo";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const { Title, Text } = Typography;

const brandRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const leftPanelStyle = {
  backgroundColor: "#f3f4f6",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 40,
  borderBottom: "1px solid #e5e7eb", // Đường viền ngăn cách cho bố cục column
};

const rightPanelStyle = {
  padding: 40,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const loginCardStyle = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  borderRadius: 12,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  maxWidth: 420,
  width: "100%",
  margin: 16,
};

const loginPageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9fafb",
  padding: 16,
};

const loginButtonCustomStyle = {
  height: 56,
  width: "100%",
  borderRadius: 9999,
  border: "none",
  backgroundColor: "#8B0000",
  fontSize: 16,
  fontWeight: 600,
  boxShadow: "0 4px 6px -1px rgba(139, 0, 0, 0.4)",
};

const CompanyBrand = () => (
  <div
    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
  >
    <div style={brandRowStyle}>
      <Logo />
      <Title level={3} style={{ margin: 0, color: "#333333" }}>
        GiaHoaPhat
      </Title>
    </div>
    <Text type="secondary" style={{ marginTop: 16, textAlign: "center" }}>
      Internal management system
    </Text>
  </div>
);

export default function AdminLogin() {
  const [errorMessage, setErrorMessage] = useState(null);
  const { adminLogin } = useAuth();
  const onFinish = async (values) => {
    setErrorMessage(null);
    const { username, password } = values;
    try {
      await adminLogin(username, password);
    } catch (error) {
      let message = "Login failed! Please try again.";

      if (error.response) {
        if (
          error.response.status === 401 ||
          error.response.status === 403 ||
          error.response.status === 404
        ) {
          message = "Invalid username or password.";
        } else {
          message =
            error.response.data?.message || "An unknown server error occurred.";
        }
      } else if (error.request) {
        message =
          "Cannot connect to the server. Please check your network or API status.";
      } else {
        message = error.message;
      }

      setErrorMessage(message);
    }
  };

  return (
    <div style={loginPageStyle}>
      <div style={loginCardStyle}>
        <div style={leftPanelStyle}>
          <CompanyBrand />
        </div>

        <div style={rightPanelStyle}>
          <Title
            level={1}
            style={{
              textAlign: "center",
              fontSize: 32,
              marginBottom: 4,
              color: "#1f2937",
            }}
          >
            Admin Login
          </Title>
          <Text
            style={{ textAlign: "center", marginBottom: 32, color: "#4b5563" }}
          >
            Welcome back admin!
          </Text>
          {errorMessage && (
            <Text
              type="danger"
              style={{
                marginBottom: 16,
                display: "block",
                textAlign: "center",
              }}
            >
              {errorMessage}
            </Text>
          )}

          <Form
            name="admin_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            {/* Username Field */}
            <Form.Item
              label={<Text strong>Username</Text>}
              name="username"
              rules={[{ required: true, message: "Please enter username!" }]}
              style={{ marginBottom: 24 }}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Enter username"
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              label={<Text strong>Password</Text>}
              name="password"
              rules={[{ required: true, message: "Please enter password!" }]}
              style={{ marginBottom: 24 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Enter password"
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            {/* Login Button */}
            <Form.Item style={{ marginTop: 40, marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={loginButtonCustomStyle}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          <Link
            to={"/login"}
            style={{
              textDecoration: "underline",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Login as user
          </Link>
        </div>
      </div>
    </div>
  );
}
