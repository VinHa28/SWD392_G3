// ./pages/Admin/UserManagement.jsx

import React, { useState } from "react";
import { Table, Button, Space, Modal, Form, Input, Select, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

// Dữ liệu mẫu (sẽ được thay thế bằng API call sau)
const initialUsers = [
  {
    id: 1,
    key: "1",
    username: "admin_user",
    email: "admin@example.com",
    role: "ADMIN",
    status: "Active",
  },
  {
    id: 2,
    key: "2",
    username: "jane_doe",
    email: "jane@example.com",
    role: "USER",
    status: "Active",
  },
  {
    id: 3,
    key: "3",
    username: "johnny_banned",
    email: "john@example.com",
    role: "USER",
    status: "Banned",
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null: thêm mới, object: chỉnh sửa
  const [form] = Form.useForm();

  const showModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    // ⚠️ Logic Call API:
    // Nếu editingUser có id -> PUT/PATCH (Cập nhật)
    // Nếu editingUser là null -> POST (Thêm mới)

    if (editingUser) {
      // Cập nhật UI (Tạm thời)
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...values } : user
        )
      );
    } else {
      // Thêm mới UI (Tạm thời)
      const newUser = {
        ...values,
        id: Date.now(),
        key: Date.now().toString(),
        status: "Active", // Mặc định là Active
      };
      setUsers([...users, newUser]);
    }

    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    // ⚠️ Logic Call API: DELETE
    Modal.confirm({
      title: "Xác nhận Xóa",
      content: `Bạn có chắc muốn xóa người dùng có ID: ${id}?`,
      onOk() {
        // Xóa khỏi UI (Tạm thời)
        setUsers(users.filter((user) => user.id !== id));
        // console.log(`API Xóa user ID: ${id}`);
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "ADMIN" ? "volcano" : "green"}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "blue" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            type="primary"
            ghost
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            type="primary"
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Quản lý Người dùng 🧑‍💻</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal(null)}
        style={{ marginBottom: 16 }}
      >
        Thêm Người dùng mới
      </Button>
      <Table columns={columns} dataSource={users} rowKey="id" />

      <Modal
        title={editingUser ? "Chỉnh sửa Người dùng" : "Thêm Người dùng mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Tắt footer mặc định để dùng nút trong Form
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ role: "USER" }}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập Email!" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select>
              <Option value="ADMIN">ADMIN</Option>
              <Option value="USER">USER</Option>
            </Select>
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingUser ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}