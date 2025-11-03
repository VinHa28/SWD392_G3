// src/services/cartService.js
import axiosClient from '../api/axiosClient';

const cartService = {
  getMyCart: () => axiosClient.get("/carts/me"),

 addToCart: (productId, quantity = 1) =>
    axiosClient.post("/carts/me", { productId, quantity }),
  updateQuantity: (productId, quantity) =>
    axiosClient.put(`/carts/update?productId=${productId}&quantity=${quantity}`),

  // 🔴 Xóa sản phẩm khỏi giỏ
  removeItem: (productId) =>
    axiosClient.delete(`/carts/remove?productId=${productId}`),
};

export default cartService;