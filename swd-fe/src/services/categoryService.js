import axiosClient from "../api/axiosClient";

// 🟢 POST /swd/categories - Tạo Category (Token required)
export const createCategory = (categoryData) => {
  // categoryData: { name, description, imageUrl }
  return axiosClient.post("/categories", categoryData);
};

// 🟢 GET /swd/categories - Lấy danh sách Categories (có filter)
export const getAllCategories = (filters = {}) => {
  /*
    filters có thể gồm:
    {
      search: "keyword",
      sort: "name_asc" | "name_desc",
      page: 1,
      limit: 10
    }
  */
  const params = {};

  if (filters.search) params.search = filters.search;
  if (filters.sort) params.sort = filters.sort;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  return axiosClient.get("/categories", { params });
};

// 🟢 GET /swd/categories/{id} - Lấy Category theo ID (Token required)
export const getCategoryById = (id) => {
  return axiosClient.get(`/categories/${id}`);
};

// 🟢 PUT /swd/categories/{id} - Cập nhật Category (Token required)
export const updateCategory = (id, categoryData) => {
  // categoryData: { name, description, imageUrl }
  return axiosClient.put(`/categories/${id}`, categoryData);
};

// 🟢 DELETE /swd/categories/{id} - Xóa Category (Token required)
export const deleteCategory = (id) => {
  return axiosClient.delete(`/categories/${id}`);
};
