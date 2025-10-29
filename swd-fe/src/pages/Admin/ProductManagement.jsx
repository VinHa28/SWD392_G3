/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
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
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  updateProduct,
} from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import Loading from "../../components/Loading";

const { Option } = Select;
const { TextArea } = Input;

const getCategoryNames = (categories) => {
  if (!categories || categories.length === 0) return "Chưa phân loại";
  return categories.map((cat) => cat.name).join(", ");
};

const transformProductToForm = (product) => {
  const categoryIds = product.categories
    ? product.categories.map((cat) => cat.id)
    : [];

  return {
    ...product,
    key: product.id,
    categoryIds: categoryIds,
  };
};

export default function ProductManagement({ messageApi, modal }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories({});
      if (res && res.result) {
        setCategories(res.result);
      }
    } catch (error) {
      const messageError =
        error.response?.data?.message || "Error fetching categories";
      messageApi.error(messageError);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      if (res.result) {
        const transformedProducts = res.result.map(transformProductToForm);
        setProducts(transformedProducts);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching products";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await deleteProductById(id);
      messageApi.success(`Xóa sản phẩm thành công!`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error updating products";
      messageApi.error(errorMessage);
    } finally {
      fetchProducts();
      fetchCategories();
    }
  };

  const showModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue(transformProductToForm(product));
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

  const onFinish = async (values) => {
    const selectedCategoryIds = values.categoryIds || [];
    const newCategoriesData = categories.filter((cat) =>
      selectedCategoryIds.includes(cat.id)
    );
    const productWithCategories = {
      ...values,
      categories: newCategoriesData.map((cat) => cat.id),
    };
    if (editingProduct) {
      try {
        const res = await updateProduct(
          editingProduct.id,
          productWithCategories
        );
        if (res)
          messageApi.success(
            `Cập nhật Sản phẩm ID: "${productWithCategories.name}" thành công!`
          );
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error updating products";
        messageApi.error(errorMessage);
      } finally {
        fetchCategories();
        fetchProducts();
      }
    } else {
      try {
        const res = await createProduct(productWithCategories);
        if (res) messageApi.success("Thêm Sản phẩm mới thành công!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error creating products";
        messageApi.error(errorMessage);
      } finally {
        fetchCategories();
        fetchProducts();
      }
    }

    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    modal.confirm({
      title: "Xác nhận Xóa",
      content: `Bạn có chắc muốn xóa Sản phẩm ID: ${id}?`,
      onOk() {
        deleteProduct(id);
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
      title: "Tên Sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "categories",
      key: "categories",
      render: (categories) => getCategoryNames(categories),
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
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
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
    fetchProducts();
  }, []);

  if (loading) return <Loading />;

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
                step={5000}
              />
            </Form.Item>
            <Form.Item
              name="stock"
              label="Kho"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng tồn kho!" },
              ]}
            >
              <InputNumber min={0} style={{ width: 250 }} />
            </Form.Item>
          </Space>

          {/* CẬP NHẬT TRƯỜNG DANH MỤC - Dùng mode="multiple" và ID làm value */}
          <Form.Item
            name="categoryIds" // Dùng tên categoryIds để dễ phân biệt trong form
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select mode="multiple" placeholder="Chọn (các) danh mục">
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* THÊM TRƯỜNG MÔ TẢ */}
          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} />
          </Form.Item>

          {/* THÊM TRƯỜNG URL ẢNH */}
          <Form.Item name="imageUrl" label="URL Ảnh">
            <Input />
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
