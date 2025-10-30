/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row, Button, Input, Form, Typography } from "antd";
import styles from "./Login.module.css";
import Logo from "../../components/Logo";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";

const { Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, logout } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);

  const navigateTopSignUp = () => {
    navigate("/signup");
  };

  const onFinish = async (values) => {
    setErrorMessage(null);
    const { username, password } = values;
    try {
      await login(username, password);
    } catch (error) {
      let message = "Login failed! Please try again.";

      if (error.response) {
        message =
          error.response.data?.message || "An unknown server error occurred.";
      } else if (error.request) {
        message =
          "Cannot connect to the server. Please check your network or API status.";
      } else {
        message = error.message;
      }

      setErrorMessage(message);
    }
  };
  useEffect(() => {
    logout();
  }, []);

  return (
    <div className={styles.layoutContainer}>
      <Row style={{ width: "100%" }}>
        <Col span={18} push={6} className={styles.contentColumn}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Login</h2>
            <div className={styles.headerRight}>
              <p className={styles.headerText}>You do not have an account? </p>
              <Button
                className={styles.headerButton}
                type="default"
                shape="round"
                size="large"
                onClick={navigateTopSignUp}
                disabled={loading}
              >
                Sign up
              </Button>
            </div>
          </div>

          <div className={styles.loginContainer}>
            <Logo />
            <h1 className={styles.loginTitle}>Login</h1>
            <p className={styles.loginDesc}>
              Make sure that you already have an account.
            </p>

            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              className={styles.loginForm}
              layout="vertical"
            >
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
              <Form.Item
                label={<span className={styles.inputLabel}>Username</span>}
                name="username"
                rules={[
                  { required: true, message: "Please input your Username!" },
                ]}
                className={styles.formItem}
              >
                <Input
                  className={styles.textInput}
                  placeholder="Your username"
                  size="large"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label={<span className={styles.inputLabel}>Password</span>}
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
                className={styles.formItem}
              >
                <Input.Password
                  className={styles.textInput}
                  placeholder="Your password"
                  size="large"
                  disabled={loading}
                  iconRender={(visible) =>
                    visible ? (
                      <EyeOutlined
                        style={{ color: "rgba(102, 102, 102, 0.8)" }}
                      />
                    ) : (
                      <EyeInvisibleOutlined
                        style={{ color: "rgba(102, 102, 102, 0.8)" }}
                      />
                    )
                  }
                />
              </Form.Item>
              <Form.Item className={styles.loginButtonContainer}>
                <Button
                  className={styles.formButton}
                  type="primary"
                  htmlType="submit"
                  size="large"
                  shape="round"
                  loading={loading}
                  disabled={loading}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
            <Link to={"/login-admin"} style={{ textDecoration: "underline" }}>
              Are you admin?
            </Link>
          </div>
        </Col>

        <Col span={6} pull={18} className={styles.backgroundLeft}></Col>
      </Row>
    </div>
  );
}
