import React, { useState } from 'react';
import { updateOrderStatus } from '../services/orderService';

const OrderStatusUpdater = ({ currentStatus, orderId, onStatusUpdated }) => {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setIsLoading(true);
        try {
            await updateOrderStatus(orderId, newStatus);
            setStatus(newStatus);
            alert("Cập nhật thành công!");
            // Gọi callback để cha (OrderRow) biết
            if (onStatusUpdated) {
                onStatusUpdated(newStatus);
            }
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Cập nhật trạng thái thất bại!");
            setStatus(currentStatus); // Trả lại status cũ nếu lỗi
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <select value={status} onChange={handleStatusChange} disabled={isLoading}>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
        </select>
    );
};

export default OrderStatusUpdater;