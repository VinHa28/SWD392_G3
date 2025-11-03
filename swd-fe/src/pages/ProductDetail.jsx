import { useAuth } from "../contexts/AuthContext";
import cartService from "../services/cartService";
import { message, Button, Spin, Tag } from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductById } from "../services/productService";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        setProduct(res.data || res.result);
      } catch (err) {
        message.error("Failed to load product!");
      } finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if(!user){ message.warning("Đăng nhập để thêm vào giỏ!"); navigate("/login"); return; }
    setAdding(true);
    try {
await cartService.addToCart(product.id, 1); // ← product.id là String, 1 là Integer      message.success(`${product.name} đã thêm vào giỏ!`);
      window.dispatchEvent(new Event("cartUpdated")); // Header tự refresh
    } catch(err){
      message.error("Lỗi thêm giỏ hàng!");
    } finally { setAdding(false); }
  };

  if(loading) return <Spin size="large" style={{marginTop:100}} />;
  if(!product) return <p>Product not found</p>;

  return (
    <div style={{display:"flex", gap:40, padding:40}}>
      <img src={product.imageUrl} alt={product.name} style={{width:300,height:300}} />
      <div>
        <h1>{product.name}</h1>
        <p>{product.price?.toLocaleString("vi-VN")} ₫</p>
        <Button icon={<ShoppingCartOutlined />} loading={adding} onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Link to="/products"><Button icon={<ArrowLeftOutlined />}>Back</Button></Link>
      </div>
    </div>
  );
}
