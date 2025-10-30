import React, { useState } from "react";
import { Col, Layout, Menu, message, Modal, theme } from "antd";
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
import Logo from "../../components/Logo";
import Title from "antd/es/typography/Title";

const { Header, Content, Sider } = Layout;

// Danh sách các mục menu

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("users");
  const { logout } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalHolder] = Modal.useModal();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Quản lý Người dùng",
      component: <UserManagement messageApi={messageApi} modal={modal} />,
    },
    {
      key: "categories",
      icon: <TagsOutlined />,
      label: "Quản lý Danh mục",
      component: <CategoryManagement messageApi={messageApi} modal={modal} />,
    },
    {
      key: "products",
      icon: <GiftOutlined />,
      label: "Quản lý Sản phẩm",
      component: <ProductManagement messageApi={messageApi} modal={modal} />,
    },
  ];

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const ContentComponent = menuItems.find(
    (item) => item.key === selectedKey
  )?.component;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      {modalHolder}
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
            padding: "0 24px",
            background: colorBgContainer,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Col
            span={4}
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <Logo />
            <Title
              level={3}
              style={{ margin: 0, color: "#333333", whiteSpace: "nowrap" }}
            >
              GiaHoaPhat
            </Title>
          </Col>
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
