import React, { useState, useEffect } from 'react';
import { getOrdersByUserId } from '../services/orderService';
import OrderList from '../components/OrderList';

const UserOrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // !!! LƯU Ý !!!
    // Vì không có đăng nhập, chúng ta không biết "userId" là gì.
    // Bạn cần một cách nào đó để lấy ID, ví dụ: một ô input
    // Ở đây tôi tạm hardcode ID:
    const [userId, setUserId] = useState('your-user-id-123'); // <-- THAY ID NÀY

    useEffect(() => {
        if (!userId) {
            setError("Vui lòng nhập User ID.");
            setIsLoading(false);
            return;
        }

        const fetchUserOrders = async () => {
            setIsLoading(true);
            try {
                const response = await getOrdersByUserId(userId);
                setOrders(response.data);
            } catch {
                setError("Không thể tải lịch sử đơn hàng.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserOrders();
    }, [userId]);

    return (
        <div>
            <h2>Lịch sử Đơn hàng của tôi</h2>
            
            {/* (Ví dụ về ô input để lấy ID) */}
            <input 
                type="text" 
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Nhập User ID để xem"
            />
            
            {isLoading && <p>Đang tải...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!isLoading && !error && (
                <OrderList orders={orders} isAdmin={false} /> 
            )}
        </div>
    );
};

export default UserOrderHistory;