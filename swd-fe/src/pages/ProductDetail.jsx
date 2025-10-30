import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // 👈 thêm useNavigate
import { getProductById } from "../services/productService";
import { Button, Spin, Tag, message } from "antd";
import {
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
  TagsOutlined,
} from "@ant-design/icons";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // 👈 khởi tạo navigate
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        setProduct(res.data || res.result || null);
      } catch (err) {
        console.error("Error fetching product:", err);
        message.error("Failed to load product details!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    setAdding(true);
    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((item) => item.id === product.id);
      if (existing) existing.quantity += 1;
      else cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      message.success(`${product.name} added to cart! 🛒`);
      setAdding(false);
    }, 500);
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
        <p style={{ marginTop: 12 }}>Loading product details...</p>
      </div>
    );

  if (!product)
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <p>❌ Product not found.</p>
        <Link to="/products">
          <Button icon={<ArrowLeftOutlined />} type="primary">
            Back to Products
          </Button>
        </Link>
      </div>
    );

  return (
    <div
      style={{
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#fff",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          maxWidth: 900,
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {/* 🖼 Hình ảnh sản phẩm */}
        <div
          style={{
            flex: "1 1 360px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#fafafa",
            borderRadius: 12,
            padding: 16,
            height: 400,
          }}
        >
          <img
            alt={product.name}
            src={product.imageUrl}
            style={{
              width: "100%",
              height: "100%",
              maxWidth: 380,
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        </div>

        {/* 📋 Thông tin sản phẩm */}
        <div style={{ flex: "1 1 360px" }}>
          <h1 style={{ marginBottom: 8 }}>{product.name}</h1>

          <p
            style={{
              fontSize: 22,
              color: "#1890ff",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            {product.price?.toLocaleString("vi-VN")} ₫
          </p>

          <p style={{ color: "#555", marginBottom: 16 }}>
            {product.description || "No description available."}
          </p>

          <p style={{ marginBottom: 8 }}>
            <InboxOutlined style={{ color: "#b37feb", marginRight: 6 }} />
            <b>Stock:</b> {product.stock ?? "N/A"}
          </p>

          <p style={{ marginBottom: 16 }}>
            <TagsOutlined style={{ color: "#faad14", marginRight: 6 }} />
            <b>Category:</b>{" "}
            {product.categories?.length > 0 ? (
              product.categories.map((c) => (
                <Tag
                  key={c.id}
                  color="blue"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/category/${c.id}`)} 
                >
                  {c.name}
                </Tag>
              ))
            ) : (
              <span>Uncategorized</span>
            )}
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              loading={adding}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>

            <Link to="/products">
              <Button icon={<ArrowLeftOutlined />}>Back to Products</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
