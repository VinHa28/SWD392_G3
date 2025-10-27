// src/api/swdApi.js

import axiosClient from "./axiosClient";

// --- Endpoints Users and Authentication (Auth) ---
const authEndpoints = {
  // POST localhost:8080/swd/auth/token (Login)
  login: (credentials) => {
    // credentials: { username: '...', password: '...' }
    return axiosClient.post("/auth/token", credentials);
  },

  // POST localhost:8080/swd/users (Signup)
  registerUser: (userData) => {
    /* userData: { 
            username, password, firstName, lastName, 
            dob, roles, phone, email, address 
        } 
        */
    return axiosClient.post("/users", userData);
  },

  // GET localhost:8080/swd/users (get users) - Token needed
  getAllUsers: (params) => {
    // params có thể chứa phân trang (page, size) hoặc bộ lọc
    return axiosClient.get("/users", { params });
  },

  // GET localhost:8080/swd/users/{id} (Lấy thông tin người dùng theo ID) - Token needed
  getUserById: (id) => {
    return axiosClient.get(`/users/${id}`);
  },

  // GET localhost:8080/swd/users/myInfo (Lấy thông tin người dùng hiện tại) - Token needed
  getMyInfo: () => {
    return axiosClient.get("/users/myInfo");
  },

  // PUT localhost:8080/swd/users/{id} (Cập nhật thông tin người dùng) - Token needed
  updateUser: (id, userData) => {
    /*
        userData: {
            password, firstName, lastName, dob, phone, email, address
        }
        */
    return axiosClient.put(`/users/${id}`, userData);
  },
};

// --- Endpoints Categories ---
const categoryEndpoints = {
  // POST localhost:8080/swd/categories (Tạo Category) - Token needed
  createCategory: (categoryData) => {
    // categoryData: { name, description, imageUrl }
    return axiosClient.post("/categories", categoryData);
  },

  // GET localhost:8080/swd/categories (Lấy danh sách Categories) - Token needed
  getAllCategories: (params) => {
    return axiosClient.get("/categories", { params });
  },

  // GET localhost:8080/swd/categories/{id} (Lấy Category theo ID) - Token needed
  getCategoryById: (id) => {
    return axiosClient.get(`/categories/${id}`);
  },

  // PUT localhost:8080/swd/categories/{id} (Cập nhật Category) - Token needed
  updateCategory: (id, categoryData) => {
    // categoryData: { name, description, imageUrl }
    return axiosClient.put(`/categories/${id}`, categoryData);
  },
  // Thiếu endpoint DELETE trong Postman Collection, nếu có sẽ thêm ở đây
};

// --- Endpoints Products ---
const productEndpoints = {
  // POST localhost:8080/swd/products (Tạo Product) - Token needed
  createProduct: (productData) => {
    /*
        productData: {
            name, description, imageUrl, stock, price, categories: [uuid]
        }
        */
    return axiosClient.post("/products", productData);
  },

  // GET localhost:8080/swd/products (Lấy danh sách Products) - Token needed
  getAllProducts: (params) => {
    return axiosClient.get("/products", { params });
  },

  // GET localhost:8080/swd/products/{id} (Lấy Product theo ID) - Token needed
  getProductById: (id) => {
    return axiosClient.get(`/products/${id}`);
  },

  // PUT localhost:8080/swd/products/{id} (Cập nhật Product) - Token needed
  updateProduct: (id, productData) => {
    /*
        productData: {
            name, description, imageUrl, stock, price, categories: [uuid]
        }
        */
    return axiosClient.put(`/products/${id}`, productData);
  },

  // DELETE localhost:8080/swd/products/{id} - Token needed
  deleteProduct: (id) => {
    return axiosClient.delete(`/products/${id}`);
  },
};

const swdApi = {
  ...authEndpoints,
  ...categoryEndpoints,
  ...productEndpoints,
};

export default swdApi;
