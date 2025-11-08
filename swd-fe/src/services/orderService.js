import axiosClient from "../api/axiosClient";

// VITE_API_BASE_URL = http://localhost:8080/swd
// ENDPOINT cần thêm '/api/orders' để thành công thức: http://localhost:8080/swd/api/orders
const ENDPOINT = "/api/orders";

export const getAllOrders = (page = 0, size = 10, status = '') => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (status) {
        params.append('status', status);
    }
    return axiosClient.get(`${ENDPOINT}?${params.toString()}`);
};

export const getOrdersByUserId = (userId) => {
    return axiosClient.get(`${ENDPOINT}/user/${userId}`);
};

export const getOrderById = (orderId) => {
    return axiosClient.get(`${ENDPOINT}/${orderId}`);
};

export const updateOrderStatus = (orderId, newStatus) => {
    return axiosClient.put(`${ENDPOINT}/${orderId}/status`, { status: newStatus });
};

export const cancelOrder = (orderId) => {
    return axiosClient.delete(`${ENDPOINT}/${orderId}`);
};