import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: 40,
        height: 40,
        border: "1px solid #111",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={() => {
        navigate("/");
      }}
    >
      <img
        src="./logo.png"
        alt="logo"
        style={{ width: 50, height: 50, objectFit: "cover" }}
      />
    </div>
  );
}
