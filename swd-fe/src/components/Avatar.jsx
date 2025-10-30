import React, { useMemo } from "react";

function getRandomColor() {
  const colors = [
    "#FFB6C1",
    "#FFD700",
    "#87CEFA",
    "#98FB98",
    "#FFA07A",
    "#DA70D6",
    "#F0E68C",
    "#AFEEEE",
    "#E6E6FA",
    "#90EE90",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function Avatar({ firstName = "", lastName = "", size = 48 }) {
  const initials =
    (firstName?.charAt(0) || "").toUpperCase() +
    (lastName?.charAt(0) || "").toUpperCase();

  const bgColor = useMemo(() => getRandomColor(), []);

  const style = {
    backgroundColor: bgColor,
    width: size,
    height: size,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: size / 2.5,
    textTransform: "uppercase",
    userSelect: "none",
  };

  return <div style={style}>{initials}</div>;
}
