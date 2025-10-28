import axiosClient from "../api/axiosClient";
// POST localhost:8080/swd/auth/token (Login)
export const login = (credentials) => {
  // credentials: { username: '...', password: '...' }
  return axiosClient.post("/auth/token", credentials);
};
// POST localhost:8080/swd/users (Signup)
export const registerUser = (userData) => {
  /* userData: { 
            username, password, firstName, lastName, 
            dob, roles, phone, email, address  }  */
  userData.roles = ["USER"];
  return axiosClient.post("/users", userData);
};
// GET localhost:8080/swd/users (get users) - Token needed

export const getAllUsers = (params) => {
  // params có thể chứa phân trang (page, size) hoặc bộ lọc
  return axiosClient.get("/users", { params });
};
// GET localhost:8080/swd/users/{id} (Lấy thông tin người dùng theo ID) - Token needed

export const getUserById = (id) => {
  return axiosClient.get(`/users/${id}`);
};
// GET localhost:8080/swd/users/myInfo (Lấy thông tin người dùng hiện tại) - Token needed
export const getMyInfo = () => {
  return axiosClient.get("/users/myInfo");
};
// PUT localhost:8080/swd/users/{id} (Cập nhật thông tin người dùng) - Token needed
export const updateUser = (id, userData) => {
  /* userData: { password, firstName, lastName, dob, phone, email, address } */
  return axiosClient.put(`/users/${id}`, userData);
};
