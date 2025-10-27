import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "24px 0",
        borderTop: "1px solid #111",
      }}
    >
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} My App. All rights reserved.
      </p>
    </footer>
  );
}
