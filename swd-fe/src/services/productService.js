import axiosClient from "../api/axiosClient";

// POST localhost:8080/swd/products (Tạo Product) - Token needed
export const createProduct = (productData) => {
  /* productData: { name, description, imageUrl, stock, price, categories: [uuid] } */
  return axiosClient.post("/products", productData);
};
// GET localhost:8080/swd/products (Lấy danh sách Products) - Token needed
export const getAllProducts = (params) => {
  return axiosClient.get("/products", { params });
};

// GET localhost:8080/swd/products/{id} (Lấy Product theo ID) - Token needed
export const getProductById = (id) => {
  return axiosClient.get(`/products/${id}`);
};

// PUT localhost:8080/swd/products/{id} (Cập nhật Product) - Token needed
export const updateProduct = (id, productData) => {
  /* productData: { name, description, imageUrl, stock, price, categories: [uuid] } */
  return axiosClient.put(`/products/${id}`, productData);
};

// DELETE localhost:8080/swd/products/{id} - Token needed
export const deleteProduct = (id) => {
  return axiosClient.delete(`/products/${id}`);
};
