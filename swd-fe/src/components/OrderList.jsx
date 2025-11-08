import React from 'react';
import OrderRow from './OrderRow';

const OrderList = ({ orders = [], isAdmin = false }) => {
    if (orders.length === 0) {
        return <p>Không tìm thấy đơn hàng nào.</p>;
    }

    return (
        <table style={{ width: "100%", borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th>Mã ĐH</th>
                    <th>Khách hàng</th>
                    <th>Ngày đặt</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                    <OrderRow key={order.id} order={order} isAdmin={isAdmin} />
                ))}
            </tbody>
        </table>
    );
};

export default OrderList;