// ./pages/Admin/ProductManagement.jsx

import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

// Dữ liệu mẫu (sẽ được thay thế bằng API call sau)
const initialProducts = [
  {
    id: 101,
    key: "101",
    name: "iPhone 15 Pro Max",
    price: 32000000,
    category: "Điện thoại",
    stock: 50,
  },
  {
    id: 102,
    key: "102",
    name: "Macbook Pro M3",
    price: 45000000,
    category: "Laptop",
    stock: 25,
  },
];

// Danh sách danh mục giả định để dùng trong Select
const mockCategories = [
  { id: 1, name: "Điện thoại" },
  { id: 2, name: "Laptop" },
  { id: 3, name: "Phụ kiện" },
];

export default function ProductManagement() {
  const [products, setProducts] = useState(initialProducts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const showModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    // ⚠️ Logic Call API: POST/PUT
    if (editingProduct) {
      // Cập nhật UI (Tạm thời)
      setProducts(
        products.map((prod) =>
          prod.id === editingProduct.id ? { ...prod, ...values } : prod
        )
      );
    } else {
      // Thêm mới UI (Tạm thời)
      const newProd = {
        ...values,
        id: Date.now(),
        key: Date.now().toString(),
      };
      setProducts([...products, newProd]);
    }

    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    // ⚠️ Logic Call API: DELETE
    Modal.confirm({
      title: "Xác nhận Xóa",
      content: `Bạn có chắc muốn xóa Sản phẩm ID: ${id}?`,
      onOk() {
        setProducts(products.filter((prod) => prod.id !== id));
        // console.log(`API Xóa Product ID: ${id}`);
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
      title: "Tên Sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
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
      <h2>Quản lý Sản phẩm 🎁</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal(null)}
        style={{ marginBottom: 16 }}
      >
        Thêm Sản phẩm mới
      </Button>
      <Table columns={columns} dataSource={products} rowKey="id" />

      <Modal
        title={editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên Sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>

          <Space size="middle">
            <Form.Item
              name="price"
              label="Giá"
              rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            >
              <InputNumber
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                style={{ width: 250 }}
              />
            </Form.Item>
            <Form.Item
              name="stock"
              label="Tồn kho"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng tồn kho!" },
              ]}
            >
              <InputNumber min={0} style={{ width: 250 }} />
            </Form.Item>
          </Space>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn một danh mục">
              {mockCategories.map((cat) => (
                <Option key={cat.id} value={cat.name}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingProduct ? "Cập nhật" : "Thêm mới"}
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
