import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { Link, useNavigate } from "react-router-dom";
import {
  Input,
  Select,
  Card,
  Row,
  Col,
  Spin,
  Empty,
  Dropdown,
  Space,
  Checkbox,
} from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRanges, setPriceRanges] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.result || []);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts({
        search: search || undefined,
        category: category || undefined,
      });

      let fetched = res.result || [];

      // 🔸 Lọc theo category
      if (category) {
        fetched = fetched.filter((p) =>
          p.categories?.some((c) => String(c.id) === String(category))
        );
      }

      // 🔸 Lọc theo khoảng giá (checkbox)
      if (priceRanges.length > 0) {
        fetched = fetched.filter((p) => {
          return priceRanges.some((range) => {
            if (range === "under50") return p.price < 50000;
            if (range === "50to100") return p.price >= 50000 && p.price <= 100000;
            if (range === "above100") return p.price > 100000;
            return false;
          });
        });
      }

      // 🔸 Sắp xếp
      if (sortBy === "nameAsc") fetched.sort((a, b) => a.name.localeCompare(b.name));
      if (sortBy === "nameDesc") fetched.sort((a, b) => b.name.localeCompare(a.name));
      if (sortBy === "priceAsc") fetched.sort((a, b) => a.price - b.price);
      if (sortBy === "priceDesc") fetched.sort((a, b) => b.price - a.price);

      setProducts(fetched);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch mỗi khi filter thay đổi
  useEffect(() => {
    const delay = setTimeout(() => fetchProducts(), 400);
    return () => clearTimeout(delay);
  }, [search, category, priceRanges, sortBy]);

  // 🔹 Menu sắp xếp
  const sortMenu = {
    items: [
      { key: "nameAsc", label: "Name: A → Z" },
      { key: "nameDesc", label: "Name: Z → A" },
      { key: "priceAsc", label: "Price: Low → High" },
      { key: "priceDesc", label: "Price: High → Low" },
    ],
    onClick: (e) => setSortBy(e.key),
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "16px" }}>Product List</h1>

      {/* 🔍 Bộ lọc */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
          alignItems: "center",
        }}
      >
        <Search
          placeholder="Search by product name..."
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />

        <Select
          placeholder="Filter by category"
          value={category || undefined}
          onChange={(value) => setCategory(value)}
          allowClear
          style={{ width: 200 }}
        >
          {categories.map((c) => (
            <Option key={c.id} value={c.id}>
              {c.name}
            </Option>
          ))}
        </Select>

        <Checkbox.Group
          options={[
            { label: "Under 50,000₫", value: "under50" },
            { label: "50,000₫ - 100,000₫", value: "50to100" },
            { label: "Above 100,000₫", value: "above100" },
          ]}
          value={priceRanges}
          onChange={setPriceRanges}
        />

        <Dropdown menu={sortMenu}>
          <a onClick={(e) => e.preventDefault()}>
            <Space style={{ fontSize: 16 }}>
              Sort{" "}
              {sortBy
                ? `(${sortMenu.items.find((i) => i.key === sortBy)?.label})`
                : ""}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>

      {/* 🧱 Danh sách sản phẩm */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : products.length > 0 ? (
        <Row gutter={[16, 16]}>
          {products.map((p) => (
            <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <div
                    onClick={() => navigate(`/product/${p.id}`)}
                    style={{
                      cursor: "pointer",
                      height: 200,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "#fafafa",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      alt={p.name}
                      src={p.imageUrl}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        transition: "0.3s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={p.name}
                  description={`${p.price?.toLocaleString("vi-VN") || 0} ₫`}
                />
                <div style={{ marginTop: "10px" }}>
                  <Link to={`/product/${p.id}`}>View Details</Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No products found" style={{ marginTop: 50 }} />
      )}
    </div>
  );
}
