import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCategoryById } from "../services/categoryService";
import { getAllProducts } from "../services/productService";
import { Card, Spin, Empty, message, Button, Tag } from "antd";
import {
  ArrowLeftOutlined,
  AppstoreOutlined,
  EyeOutlined,
} from "@ant-design/icons";

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 📦 Lấy thông tin danh mục
        const catRes = await getCategoryById(id);
        setCategory(catRes.data || catRes.result);

        // 🛍 Lấy tất cả sản phẩm rồi lọc theo category id
        const prodRes = await getAllProducts();
        const allProducts = prodRes.data || prodRes.result || [];
        const filtered = allProducts.filter((p) =>
          p.categories?.some((c) => String(c.id) === String(id))
        );

        setProducts(filtered);
      } catch (err) {
        console.error("Error loading category or products:", err);
        message.error("Không thể tải danh mục hoặc sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
        <p style={{ marginTop: 12 }}>Đang tải sản phẩm...</p>
      </div>
    );

  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* 🏷 Tiêu đề danh mục */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto 40px",
          textAlign: "center",
        }}
      >
        <Tag color="blue" style={{ fontSize: 16, padding: "6px 12px" }}>
          <AppstoreOutlined /> CATEGORY
        </Tag>
        <h1 style={{ marginTop: 10, marginBottom: 8 }}>{category?.name}</h1>
        <p style={{ color: "#666" }}>{category?.description || "Danh mục sản phẩm"}</p>
        <Link to="/products">
          <Button icon={<ArrowLeftOutlined />} style={{ marginTop: 10 }}>
            Quay lại danh sách sản phẩm
          </Button>
        </Link>
      </div>

      {/* 🧱 Lưới sản phẩm */}
      {products.length > 0 ? (
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "24px",
          }}
        >
          {products.map((p) => (
            <Card
              key={p.id}
              hoverable
              cover={
                <div
                  onClick={() => navigate(`/product/${p.id}`)} // 👈 Click ảnh để xem chi tiết
                  style={{
                    height: 220,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#fafafa",
                    borderRadius: 8,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                >
                  <img
                    alt={p.name}
                    src={p.imageUrl}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              }
              style={{
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <Card.Meta
                title={
                  <Link
                    to={`/product/${p.id}`}
                    style={{
                      color: "#000",
                      fontWeight: 600,
                      fontSize: 16,
                      textDecoration: "none",
                    }}
                  >
                    {p.name}
                  </Link>
                }
                description={
                  <span style={{ color: "#1890ff", fontWeight: 500 }}>
                    {p.price?.toLocaleString("vi-VN")} ₫
                  </span>
                }
              />
              <div style={{ marginTop: 12 }}>
                <Button
                  icon={<EyeOutlined />}
                  block
                  onClick={() => navigate(`/product/${p.id}`)} // 👈 Nút xem chi tiết
                >
                  View Detail
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Empty
          description="Không có sản phẩm trong danh mục này"
          style={{ marginTop: 80 }}
        />
      )}
    </div>
  );
}
