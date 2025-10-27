import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-3 mt-auto">
      <p>© {new Date().getFullYear()} My App. All rights reserved.</p>
    </footer>
  );
}
