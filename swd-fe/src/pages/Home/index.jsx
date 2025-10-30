<<<<<<< Updated upstream
import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

=======
import { Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

>>>>>>> Stashed changes
export default function Home() {
  const navigate = useNavigate();

  return (
<<<<<<< Updated upstream
    <div>
      Hompage
      <Button
        onClick={() => {
          navigate("/login");
        }}
      >
        Login
      </Button>
      <Button
        onClick={() => {
          navigate("/signup");
        }}
      >
        SignUp
=======
    <div style={{ padding: "60px 80px", textAlign: "center" }}>
      {/* Logo + tên thương hiệu */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            background: "linear-gradient(145deg, #ffffff, #f3f3f3)",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 22,
            color: "#8B0000",
          }}
        >
          GHP
        </div>
        <Title level={2} style={{ margin: 0, color: "#333" }}>
          GiaHoaPhat
        </Title>
      </div>

      {/* Banner */}
      <div
        style={{
          width: "100%",
          height: "400px",
          borderRadius: "16px",
          backgroundImage:
            "url('https://as2.ftcdn.net/jpg/03/45/04/43/1000_F_345044340_gc24VdUnxwu14LPkwsUEmoTtPpZeBrCh.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginBottom: "50px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      />

      {/* Nút xem thêm sản phẩm */}
      <Button
        type="primary"
        size="large"
        style={{
          backgroundColor: "#8B0000",
          borderColor: "#8B0000",
          borderRadius: 999,
          padding: "0 40px",
          fontWeight: 600,
        }}
        onClick={() => navigate("/products")}
      >
        Xem sản phẩm
>>>>>>> Stashed changes
      </Button>
    </div>
  );
}
