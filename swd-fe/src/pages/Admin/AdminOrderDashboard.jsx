import React, { useState, useEffect, useCallback } from "react";
import { Table, Tag, Space, Select, message, Button, Popconfirm, Tooltip, Card, Typography } from "antd";
import { EyeOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllOrders, updateOrderStatus, cancelOrder } from "../../services/orderService";

const { Option } = Select;
const { Title } = Typography;

const AdminOrderDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [filterStatus, setFilterStatus] = useState("");
    const navigate = useNavigate();

    // --- 1. Hàm lấy dữ liệu ---
    const fetchOrders = useCallback(async (page, size, status) => {
        setLoading(true);
        try {
            // Gọi API qua orderService (đã dùng axiosClient)
            const response = await getAllOrders(page - 1, size, status);
            
            console.log("API Response (fetchOrders):", response); // DEBUG: Kiểm tra cấu trúc dữ liệu thực tế

            // Vì axiosClient đã trả về response.data, nên 'response' ở đây chính là body từ server.
            // Tùy backend trả về, data thực sự có thể nằm trong response.result hoặc chính là response.
            // Dòng dưới đây ưu tiên lấy từ .result trước, nếu không có thì lấy chính nó.
            const data = response.result || response;

            // Cập nhật state với dữ liệu lấy được
            // Cần đảm bảo 'data.content' và 'data.totalElements' khớp với cấu trúc JSON từ server của bạn.
            setOrders(data.content || []); 
            setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: size,
                total: data.totalElements || 0,
            }));
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
            message.error("Không thể tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    }, []);

    // --- 2. Effect gọi API khi filter thay đổi ---
    useEffect(() => {
        fetchOrders(1, pagination.pageSize, filterStatus);
    }, [filterStatus, fetchOrders]);

    // --- 3. Các hàm xử lý sự kiện ---
    const handleTableChange = (newPagination) => {
        fetchOrders(newPagination.current, newPagination.pageSize, filterStatus);
    };

    const handleFilterChange = (value) => {
        setFilterStatus(value);
    };

    const handleRefresh = () => {
        fetchOrders(pagination.current, pagination.pageSize, filterStatus);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            message.success(`Đã cập nhật trạng thái thành: ${newStatus}`);
            handleRefresh();
        } catch (error) {
            // Lấy thông báo lỗi từ server nếu có
            const errorMsg = error.response?.data?.message || error.message || "Cập nhật trạng thái thất bại";
            message.error(errorMsg);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await cancelOrder(orderId);
            message.success("Đã hủy đơn hàng thành công!");
            handleRefresh();
        } catch (error) {
             const errorMsg = error.response?.data?.message || error.message || "Hủy đơn hàng thất bại";
            message.error(errorMsg);
        }
    };

    // --- 4. Cấu hình cột cho bảng ---
    const columns = [
        {
            title: "Mã ĐH",
            dataIndex: "id",
            key: "id",
            width: 100,
            render: (text) => <Tooltip title={text}><span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{text?.substring(0, 6)}</span></Tooltip>,
        },
        {
            title: "Khách hàng",
            dataIndex: "customerName",
            key: "customerName",
            ellipsis: true,
        },
        {
            title: "Ngày đặt",
            dataIndex: "requiredDate",
            key: "requiredDate",
            width: 120,
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            align: 'right',
            render: (price) =>
                <span style={{ fontWeight: 500, color: '#3f8600' }}>
                    {price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </span>,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 180,
            render: (status, record) => {
                let color = "default";
                if (status === "PENDING") color = "gold";
                else if (status === "PROCESSING") color = "blue";
                else if (status === "SHIPPED") color = "cyan";
                else if (status === "DELIVERED") color = "green";
                else if (status === "CANCELLED") color = "red";

                const isFinished = status === "DELIVERED" || status === "CANCELLED";

                return (
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Tag color={color} style={{ width: 'fit-content' }}>
                            {status}
                        </Tag>
                        {!isFinished && (
                            <Select
                                defaultValue={status}
                                size="small"
                                style={{ width: '100%' }}
                                onChange={(val) => handleStatusChange(record.id, val)}
                                variant="filled"
                            >
                                <Option value="PENDING" disabled>PENDING</Option>
                                <Option value="PROCESSING">PROCESSING</Option>
                                <Option value="SHIPPED">SHIPPED</Option>
                                <Option value="DELIVERED">DELIVERED</Option>
                            </Select>
                        )}
                    </Space>
                );
            },
        },
        {
            title: "Hành động",
            key: "action",
            align: 'center',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="default"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/orders/${record.id}`)}
                        />
                    </Tooltip>

                    {(record.status === 'PENDING' || record.status === 'PROCESSING') && (
                        <Popconfirm
                            title="Hủy đơn hàng"
                            description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                            onConfirm={() => handleDeleteOrder(record.id)}
                            okText="Đồng ý"
                            cancelText="Đóng"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Hủy đơn hàng">
                                <Button type="text" danger shape="circle" icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Card bordered={false} className="criclebox">
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={3} style={{ margin: 0 }}>Quản lý Đơn hàng</Title>
                <Space>
                    <Select
                        defaultValue=""
                        style={{ width: 180 }}
                        onChange={handleFilterChange}
                        options={[
                            { value: '', label: 'Tất cả trạng thái' },
                            { value: 'PENDING', label: 'Chờ xử lý (PENDING)' },
                            { value: 'PROCESSING', label: 'Đang xử lý (PROCESSING)' },
                            { value: 'SHIPPED', label: 'Đang giao (SHIPPED)' },
                            { value: 'DELIVERED', label: 'Đã giao (DELIVERED)' },
                            { value: 'CANCELLED', label: 'Đã hủy (CANCELLED)' },
                        ]}
                    />
                    <Button icon={<ReloadOutlined />} onClick={handleRefresh}>Làm mới</Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
                }}
                loading={loading}
                onChange={handleTableChange}
                bordered
                size="middle"
                scroll={{ x: 800 }}
            />
        </Card>
    );
};

export default AdminOrderDashboard;