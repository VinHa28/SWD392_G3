import React, { useEffect, useState } from "react";
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
<<<<<<< Updated upstream
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [priceRange, setPriceRange] = useState([0, 500000]); // min and max VND

    const fetchProducts = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (category) params.category = category;
            if (priceRange) {
                params.minPrice = priceRange[0];
                params.maxPrice = priceRange[1];
            }

            const response = await getAllProducts(params);
            setProducts(response.data || []);
        } catch (err) {
            console.error("Error loading products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search, category, priceRange]);
=======
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRanges, setPriceRanges] = useState([]); // 👈 Checkbox chọn nhiều
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Lấy categories
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

  // 🔹 Lấy sản phẩm
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

      // 🔸 Lọc theo giá (checkbox nhiều lựa chọn)
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

      // 🔸 Sort
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

  // 🔹 Fetch mỗi khi filter đổi
  useEffect(() => {
    const delay = setTimeout(() => fetchProducts(), 400);
    return () => clearTimeout(delay);
  }, [search, category, priceRanges, sortBy]);

  // 🔹 Menu sort
  const sortMenu = {
    items: [
      { key: "nameAsc", label: "Name: A → Z" },
      { key: "nameDesc", label: "Name: Z → A" },
      { key: "priceAsc", label: "Price: Low → High" },
      { key: "priceDesc", label: "Price: High → Low" },
    ],
    onClick: (e) => setSortBy(e.key),
  };
>>>>>>> Stashed changes

    return (
        <div style={{ padding: "24px" }}>
            <h1 style={{ marginBottom: "16px" }}>Product List</h1>

<<<<<<< Updated upstream
            {/* 🔍 Filters */}
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
                    placeholder="Search product..."
                    onSearch={(value) => setSearch(value)}
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
                    <Option value="Cake">Cake</Option>
                    <Option value="Cookie">Cookie</Option>
                    <Option value="Bread">Bread</Option>
                </Select>

                {/* 💰 Price Range Slider */}
                <div style={{ width: 300 }}>
                    <p style={{ marginBottom: 4 }}>Price Range (VND)</p>
                    <Slider
                        range
                        min={0}
                        max={500000}
                        step={1000}
                        value={priceRange}
                        onChange={(value) => setPriceRange(value)}
                        tooltip={{ formatter: (val) => `${val} VND` }}
                    />
                </div>
            </div>

            {/* 🧱 Product Grid */}
            <Row gutter={[16, 16]}>
                {products.length > 0 ? (
                    products.map((p) => (
                        <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                hoverable
                                cover={
                                    p.imageUrl ? (
                                        <img
                                            alt={p.name}
                                            src={p.imageUrl}
                                            style={{ height: 200, objectFit: "cover" }}
                                        />
                                    ) : null
                                }
                            >
                                <Card.Meta
                                    title={p.name}
                                    description={`${p.price} VND`}
                                />
                                <div style={{ marginTop: "10px" }}>
                                    <Link to={`/product/${p.id}`}>View Details</Link>
                                </div>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </Row>
        </div>
    );
=======
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
>>>>>>> Stashed changes
}
