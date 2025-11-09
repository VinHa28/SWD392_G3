import { useAuth } from "../contexts/AuthContext";
import cartService from "../services/cartService";
import { message, Button, Spin, Tag, Divider } from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductById } from "../services/productService";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        // API trả về ApiResponse<ProductResponse>
        // => res.data.result hoặc res.result tuỳ cấu trúc backend
        const data = res.data?.result || res.result || res.data;
        setProduct(data);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await cartService.addToCart(product.id, 1);
      message.success(`${product.name} đã được thêm vào giỏ!`);
      window.dispatchEvent(new Event("cartUpdated")); // cập nhật header
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi thêm vào giỏ hàng!");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return <Spin size="large" style={{ marginTop: 100, display: "block" }} />;

  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  return (
    <div
      style={{
        display: "flex",
        gap: 50,
        padding: "40px 80px",
        alignItems: "flex-start",
      }}
    >
      {/* ẢNH SẢN PHẨM */}
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{
          width: 350,
          height: 350,
          borderRadius: 16,
          objectFit: "cover",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      />

      {/* THÔNG TIN CHI TIẾT */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>{product.name}</h1>

        {/* Danh mục */}
     {product.categories?.length > 0 && (
  <div style={{ marginBottom: 16 }}>
    {product.categories.map((cat) => (
      <Tag
        key={cat.id}
        color="blue"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/category/${cat.id}`)}
      >
        {cat.name}
      </Tag>
    ))}
  </div>
)}


        {/* Mô tả */}
        <p style={{ color: "#555", fontSize: 16 }}>{product.description}</p>

        <Divider />

        {/* Thông tin giá + tồn kho */}
        <p style={{ fontSize: 20, fontWeight: "bold", color: "#ff4d4f" }}>
          {product.price?.toLocaleString("vi-VN")} ₫
        </p>
        <p style={{ fontSize: 14, color: "#888" }}>
          Tồn kho:{" "}
          <span style={{ color: product.stock > 0 ? "green" : "red" }}>
            {product.stock > 0 ? `${product.stock} sản phẩm` : "Hết hàng"}
          </span>
        </p>

        {/* Nút hành động */}
        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            loading={adding}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Thêm vào giỏ
          </Button>
          <Link to="/products">
            <Button icon={<ArrowLeftOutlined />}>Quay lại</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
