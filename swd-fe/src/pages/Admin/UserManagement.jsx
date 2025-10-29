/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Loading from "../../components/Loading";
import {
  getAllUsers,
  registerUser,
  updateUser,
} from "../../services/authService";

const { Option } = Select;

const transformUserRoles = (user) => {
  if (
    user.roles &&
    user.roles.length > 0 &&
    typeof user.roles[0] === "object"
  ) {
    return {
      ...user,
      roles: user.roles.map((role) => role.name),
      key: user.id,
    };
  }
  return { ...user, key: user.id };
};

export default function UserManagement({ messageApi, modal }) {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Get Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      if (res.result) {
        const transformedUsers = res.result.map(transformUserRoles);
        setUsers(transformedUsers);
      }
    } catch (error) {
      const messageError =
        error.response?.data?.message || "Error fetching users";
      messageApi.error(messageError);
    } finally {
      setLoading(false);
    }
  };

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

  const onFinish = async (values) => {
    setLoading(true);
    console.log(JSON.stringify(values));
    if (editingUser) {
      try {
        const res = await updateUser(editingUser.id, values);
        if (res)
          messageApi.success(
            `Cập nhật người dùng "${editingUser.username}" thành công!`
          );
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error updating user";
        messageApi.error(errorMessage);
      }
    } else {
      try {
        const res = await registerUser(values);
        if (res) messageApi.success("Thêm người dùng mới thành công!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error creating user";
        messageApi.error(errorMessage);
      }
    }
    fetchUsers();
    setLoading(false);
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    modal.confirm({
      title: "Xác nhận Xóa",
      content: `Bạn có chắc muốn xóa người dùng này?`,
      onOk() {
        setUsers(users.filter((user) => user.id !== id));
        messageApi.success(`Xóa người dùng ID: ${id} thành công!`);
      },
    });
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Họ và tên",
      key: "fullName",
      render: (_, record) =>
        `${record.firstName || ""} ${record.lastName || ""}`,
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
      dataIndex: "roles",
      key: "roles",
      render: (roles) => {
        const roleNames = Array.isArray(roles)
          ? roles.map((role) =>
              typeof role === "object" && role !== null ? role.name : role
            )
          : [];

        return (
          <>
            {roleNames.map((roleName) => {
              let color = roleName === "ADMIN" ? "volcano" : "green";
              return (
                <Tag
                  color={color}
                  key={roleName}
                  style={{ marginRight: 3, marginBottom: 3 }}
                >
                  {roleName}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    // Cột trạng thái đã bị xóa

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

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <Loading />;

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
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ roles: ["USER"] }} // Giá trị mặc định là mảng ["USER"]
        >
          {/* FORM ITEMS CHO HỌ VÀ TÊN */}
          <Space>
            <Form.Item
              name="firstName"
              label="Họ"
              rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Tên"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input />
            </Form.Item>
          </Space>

          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập Email!" }]}
          >
            <Input type="email" />
          </Form.Item>
          {/* Cập nhật field 'roles' để chọn nhiều giá trị */}
          <Form.Item
            name="roles" // Đã sửa thành 'roles'
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select mode="multiple" placeholder="Chọn vai trò">
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
