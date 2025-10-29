// ./pages/Admin/CategoryManagement.jsx

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Form, Input, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Loading from "../../components/Loading";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../services/categoryService";

export default function CategoryManagement({ modal, messageApi }) {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories({});
      if (res && res.result) {
        const transformedCategories = res.result.map((cat) => ({
          ...cat,
          key: cat.id,
        }));
        setCategories(transformedCategories);
      }
    } catch (error) {
      const messageError =
        error.response?.data?.message || "Error fetching categories";
      messageApi.error(messageError);
    } finally {
      setLoading(false);
    }
  };

  const deleteCate = async (id) => {
    try {
      const res = await deleteCategory(id);
      if (res) messageApi.success(`Xóa Danh mục thành công!`);
    } catch (error) {
      const messageError =
        error.response?.data?.message || "Error deleting categories";
      messageApi.error(messageError);
    } finally {
      fetchCategories();
    }
  };

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

  const onFinish = async (values) => {
    if (editingCategory) {
      try {
        const res = await updateCategory(editingCategory.id, values);
        if (res)
          messageApi.success(
            `Cập nhật Danh mục ID: ${editingCategory.name} thành công!`
          );
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error updating category";
        messageApi.error(errorMessage);
      }
    } else {
      try {
        const res = await createCategory(values);
        if (res) messageApi.success("Thêm Danh mục mới thành công!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error creating category";
        messageApi.error(errorMessage);
      }
    }
    fetchCategories();
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    modal.confirm({
      title: "Xác nhận Xóa",
      content: `Bạn có chắc muốn xóa Danh mục ID: ${id}?`,
      onOk() {
        deleteCate(id);
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
      title: "Tên Danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "URL Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) => (
        <Tag color={url ? "blue" : "default"}>
          {url ? "Có URL Ảnh" : "Chưa có"}
        </Tag>
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

  useEffect(() => {
    fetchCategories();
  }, []);
  if (loading) return <Loading />;

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
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input />
          </Form.Item>
          {/* TRƯỜNG MÔ TẢ */}
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          {/* TRƯỜNG URL ẢNH */}
          <Form.Item
            name="imageUrl"
            label="URL Ảnh"
            rules={[{ required: true, message: "Vui lòng nhập URL ảnh!" }]}
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
