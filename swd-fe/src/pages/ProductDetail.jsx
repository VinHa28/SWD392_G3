import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:9998/api/products/${id}`)
            .then((res) => setProduct(res.data))
            .catch((err) => console.error(err));
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <div className="container">
            <Link to="/products">← Back to All Products</Link>
            <h2>{product.name}</h2>
            <img src={product.image} alt={product.name} />
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Price:</strong> {product.price} VND</p>
        </div>
    );
};

export default ProductDetail;
