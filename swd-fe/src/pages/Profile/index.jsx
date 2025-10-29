/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  message, // Added message to show notifications
} from "antd";
import { EditOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getMyInfo, updateUser } from "../../services/authService";
import Avatar from "../../components/Avatar";
import Loading from "../../components/Loading";

const EditProfileModal = ({ visible, onCancel, initialValues, onSave }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedValues = {
          ...values,
          dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        };
        onSave(updatedValues);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
        message.error("Please check the invalid fields.");
      });
  };

  return (
    <Modal
      title="Edit Information"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Save"
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialValues,
          dob: initialValues.dob ? dayjs(initialValues.dob) : null,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please enter your first name!" },
              ]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: "Please enter your last name!" },
              ]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Invalid email address!" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter your phone number!" },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item name="dob" label="Date of Birth">
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            placeholder="Select date of birth"
          />
        </Form.Item>

        <Form.Item name="address" label="Address">
          <Input.TextArea rows={2} placeholder="Enter address" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function Profile() {
  const [user, setUser] = useState({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const res = await getMyInfo();
      if (res) {
        setUser(res.result);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Error fetching info";
      messageApi.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateInfomation = async (updatedValues) => {
    setLoading(true);
    try {
      const res = await updateUser(user.id, updatedValues);
      if (res) {
        messageApi.success("Profile updated successfully!");
        fetchUserInfo();
      }
    } catch (error) {
      const message = error.response?.data?.message || "Error updating info";
      messageApi.error(message);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSave = (updatedValues) => {
    updateInfomation(updatedValues);
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const getRoleTagColor = (roleName) => {
    switch (roleName) {
      case "ADMIN":
        return "gold";
      case "USER":
        return "blue";
      default:
        return "default";
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      {contextHolder}
      <Row justify="center" style={{ padding: "24px" }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card
            title="User Profile"
            extra={
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={showModal}
              >
                Edit
              </Button>
            }
            style={{ marginBottom: "24px" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                marginBottom: "32px",
              }}
            >
              <Avatar
                firstName={user.firstName || ""}
                lastName={user.lastName || ""}
              />

              <p style={{ margin: 0, fontSize: 16, color: "#999" }}>
                @{user.username || ""}
              </p>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
                {user.firstName || ""} {user.lastName || ""}
              </h2>
              <div style={{ marginTop: "8px" }}>
                {user.roles?.map((role, index) => (
                  <Tag color={getRoleTagColor(role.name)} key={index}>
                    {role.name}
                  </Tag>
                ))}
              </div>
            </div>
          </Card>

          <Card
            title={
              <>
                <ShoppingCartOutlined /> Your Cart
              </>
            }
            style={{ marginTop: "24px" }}
          >
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Button type="default" size="large">
                View Cart Details
              </Button>
            </div>
          </Card>
        </Col>

        <EditProfileModal
          visible={isModalVisible}
          onCancel={handleCancel}
          initialValues={user}
          onSave={handleSave}
        />
      </Row>
    </>
  );
}
