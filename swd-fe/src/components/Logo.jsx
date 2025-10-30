import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigate = useNavigate();
  const logoStyle = {
    color: "#8B0000",
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "white",
    borderRadius: 12,
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
  };

  return (
    <div
      style={logoStyle}
      onClick={() => {
        navigate("/");
      }}
    >
      GHP
    </div>
  );
}
