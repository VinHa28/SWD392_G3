import axiosClient from "../api/axiosClient";

// POST localhost:8080/swd/categories (Tạo Category) - Token needed
export const createCategory = (categoryData) => {
  // categoryData: { name, description, imageUrl }
  return axiosClient.post("/categories", categoryData);
};

// GET localhost:8080/swd/categories (Lấy danh sách Categories, có filter)
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

// GET localhost:8080/swd/categories/{id} (Lấy Category theo ID) - Token needed
export const getCategoryById = (id) => {
  return axiosClient.get(`/categories/${id}`);
};

// PUT localhost:8080/swd/categories/{id} (Cập nhật Category) - Token needed
export const updateCategory = (id, categoryData) => {
  // categoryData: { name, description, imageUrl }
  return axiosClient.put(`/categories/${id}`, categoryData);
};
<<<<<<< Updated upstream
=======

// DELETE localhost:8080/swd/categories/{id} - Token needed
export const deleteCategory = (id) => {
  return axiosClient.delete(`/categories/${id}`);
};
>>>>>>> Stashed changes
