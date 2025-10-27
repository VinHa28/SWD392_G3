import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <main
        style={{
          width: 1340,
          margin: "0 auto",
          maxWidth: "calc(100% - 48px)",
          padding: "0 24px",
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
