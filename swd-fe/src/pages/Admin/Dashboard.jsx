import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import {
  UserOutlined,
  TagsOutlined,
  GiftOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import UserManagement from "./UserManagement";
import CategoryManagement from "./CategoryManagement";
import ProductManagement from "./ProductManagement";

const { Header, Content, Sider } = Layout;

// Danh sách các mục menu
const menuItems = [
  {
    key: "users",
    icon: <UserOutlined />,
    label: "Quản lý Người dùng",
    component: <UserManagement />,
  },
  {
    key: "categories",
    icon: <TagsOutlined />,
    label: "Quản lý Danh mục",
    component: <CategoryManagement />,
  },
  {
    key: "products",
    icon: <GiftOutlined />,
    label: "Quản lý Sản phẩm",
    component: <ProductManagement />,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  // Lấy key hiện tại từ URL nếu bạn muốn menu đồng bộ với URL
  // const location = useLocation();
  // const defaultSelectedKey = location.pathname.split('/').pop() || 'users';

  // State để quản lý item đang được chọn. Mặc định là 'users'
  const [selectedKey, setSelectedKey] = useState("users");
  const { logout } = useAuth(); // Giả sử useAuth có hàm logout

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    // Nếu muốn chuyển đổi URL, có thể dùng:
    // navigate(`/dashboard/${e.key}`);
  };

  const handleLogout = () => {
    // Chỉ là UI logic, gọi API đăng xuất sau
    // console.log("Đăng xuất...");
    logout();
    navigate("/login");
  };

  // Tìm component tương ứng với key đã chọn
  const ContentComponent = menuItems.find(
    (item) => item.key === selectedKey
  )?.component;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div
          className="demo-logo-vertical"
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            lineHeight: "32px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          ADMIN DASHBOARD
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={[
            ...menuItems,
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Đăng xuất",
              onClick: handleLogout,
              danger: true,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            textAlign: "right",
            paddingRight: 24,
            fontWeight: "bold",
          }}
        >
          Xin chào Admin!
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {ContentComponent || <p>Chọn một mục quản lý từ menu bên trái.</p>}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
