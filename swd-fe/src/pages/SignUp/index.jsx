import { Col, Row, Button, Input, Form } from "antd";
import styles from "./SignUp.module.css";
import Logo from "../../components/Logo";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"; // Import Ant Design icons for the password toggle
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/login");
  };
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div className={styles.layoutContainer}>
      <Row style={{ width: "100%" }}>
        <Col span={18} push={6} className={styles.contentColumn}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Sign Up</h2>
            <div className={styles.headerRight}>
              <p className={styles.headerText}>Already have an account? </p>
              <Button
                className={styles.headerButton}
                type="default"
                shape="round"
                size="large"
                onClick={navigateToLogin}
              >
                Login
              </Button>
            </div>
          </div>

          <div className={styles.signUpContainer}>
            <Logo />
            <h1 className={styles.signUpTitle}>Sign Up</h1>
            <p className={styles.signUpDesc}>
              Please fill in the form to create your account.
            </p>

            <Form
              name="signup"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              className={styles.signUpForm}
              layout="vertical"
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className={styles.inputLabel}>First Name</span>
                    }
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your First Name!",
                      },
                    ]}
                    className={styles.formItem}
                  >
                    <Input
                      className={styles.textInput}
                      placeholder="Your first name"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span className={styles.inputLabel}>Last Name</span>}
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Last Name!",
                      },
                    ]}
                    className={styles.formItem}
                  >
                    <Input
                      className={styles.textInput}
                      placeholder="Your last name"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={<span className={styles.inputLabel}>Phone Number</span>}
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your Phone Number!",
                  },
                ]}
                className={styles.formItem}
              >
                <Input
                  className={styles.textInput}
                  placeholder="Your phone number"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label={<span className={styles.inputLabel}>Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Please input your Email!" },
                  { type: "email", message: "The input is not valid E-mail!" },
                ]}
                className={styles.formItem}
              >
                <Input
                  className={styles.textInput}
                  placeholder="Your email address"
                  size="large"
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
                  placeholder="Create a password"
                  size="large"
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

              <Form.Item className={styles.signUpButtonContainer}>
                <Button
                  className={styles.formButton}
                  type="primary"
                  htmlType="submit"
                  size="large"
                  shape="round"
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        {/* Left Background Column */}
        <Col span={6} pull={18} className={styles.backgroundLeft}></Col>
      </Row>
    </div>
  );
}
