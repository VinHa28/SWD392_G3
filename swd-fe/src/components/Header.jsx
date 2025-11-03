

import {
  Layout,
  Menu,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Dropdown,
  Space,
  Badge,
  Drawer,
  Empty,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  FrownOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { getMyInfo } from "../services/authService";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { getAllCategories } from "../services/categoryService";
import cartService from "../services/cartService";

const { Header: AntdHeader } = Layout;
const { Title } = Typography;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
 // ← Drawer
useEffect(() => {
  if (user) {
    getData();
  }

  const handleCartUpdate = () => {
    if (user) getData();
  };

  window.addEventListener("cartUpdated", handleCartUpdate);

  return () => {
    window.removeEventListener("cartUpdated", handleCartUpdate);
  };
}, [user]);
 const getData = async () => {
  setLoading(true);
  try {
    const [resInfo, resCate, resCart] = await Promise.all([
      getMyInfo(),
      getAllCategories(),
      user
        ? cartService.getMyCart().catch((err) => {
            console.error("Cart fetch error:", err);
            return { data: { result: { items: [] } } };
          })
        : Promise.resolve({ data: { result: { items: [] } } }),
    ]);

    setCategories(
      resCate.result.map((item) => ({
        key: item.id,
        label: item.name,
      }))
    );
    setUserInfo(resInfo.result);

    // ✅ FIX: Parse response đúng cấu trúc
    console.log("Cart response:", resCart); // ← DEBUG: Xem cấu trúc thực tế
    
    // Thử cả 2 cấu trúc có thể có:
 const cartData = resCart.data?.result || resCart.data || resCart || {};
const items = cartData.items || [];

setCartItems(items); // ✅ lưu list sản phẩm

const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
setCartItemCount(total);
setIsCartEmpty(items.length === 0);

    
    console.log("Cart items:", items, "Total:", total); // ← DEBUG
  } catch (error) {
    console.error("Header load error:", error);
    setCartItemCount(0);
    setIsCartEmpty(true);
  } finally {
    setLoading(false);
  }
};

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const categoriesMenu = (
    <Menu
      items={categories.map((c) => ({
        key: c.key,
        label: (
          <span onClick={() => handleCategoryClick(c.key)}>{c.label}</span>
        ),
      }))}
    />
  );

  useEffect(() => {
    if (user) {
      getData();
    }
  }, [user]);

  if (loading) return <Loading />;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: "profile",
          label: (
            <Link to="/profile">
              <Space>
                <UserOutlined />
                Profile
              </Space>
            </Link>
          ),
        },
        {
          key: "logout",
          label: (
            <Space>
              <LogoutOutlined />
              Đăng xuất
            </Space>
          ),
          danger: true,
          onClick: handleLogout,
        },
      ]}
    />
  );

  // MỞ DRAWER KHI CLICK GIỎ
  const openCartDrawer = () => {
    setDrawerVisible(true);
  };

  const closeCartDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <>
      <AntdHeader
        style={{
          backgroundColor: "#FFFFFF",
          padding: "0 50px",
          height: "80px",
          lineHeight: "80px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Row justify="space-between" align="middle" style={{ width: "100%" }}>
          {/* Logo + Brand name */}
          <Col span={4} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Logo />
            <Title level={3} style={{ margin: 0, color: "#333333" }}>
              GiaHoaPhat
            </Title>
          </Col>

          {/* Navigation Menu */}
          <Col span={10}>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={["home"]}
              style={{ borderBottom: "none", lineHeight: "78px" }}
              items={[
                { key: "home", label: <Link to="/">Home</Link> },
                {
                  key: "categories",
                  label: (
                    <Dropdown overlay={categoriesMenu} placement="bottomLeft">
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                          Categories
                          <DownOutlined style={{ fontSize: "10px" }} />
                        </Space>
                      </a>
                    </Dropdown>
                  ),
                },
                { key: "products", label: <Link to="/products">Products</Link> },
              ]}
            />
          </Col>

          {/* Search + User + Cart */}
          <Col
            span={10}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {/* Search Box */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "20px",
              }}
            >
              <Input
                placeholder="Search"
                style={{
                  width: "180px",
                  borderRadius: "6px 0 0 6px",
                  borderRight: "none",
                }}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                style={{
                  backgroundColor: "#8B0000",
                  borderColor: "#8B0000",
                  borderRadius: "0 6px 6px 0",
                  height: "32px",
                  width: "45px",
                  padding: "0",
                }}
              />
            </div>

            {/* User dropdown + Cart */}
            {user ? (
              <Space size="large">
                <Dropdown
                  overlay={userMenu}
                  trigger={["hover"]}
                  placement="bottomRight"
                >
                  <div style={{ cursor: "pointer" }}>
                    <Avatar
                      firstName={userInfo.firstName || ""}
                      lastName={userInfo.lastName || ""}
                    />
                  </div>
                </Dropdown>

                {/* GIỎ HÀNG: CLICK MỞ DRAWER */}
                <div style={{ cursor: "pointer" }} onClick={openCartDrawer}>
                  {isCartEmpty ? (
                    <ShoppingCartOutlined
                      style={{ fontSize: "20px", color: "#333333" }}
                    />
                  ) : (
                    <Badge
                      count={cartItemCount}
                      size="small"
                      style={{ backgroundColor: "#8B0000" }}
                    >
                      <ShoppingCartOutlined
                        style={{ fontSize: "20px", color: "#333333" }}
                      />
                    </Badge>
                  )}
                </div>
              </Space>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <Button
                  style={{
                    borderRadius: 999,
                    fontWeight: 600,
                    border: "1px solid #8B0000",
                    color: "#8B0000",
                  }}
                  size="large"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  style={{
                    borderRadius: 999,
                    fontWeight: 600,
                    backgroundColor: "#8B0000",
                    color: "white",
                  }}
                  onClick={() => navigate("/signup")}
                  size="large"
                >
                  Signup
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </AntdHeader>

      {/* DRAWER: GIỎ HÀNG TRỐNG */}
      <Drawer
        title="Giỏ hàng"
        placement="right"
        onClose={closeCartDrawer}
        open={drawerVisible}
        width={380}
        headerStyle={{ borderBottom: "1px solid #f0f0f0" }}
        bodyStyle={{ padding: 0 }}
      >
        {isCartEmpty ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: "40px 20px",
              textAlign: "center",
            }}
          >
            <FrownOutlined
              style={{ fontSize: 64, color: "#d9d9d9", marginBottom: 16 }}
            />
            <div style={{ fontSize: 18, color: "#595959", marginBottom: 8 }}>
              Giỏ hàng hiện đang trống
            </div>
            <div style={{ fontSize: 14, color: "#8c8c8c", marginBottom: 24 }}>
              Hãy thêm sản phẩm bạn thích!
            </div>
            <Button
              type="primary"
              icon={<HomeOutlined />}
              size="large"
              style={{
                backgroundColor: "#8B0000",
                borderColor: "#8B0000",
                borderRadius: 8,
              }}
              onClick={() => {
                closeCartDrawer();
                navigate("/");
              }}
            >
              Tiếp tục mua sắm
            </Button>
          </div>
      ) : (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: 16, fontSize: 16, textAlign: "center" }}>
        Có <strong>{cartItemCount}</strong> sản phẩm trong giỏ
      </div>

      {/* ✅ DANH SÁCH SẢN PHẨM */}
      {cartItems.map((item) => (
  <div
    key={item.productId}
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: 12,
      borderBottom: "1px solid #f0f0f0",
      paddingBottom: 8,
    }}
  >
    <img
      src={item.product?.imageUrl || "/no-image.png"}
      alt={item.productName}
      style={{
        width: 60,
        height: 60,
        objectFit: "cover",
        borderRadius: 8,
        marginRight: 12,
      }}
    />
    <div style={{ flex: 1, textAlign: "left" }}>
      <div style={{ fontWeight: 500 }}>{item.productName}</div>
      <div style={{ fontSize: 13, color: "#888" }}>
        SL: {item.quantity}
      </div>
      <div style={{ color: "#8B0000", fontWeight: 600 }}>
        {(item.unitPrice || 0).toLocaleString()} ₫
      </div>

      {/* 🟡 Thêm nút tăng/giảm và xóa */}
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <Button
          size="small"
          onClick={async () => {
            await cartService.updateQuantity(item.productId, item.quantity - 1);
            window.dispatchEvent(new Event("cartUpdated"));
          }}
        >
          -
        </Button>
        <Button
          size="small"
          onClick={async () => {
            await cartService.updateQuantity(item.productId, item.quantity + 1);
            window.dispatchEvent(new Event("cartUpdated"));
          }}
        >
          +
        </Button>
        <Button
          danger
          size="small"
          onClick={async () => {
            await cartService.removeItem(item.productId);
            window.dispatchEvent(new Event("cartUpdated"));
          }}
        >
          Xóa
        </Button>
      </div>
    </div>
  </div>
))}
<div
  style={{
    borderTop: "1px solid #f0f0f0",
    paddingTop: 16,
    marginTop: 16,
    display: "flex",
    justifyContent: "space-between",
    fontSize: 16,
    fontWeight: 600,
  }}
>
  <span>Tổng tiền:</span>
  <span style={{ color: "#8B0000" }}>
    {cartItems
      .reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0)
      .toLocaleString()}{" "}
    ₫
  </span>
</div>
      <Button
        type="primary"
        size="large"
        style={{
          backgroundColor: "#8B0000",
          borderColor: "#8B0000",
          width: "100%",
          borderRadius: 8,
          marginTop: 16,
        }}
        onClick={() => {
          closeCartDrawer();
          navigate("/cart");
        }}
      >
        Xem chi tiết giỏ hàng
      </Button>
    </div>
  )}
</Drawer>
    </>
  );
};

export default Header;