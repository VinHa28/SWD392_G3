import axiosClient from "../api/axiosClient";

// POST localhost:8080/swd/products (Tạo Product) - Token needed
export const createProduct = (productData) => {
  /* productData: { name, description, imageUrl, stock, price, categories: [uuid] } */
  return axiosClient.post("/products", productData);
};

// GET localhost:8080/swd/products (Lấy danh sách Products, có filter)
export const getAllProducts = (filters = {}) => {
  /*
    filters có thể chứa:
    {
      search: "keyword",
      category: "uuid",
      minPrice: 10000,
      maxPrice: 500000
    }
  */
  const params = {};

  if (filters.search) params.search = filters.search;
  if (filters.category) params.category = filters.category;
  if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
  if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;

  return axiosClient.get("/products", { params });
};

// GET localhost:8080/swd/products/{id} (Lấy Product theo ID)
export const getProductById = (id) => {
  return axiosClient.get(`/products/${id}`);
};

// PUT localhost:8080/swd/products/{id} (Cập nhật Product)
export const updateProduct = (id, productData) => {
  /* productData: { name, description, imageUrl, stock, price, categories: [uuid] } */
  return axiosClient.put(`/products/${id}`, productData);
};

// DELETE localhost:8080/swd/products/{id} - Token needed
export const deleteProduct = (id) => {
  return axiosClient.delete(`/products/${id}`);
};
