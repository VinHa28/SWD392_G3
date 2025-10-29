import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import { Link } from "react-router-dom";
import { Input, Select, Card, Row, Col, Slider } from "antd";

const { Search } = Input;
const { Option } = Select;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500000]);

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
      setProducts(response.result || []);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, priceRange]);

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "16px" }}>Product List</h1>

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
                <Card.Meta title={p.name} description={`${p.price} VND`} />
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
}
