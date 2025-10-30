import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { App as AntdApp } from "antd";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Layout
import MainLayout from "./layouts/MainLayout";

// Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Admin/Dashboard";
import AdminLogin from "./pages/Admin/AdminLogin";
import Profile from "./pages/Profile";
import CategoryPage from "./pages/CategoryPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const hasAdminRole =
    user.roles?.includes("ROLE_ADMIN") || user.roles?.includes("ADMIN");

  if (!hasAdminRole) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <Router>
      <AntdApp>
        <AuthProvider>
          <Routes>
            {/* ----------- Public pages (MainLayout) ----------- */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/category/:id" element={<CategoryPage />} />
            </Route>

            {/* ----------- Auth pages ----------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login-admin" element={<AdminLogin />} />

            {/* ----------- Admin page (Dashboard) ----------- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ----------- Fallback ----------- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </AntdApp>
    </Router>
  );
}
