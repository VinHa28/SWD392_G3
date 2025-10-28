import { Spin } from "antd";

const Loading = ({ tip = "Loading...", size = "large" }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default Loading;
