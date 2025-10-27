import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Admin/Dashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { App as AntdApp } from "antd";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";

function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const hasAdminRole =
    user.roles?.includes("ROLE_ADMIN") || user.roles?.includes("ADMIN");
  if (!hasAdminRole) return <Navigate to="/login" replace />;
  return children;
}
export default function App() {
  return (
    <Router>
      <AntdApp>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </AntdApp>
    </Router>
  );
}
