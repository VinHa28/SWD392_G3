import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OrderStatusUpdater from './OrderStatusUpdater';

// Component này nhận 1 đơn hàng và cờ 'isAdmin'
const OrderRow = ({ order, isAdmin = false }) => {
    const [currentStatus, setCurrentStatus] = useState(order.status);

    return (
        <tr>
            <td>{order.id}</td>
            <td>{order.customer?.username || 'N/A'}</td>
            <td>{order.requiredDate}</td>
            <td>{order.totalPrice.toLocaleString()} VND</td>
            <td>
                {isAdmin ? (
                    <OrderStatusUpdater
                        currentStatus={currentStatus}
                        orderId={order.id}
                        onStatusUpdated={(newStatus) => setCurrentStatus(newStatus)}
                    />
                ) : (
                    <span>{currentStatus}</span>
                )}
            </td>
            <td>
                <Link to={`/orders/${order.id}`}>Xem chi tiết</Link>
            </td>
        </tr>
    );
};

export default OrderRow;