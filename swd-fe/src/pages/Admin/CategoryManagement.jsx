// ./pages/Admin/CategoryManagement.jsx

import React, { useState } from "react";
import { Table, Button, Space, Modal, Form, Input, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

// Dữ liệu mẫu
const initialCategories = [
  { id: 1, key: "1", name: "Điện thoại", slug: "dien-thoai", productCount: 150 },
  { id: 2, key: "2", name: "Laptop", slug: "laptop", productCount: 80 },
  { id: 3, key: "3", name: "Phụ kiện", slug: "phu-kien", productCount: 320 },
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const showModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    // ⚠️ Logic Call API: POST/PUT
    if (editingCategory) {
      // Cập nhật UI (Tạm thời)
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...values } : cat
        )
      );
    } else {
      // Thêm mới UI (Tạm thời)
      const newCat = {
        ...values,
        id: Date.now(),
        key: Date.now().toString(),
        productCount: 0, // Mặc định là 0
      };
      setCategories([...categories, newCat]);
    }

    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    // ⚠️ Logic Call API: DELETE
    Modal.confirm({
      title: "Xác nhận Xóa",
      content: `Bạn có chắc muốn xóa Danh mục ID: ${id}?`,
      onOk() {
        setCategories(categories.filter((cat) => cat.id !== id));
        // console.log(`API Xóa Category ID: ${id}`);
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
      title: "Tên Danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (slug) => <Tag color="blue">{slug}</Tag>,
    },
    {
      title: "Số lượng SP",
      dataIndex: "productCount",
      key: "productCount",
      sorter: (a, b) => a.productCount - b.productCount,
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
      <h2>Quản lý Danh mục 🏷️</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal(null)}
        style={{ marginBottom: 16 }}
      >
        Thêm Danh mục mới
      </Button>
      <Table columns={columns} dataSource={categories} rowKey="id" />

      <Modal
        title={editingCategory ? "Chỉnh sửa Danh mục" : "Thêm Danh mục mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên Danh mục"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug (URL Friendly Name)"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập slug!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategory ? "Cập nhật" : "Thêm mới"}
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