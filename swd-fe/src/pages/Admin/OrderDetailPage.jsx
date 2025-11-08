import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Descriptions, Table, Tag, Card, Spin, message, Button, Divider, Empty } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getOrderById } from "../../services/orderService";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await getOrderById(orderId);
        console.log("API Response (Detail):", response);
        // Kiểm tra kỹ cấu trúc trả về: response.data hoặc response.result
        setOrder(response);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        message.error("Không thể tải chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Đang tải chi tiết đơn hàng..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <Empty description="Không tìm thấy thông tin đơn hàng" />
        <Button type="primary" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
          Quay lại
        </Button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "gold";
      case "PROCESSING": return "blue";
      case "SHIPPED": return "cyan";
      case "DELIVERED": return "green";
      case "CANCELLED": return "red";
      default: return "default";
    }
  };

  const productColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName", // Khớp với DTO: productName
      key: "productName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {record.productImageUrl ? ( // Khớp với DTO: productImageUrl
            <img
              src={record.productImageUrl}
              alt={text}
              style={{ width: 50, height: 50, objectFit: "cover", marginRight: 12, borderRadius: 6, border: '1px solid #f0f0f0' }}
            />
          ) : (
            <div style={{ width: 50, height: 50, background: '#f5f5f5', marginRight: 12, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 12 }}>No Img</div>
          )}
          <span style={{ fontWeight: 500 }}>{text || "Sản phẩm không xác định"}</span>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right",
      render: (price) => <span style={{color: '#595959'}}>{price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Thành tiền",
      key: "total",
      align: "right",
      render: (_, record) => (
        <span style={{ fontWeight: "bold" }}>
          {(record.quantity * record.unitPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px 40px", background: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header Navigation */}
      <div style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại danh sách</Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        {/* Order Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#1f1f1f' }}>Chi tiết Đơn hàng #{order.id.substring(0, 8)}</h2>
              <span style={{ color: '#8c8c8c' }}>Ngày đặt: {order.requiredDate}</span>
          </div>
          <Tag color={getStatusColor(order.status)} style={{ fontSize: 14, padding: "6px 12px", height: 'fit-content' }}>
            {order.status}
          </Tag>
        </div>

        <Divider style={{margin: '24px 0'}} />

        {/* Customer Info */}
        <Descriptions title="Thông tin khách hàng & Giao nhận" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} size="middle">
          <Descriptions.Item label="Khách hàng">{order.customerName || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">{order.paymentMethod || "COD"}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
             {order.address || "Không có địa chỉ"}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left" style={{ marginTop: 40, marginBottom: 24, fontSize: 16 }}>Danh sách sản phẩm</Divider>

        {/* Product Table */}
        <Table
          columns={productColumns}
          dataSource={order.orderDetails}
          rowKey="productId" // Sử dụng productId làm key nếu có
          pagination={false}
          bordered
          summary={(pageData) => {
            let totalQty = 0;
            pageData.forEach(({ quantity }) => (totalQty += quantity));
            return (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ background: "#fafafa", fontWeight: 'bold' }}>
                  <Table.Summary.Cell index={0} colSpan={2} align="right">Tổng cộng:</Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="center">{totalQty}</Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                      <span style={{ color: "#cf1322", fontSize: 18 }}>
                        {order.totalPrice?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </span>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default OrderDetailPage;