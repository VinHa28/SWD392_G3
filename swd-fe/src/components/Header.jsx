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
  Flex,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DownOutlined,
} from "@ant-design/icons";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const { Header: AntdHeader } = Layout;
const { Search } = Input;
const { Title } = Typography;

const categoriesMenu = (
  <Menu
    items={[
      { key: "1", label: "Cakes" },
      { key: "2", label: "Chocolates" },
      { key: "3", label: "Cookies" },
      { key: "4", label: "Cheesecake Pies" },
    ]}
  />
);

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
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
        <Col
          span={4}
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          <Logo />
          <Title level={3} style={{ margin: 0, color: "#333333" }}>
            GiaHoaPhat
          </Title>
        </Col>

        <Col span={10}>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={["home"]}
            style={{ borderBottom: "none", lineHeight: "78px" }}
            items={[
              { key: "home", label: <Link to={"/"}>Home</Link> },
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
              {
                key: "products",
                label: <Link to={"/products"}>Products</Link>,
              },
            ]}
          />
        </Col>

        <Col
          span={10}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
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

          {user ? (
            <Space size="large">
              <UserOutlined style={{ fontSize: "20px", color: "#333333" }} />
              <ShoppingCartOutlined
                style={{ fontSize: "20px", color: "#333333" }}
              />
            </Space>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <Button
                style={{
                  borderRadius: 999,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #8B0000",
                  color: "#8B0000",
                }}
                size="large"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
              <Button
                style={{
                  borderRadius: 999,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#8B0000",
                  color: "white",
                }}
                onClick={() => {
                  navigate("/signup");
                }}
                size="large"
              >
                Signup
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </AntdHeader>
  );
};

export default Header;
