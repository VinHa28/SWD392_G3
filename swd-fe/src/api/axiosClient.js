import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Thêm các header mặc định khác nếu cần, ví dụ: 'Authorization'
  },
  timeout: 5000,
});

// Interceptor (Tùy chọn)
// Thêm Interceptor để xử lý request trước khi gửi
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token && !config.url.includes("/auth/token")) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor (Tùy chọn)
// Thêm Interceptor để xử lý response sau khi nhận
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về dữ liệu
    return response.data;
  },
  (error) => {
    // Xử lý lỗi tập trung, ví dụ: 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Có thể redirect người dùng về trang đăng nhập
      console.error("Unauthorized request. Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
