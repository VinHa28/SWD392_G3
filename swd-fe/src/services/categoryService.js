import axiosClient from "../api/axiosClient";

// POST localhost:8080/swd/categories (Tạo Category) - Token needed
export const createCategory = (categoryData) => {
  // categoryData: { name, description, imageUrl }
  return axiosClient.post("/categories", categoryData);
};

// GET localhost:8080/swd/categories (Lấy danh sách Categories) - Token needed
export const getAllCategories = (params) => {
  return axiosClient.get("/categories", { params });
};

// GET localhost:8080/swd/categories/{id} (Lấy Category theo ID) - Token needed
export const getCategoryById = (id) => {
  return axiosClient.get(`/categories/${id}`);
};

// PUT localhost:8080/swd/categories/{id} (Cập nhật Category) - Token needed
export const updateCategory = (id, categoryData) => {
  // categoryData: { name, description, imageUrl }
  return axiosClient.put(`/categories/${id}`, categoryData);
};
